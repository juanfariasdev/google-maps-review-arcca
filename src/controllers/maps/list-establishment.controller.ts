import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common'
import { Establishment } from '@prisma/client'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'

import { PrismaService } from 'src/prisma/prisma.services'

@Controller('/establishment')
@UseGuards(JwtAuthGuard)
export class ListAllEstablishmentController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(): Promise<Establishment[]> {
    try {
      return await this.prisma.establishment.findMany({
        include: {
          reviews: {
            include: {
              customer: true,
            },
          },
        },
      })
    } catch (error) {
      console.log(error)
      throw new HttpException(
        'Erro ao processar a requisição.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
