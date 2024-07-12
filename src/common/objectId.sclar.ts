import { CustomScalar, Scalar } from '@nestjs/graphql';
import { ASTNode, Kind } from 'graphql';
import { Types } from 'mongoose';
import { ObjectId } from 'mongodb';

@Scalar('ObjectId')
export class ObjectIdScalar implements CustomScalar<string, Types.ObjectId> {
  description = 'MongoDB ObjectId custom scalar type';

  parseValue(value: string): ObjectId {
    return new Types.ObjectId(value); // value from the client input variables
  }

  serialize(value: ObjectId): string {
    return value.toString(); // value sent to the client
  }

  parseLiteral(ast: ASTNode): ObjectId {
    if (ast.kind === Kind.STRING) {
      return new Types.ObjectId(ast.value); // value from the client query
    }
    return null;
  }
}
