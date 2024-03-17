import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { IReviewReturn, getReviewsByUrl } from 'src/components/getReviews'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.services'
import { z } from 'zod'

const CreateReviewSchema = z.object({
  url: z.string().url(),
})

// Definindo o tipo para os dados de um estabelecimento
type EstablishmentData = {
  id: string
  name: string
  link: string
  latitude: number
  longitude: number
}

type CreateReviewBodySchema = z.infer<typeof CreateReviewSchema>

@Controller('/reviews')
export class CreateReviewController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateReviewSchema))
  async handle(@Body() body: CreateReviewBodySchema): Promise<boolean> {
    const { url } = CreateReviewSchema.parse(body)

    try {
      const { establishment, reviews } = await getReviewsByUrl(url)

      if (!establishment) {
        throw new HttpException(
          'Estabelecimento não encontrado.',
          HttpStatus.NOT_FOUND,
        )
      }

      const establishmentCreated =
        await this.createOrUpdateEstablishment(establishment)

      await this.createOrUpdateReviews(establishmentCreated.id, reviews)

      return true
    } catch (error) {
      throw new HttpException(
        'Erro ao processar a requisição.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  private async createOrUpdateEstablishment(establishment: EstablishmentData) {
    const { id, name, link, latitude, longitude } = establishment

    return this.prisma.establishment.upsert({
      where: { id },
      create: {
        id,
        name,
        link,
        latitude: new Prisma.Decimal(latitude),
        longitude: new Prisma.Decimal(longitude),
      },
      update: {
        name,
        link,
        latitude: new Prisma.Decimal(latitude),
        longitude: new Prisma.Decimal(longitude),
      },
    })
  }

  private async createOrUpdateReviews(
    establishmentId: string,
    reviews?: IReviewReturn[],
  ): Promise<void> {
    if (!reviews) return

    const reviewsByEstablishment = await this.prisma.review.findMany({
      where: { establishmentId },
    })

    for (const review of reviews) {
      const findReview = reviewsByEstablishment.find(
        (item) => item.customerId === review.customer.connectOrCreate?.where.id,
      )

      if (!findReview || !findReview.id) {
        await this.prisma.review.create({
          data: { ...review },
        })
      } else {
        await this.prisma.review.update({
          where: { id: findReview.id },
          data: review,
        })
      }
    }
  }
}
