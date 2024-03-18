import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from './auth/auth.module'
import { CreateEstablishmentController } from './controllers/maps/create-establishment.controller'
import { CreateReviewController } from './controllers/maps/create-review.controller'
import { ListAllEstablishmentController } from './controllers/maps/list-establishment.controller'
import { AuthenticateController } from './controllers/user/authenticate-controller'
import { CreateAccountController } from './controllers/user/create-account.controller'
import { envSchema } from './env'
import { PrismaService } from './prisma/prisma.services'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateEstablishmentController,
    ListAllEstablishmentController,
    CreateReviewController,
  ],
  providers: [PrismaService],
})
export class AppModule {}
