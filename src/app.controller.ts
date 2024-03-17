import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { IReturnGetViews } from './components/getReviews'
import { PrismaService } from './prisma/prisma.services'

@Controller()
export class AppController {
  constructor(
    private appService: AppService,
    private prisma: PrismaService,
  ) {}

  @Get('/prisma')
  async getPrisma() {
    return await this.prisma.user.findMany()
  }

  @Get()
  getReviews(): Promise<IReturnGetViews> {
    return this.appService.getReviews()
  }
}
