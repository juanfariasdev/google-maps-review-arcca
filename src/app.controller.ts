import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { IReview } from './components/getReviews'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getReviews(): Promise<IReview[]> {
    return this.appService.getReviews()
  }
}
