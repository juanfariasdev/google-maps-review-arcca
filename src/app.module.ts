import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CreateAccountController } from './controllers/create-account.controller'
import { PrismaService } from './prisma/prisma.services'

@Module({
  imports: [],
  controllers: [AppController, CreateAccountController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
