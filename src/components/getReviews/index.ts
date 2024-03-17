/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma } from '@prisma/client'
import axios, { AxiosResponse } from 'axios'

// Interfaces
export interface IReviewReturn extends Prisma.ReviewCreateInput {}

interface IEstablishiment {
  id: string
  link: string
  name: string
  latitude: number
  longitude: number
}

export interface IReturnGetViews {
  establishment?: IEstablishiment | null
  reviews?: IReviewReturn[]
}

interface TokenInsertion {
  insertToken(url: string, token: string | null): string
}

interface ResponseParser {
  parseResponse(item: string): JSON[]
}

// Classes
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

// Serviço de Avaliações do Google
class GoogleReviewService {
  constructor(
    private tokenInserter: TokenInsertion,
    private responseParser: ResponseParser,
  ) {}

  async fetchReviews(url: string): Promise<IReturnGetViews> {
    let token: string | null = null
    const reviews: IReviewReturn[] = []
    let establishment: IEstablishiment | null = null

    try {
      do {
        const paginatedQuery = this.tokenInserter.insertToken(url, token)

        // Lidar com erros de rede potenciais
        const response: AxiosResponse<any> = await axios.get(paginatedQuery)

        const structuredResponse: any[] = this.responseParser.parseResponse(
          response.data,
        )

        if (structuredResponse.length === 0) break

        const [, nextToken, reviewArray] = structuredResponse
        token = nextToken

        // Verificar problemas na estrutura da resposta
        if (!Array.isArray(reviewArray)) {
          throw new Error(
            'Formato de resposta inválido: array de avaliações ausente',
          )
        }

        for (const reviewItem of reviewArray) {
          const [item] = reviewItem

          if (!establishment?.name) {
            const location = item[2][2][0][1][8][0]

            establishment = {
              id: '2393beb4-8d1d-445d-a158-a119bfc982d4',
              link: 'https://google.com',
              name: item[2][2][0][1][21][3][7][0],
              latitude: location[2],
              longitude: location[1],
            }
            console.log(establishment)
          }
          const customer = item[1][4][0]

          const review: IReviewReturn = {
            rating: Number(item[2][0][0]),
            approximateDate: item[1][6],
            text:
              item[2]?.[15]?.[0][0]
                ?.replaceAll(/\n$/g, '')
                .replaceAll(/\n/g, ' ') ?? null,
            reply:
              item[3]?.[14]?.[0][0]
                ?.replaceAll(/\n$/g, '')
                .replaceAll(/\n/g, ' ') ?? null,
                establishment: {
                  connect: {
                  id: establishment.id
                  },
                },

            customer: {
              connectOrCreate: {
                create: {
                  id: customer[13],
                  name: customer[4],
                  imageUrl: customer[3],
                },
                where: {
                  id: customer[13],
                },
              },
            },
          }

          reviews.push(review)
        }
      } while (token)
    } catch (error) {
      // Lidar com todos os erros, incluindo erros de rede do axios
      console.error('Erro ao buscar avaliações:', error)

      // Opcionalmente, retornar um array vazio ou lidar com o erro de forma diferente com base na lógica da sua aplicação
      return {}
    }

    console.log('Avaliações obtidas:', reviews.length)
    return {
      establishment,
      reviews,
    }
  }
}

// Função para obter avaliações por URL
export async function getReviewsByUrl(url: string): Promise<IReturnGetViews> {
  const tokenInserter = new TokenInserter()
  const responseParser = new JsonResponseParser()
  const reviewService = new GoogleReviewService(tokenInserter, responseParser)

  const reviews = await reviewService.fetchReviews(url)

  return reviews
}
