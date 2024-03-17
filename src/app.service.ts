import { Injectable } from '@nestjs/common'
import { IReturnGetViews, getReviewsByUrl } from './components/getReviews'

@Injectable()
export class AppService {
  getReviews(): Promise<IReturnGetViews> {
    const url =
      'https://www.google.com/maps/rpc/listugcposts?authuser=0&hl=en&gl=br&pb=!1m8!1s0x9bd5b81cec9b05%3A0xc9b595f28b3ca216!3s!6m4!4m1!1e1!4m1!1e3!9b0!2m2!1i10!2s!5m2!1sXKzzZcilF4zW5OUP6O2QsA8!7e81!8m5!1b1!2b1!3b1!5b1!7b1!11m6!1e3!2e1!3sen!4sbr!6m1!1i2!13m1!1e1'
    return getReviewsByUrl(url)
  }
}
