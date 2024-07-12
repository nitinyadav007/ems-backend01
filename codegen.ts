import { codegen } from '@graphql-codegen/core';
import * as typescriptPlugin from '@graphql-codegen/typescript';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import 'dotenv/config';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { parse, printSchema } from 'graphql';

const pollingInterval = 1000;
let output: string;
if (!existsSync('build')) mkdirSync('build');

async function generateGraphQLTypes(
  schemaFilePath: string,
  outputFile: string,
  output?: string,
) {
  try {
    const schema = loadSchemaSync(schemaFilePath, {
      loaders: [new GraphQLFileLoader()],
    });
    const config = {
      documents: [],
      config: {
        namingConvention: 'keep',
      },
      filename: outputFile,
      schema: parse(printSchema(schema)),
      plugins: [
        {
          typescript: {},
        },
      ],
      pluginMap: {
        typescript: typescriptPlugin,
      },
    };
    let newOutput = await codegen(config);
    const constantsString = generateConstantsFromSubscriptions(newOutput);
    if (constantsString) {
      newOutput += '\n' + constantsString;
    }

    if (output !== newOutput) {
      output = newOutput;
      writeFileSync(outputFile, output);
    }
  } catch (e: any) {
    console.error(e.message);
  }

  setTimeout(
    () => generateGraphQLTypes(schemaFilePath, outputFile, output),
    pollingInterval,
  );
}

generateGraphQLTypes('schema.gql', 'build/graphql.ts', output).then(() =>
  console.log(`Watching schema at schema.gql`),
);

function generateConstantsFromSubscriptions(typeDefinitions: string): string {
  const match = typeDefinitions.match(/export type Subscription = {[^}]*}/);
  if (!match) return '';

  const subscriptionType = match[0];
  const lines = subscriptionType.split('\n');
  const constantDeclarations: string[] = [];

  lines.forEach((line) => {
    const match = line.trim().match(/(\w+):/);
    if (match) {
      const keyName = toSnakeCase(match[1]);
      constantDeclarations.push(
        `export const ${keyName.toUpperCase()} = '${match[1]}';`,
      );
    }
  });

  if (constantDeclarations.length === 0) return '';
  return constantDeclarations.join('\n');
}

function toSnakeCase(str: string) {
  return str
    .replace(/\.?([A-Z]+)/g, (x, y) => '_' + y.toLowerCase())
    .replace(/^_/, '');
}

export default generateGraphQLTypes;
