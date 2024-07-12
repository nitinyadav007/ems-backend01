import {
  Module,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DirectiveLocation } from 'graphql/language';
import { GraphQLDirective } from 'graphql/type';
import { upperDirectiveTransformer } from './common/upper-case.directive';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { GlobalConfigModule } from '../ems-common/src/common/config/globalConfig.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ObjectIdScalar } from './common/objectId.sclar';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './admin/auth/auth.interceptor';
import { RedisPubSubModule } from './common/test.model';

@Module({
  imports: [
    JwtModule.register({
      secret: 'XAUUSD',
      signOptions: { expiresIn: '15m' },
      global: true,
    }),
    RedisPubSubModule,
    GlobalConfigModule,
    AdminModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [JwtModule],
      inject: [JwtService],
      useFactory: (jwtService: JwtService) => ({
        playground: false,
        debug: true,
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        autoSchemaFile: 'schema.gql',
        context: ({ req, connection }) => {
          if (connection) {
            // For WebSocket connections, the context will be set in onConnect
            return connection.context;
          }
          // For HTTP connections
          return { req };
        },
        transformSchema: (schema) => upperDirectiveTransformer(schema, 'upper'),
        buildSchemaOptions: {
          directives: [
            new GraphQLDirective({
              name: 'upper',
              locations: [DirectiveLocation.FIELD_DEFINITION],
            }),
          ],
        },
        subscriptions: {
          'graphql-ws': true,
          onConnect: async (req: any) => {
            console.log(req.connectionParams.Authorization);
            if (req.connectionParams.Authorization) {
              const headers = {
                authorization: req.connectionParams.Authorization,
              };
              const [, token] = req.connectionParams.Authorization.split(' ');
              if (!token) {
                throw new UnauthorizedException('Token missing');
              }
              try {
                const decoded = jwtService.verify(token);
                console.log(decoded);
                return { headers, user: decoded };
              } catch (err) {
                throw new NotFoundException('Auth! User not found');
              }
            } else {
              throw new UnauthorizedException('Authorization header missing');
            }
          },
        },
      }),
    }),
  ],
  controllers: [],
  providers: [
    ObjectIdScalar,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}

function checkAuth(request: any): string | undefined {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  console.log('type', token);
  return type === 'Bearer' ? token : undefined;
}
