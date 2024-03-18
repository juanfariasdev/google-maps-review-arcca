import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { Establishment, Prisma } from '@prisma/client'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { IReviewReturn, getReviewsByUrl } from 'src/components/getReviews'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.services'
import { z } from 'zod'

const CreateReviewSchema = z.object({
  establishmentId: z.string(),
})

type CreateReviewBodySchema = z.infer<typeof CreateReviewSchema>

@Controller('/reviews')
@UseGuards(JwtAuthGuard)
export class CreateReviewController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateReviewSchema))
  async handle(@Body() body: CreateReviewBodySchema): Promise<boolean> {
    const { establishmentId } = CreateReviewSchema.parse(body)

    const establishment = await this.prisma.establishment.findUnique({
      where: { id: establishmentId },
    })

    if (!establishment) {
      throw new HttpException(
        'Estabelecimento não encontrado.',
        HttpStatus.NOT_FOUND,
      )
    }

    try {
      const { establishment: establishmentExtras, reviews } =
        await getReviewsByUrl(establishment.linkReview, establishmentId)

      if (
        establishmentExtras &&
        establishmentExtras.latitude &&
        establishmentExtras.longitude
      ) {
        await this.updateEstablishmentCoordinates(
          establishment,
          establishmentExtras,
        )
      }
      if (!reviews) return true
      await this.createOrUpdateReviews(establishmentId, reviews)

      return true
    } catch (error) {
      throw new HttpException(
        'Erro ao processar a requisição.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  private async updateEstablishmentCoordinates(
    establishment: Establishment,
    establishmentExtras: {
      latitude: number
      longitude: number
    },
  ): Promise<void> {
    await this.prisma.establishment.update({
      where: { id: establishment.id },
      data: {
        latitude: new Prisma.Decimal(establishmentExtras.latitude),
        longitude: new Prisma.Decimal(establishmentExtras.longitude),
      },
    })
  }

  private async createOrUpdateReviews(
    establishmentId: string,
    reviews: IReviewReturn[],
  ): Promise<void> {
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
