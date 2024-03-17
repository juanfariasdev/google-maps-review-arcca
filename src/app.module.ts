import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { CreateReviewController } from './controllers/maps/create-review.controller'
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
    AppController,
    CreateAccountController,
    AuthenticateController,
    CreateReviewController,
  ],
  providers: [AppService, PrismaService],
})
export class AppModule {}
