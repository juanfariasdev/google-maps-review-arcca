import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { Establishment } from '@prisma/client'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { getEstablishment } from 'src/components/getEstablishment'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.services'
import { z } from 'zod'

const CreateEstablishmentSchema = z.object({
  url: z.string().url(),
})

type CreateEstablishmentBodySchema = z.infer<typeof CreateEstablishmentSchema>

@Controller('/establishment')
@UseGuards(JwtAuthGuard)
export class CreateEstablishmentController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateEstablishmentSchema))
  async handle(
    @Body() body: CreateEstablishmentBodySchema,
  ): Promise<Establishment> {
    const { url } = CreateEstablishmentSchema.parse(body)

    try {
      const getInfoFromLink = await getEstablishment(url)

      if (
        !getInfoFromLink ||
        !getInfoFromLink.id ||
        !getInfoFromLink.link ||
        !getInfoFromLink.name
      ) {
        throw new HttpException(
          'Estabelecimento não encontrado.',
          HttpStatus.NOT_FOUND,
        )
      }

      const { id, name, link } = getInfoFromLink

      const establishment = await this.prisma.establishment.upsert({
        where: { id },
        create: { id, name, linkMap: url, linkReview: link },
        update: { name, linkMap: url, linkReview: link },
      })

      return establishment
    } catch (error) {
      console.log(error)
      throw new HttpException(
        'Erro ao processar a requisição.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
