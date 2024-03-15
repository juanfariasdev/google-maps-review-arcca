import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { IReview } from './components/getReviews'
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
  getReviews(): Promise<IReview[]> {
    return this.appService.getReviews()
  }
}
