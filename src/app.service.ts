import { Injectable } from '@nestjs/common'
import { IReview, getReviewsByUrl } from './components/getReviews'

@Injectable()
export class AppService {
  getReviews(): Promise<IReview[]> {
    const url =
      'https://www.google.com/maps/rpc/listugcposts?authuser=0&hl=en&gl=br&pb=!1m8!1s0x9bd50c9e3bdca3%3A0x2c4fc7ac213d2944!3s!6m4!4m1!1e1!4m1!1e3!9b0!2m2!1i10!2s!5m2!1ss5_zZbvqOL7c5OUPgsu6-A8!7e81!8m5!1b1!2b1!3b1!5b1!7b1!11m6!1e3!2e1!3sen!4sbr!6m1!1i2!13m1!1e1'

    return getReviewsByUrl(url)
  }
}
