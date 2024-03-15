/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse } from 'axios'

export interface IReview {
  rating: number
  customerId: string
  customerName: string
  reviewText: string
  establishmentReply: string
}

interface TokenInsertion {
  insertToken(url: string, token: string): string
}

interface ResponseParser {
  parseResponse(item: string): JSON[]
}

class TokenInserter implements TokenInsertion {
  insertToken(url: string, token: string): string {
    const index = url.indexOf('!2s') + 3
    return token ? url.slice(0, index) + token + url.slice(index) : url
  }
}

class JsonResponseParser implements ResponseParser {
  parseResponse(item: string): JSON[] {
    const cleanedJson = item.replace(/^\)\]\}'/, '')
    return JSON.parse(cleanedJson)
  }
}

class GoogleReviewService {
  constructor(
    private tokenInserter: TokenInsertion,
    private responseParser: ResponseParser,
  ) {}

  async fetchReviews(url: string): Promise<IReview[]> {
    const reviews: IReview[] = []
    let token: string | null = null

    try {
      do {
        const paginatedQuery = this.tokenInserter.insertToken(url, token)

        // Handle potential network errors
        const response: AxiosResponse<any> = await axios.get(paginatedQuery)

        const structuredResponse: any[] = this.responseParser.parseResponse(
          response.data,
        )

        if (structuredResponse.length === 0) break

        const [, nextToken, reviewArray] = structuredResponse
        token = nextToken

        // Check for issues in the response structure
        if (!Array.isArray(reviewArray)) {
          throw new Error('Invalid response format: review array missing')
        }

        for (const reviewItem of reviewArray) {
          const [item] = reviewItem
          const review: IReview = {
            rating: Number(item[2][0][0]),
            customerId: item[1][4][0][13],
            customerName: item[1][4][0][4],
            // Destructure with optional chaining and nullish coalescing
            reviewText:
              item[2]?.[15]?.[0][0]
                ?.replaceAll(/\n$/g, '')
                .replaceAll(/\n/g, ' ') ?? null,
            establishmentReply:
              item[3]?.[14]?.[0][0]
                ?.replaceAll(/\n$/g, '')
                .replaceAll(/\n/g, ' ') ?? null,
          }

          reviews.push(review)
        }
      } while (token)
    } catch (error) {
      // Handle all errors including network errors from axios
      console.error('Error fetching reviews:', error)

      // Optionally return an empty array or handle the error differently based on your application logic
      return []
    }

    console.log('Avaliações obtidas:', reviews.length)
    return reviews
  }
}

export async function getReviewsByUrl(url: string): Promise<IReview[]> {
  const tokenInserter = new TokenInserter()
  const responseParser = new JsonResponseParser()
  const reviewService = new GoogleReviewService(tokenInserter, responseParser)

  const reviews = await reviewService.fetchReviews(url)

  return reviews
}
