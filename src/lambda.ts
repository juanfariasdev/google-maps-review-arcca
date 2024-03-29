import { NestFactory } from '@nestjs/core'
import { configure as serverlessExpress } from '@vendia/serverless-express'
import { AppModule } from './app.module'

let cachedServer

export const handler = async (event, context) => {
  if (!cachedServer) {
    const nestApp = await NestFactory.create(AppModule)
    await nestApp.init()

    const expressApp = nestApp.getHttpAdapter().getInstance()

    cachedServer = serverlessExpress({
      app: expressApp,
    })
  }

  return cachedServer(event, context)
}
