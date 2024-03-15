import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.services'
import { z } from 'zod'

const CreateAccountBodySchema = z.object({
  name: z.string().min(3, 'O nome deve conter pelo menos 3 dígitos'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve conter pelo menos 6 dígitos'),
})

type CreateAccountBodySchema = z.infer<typeof CreateAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(CreateAccountBodySchema))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = CreateAccountBodySchema.parse(body)

    const userWithSomeEmail = await this.prisma.user.findUnique({
      where: { email },
    })

    if (userWithSomeEmail) {
      throw new ConflictException('Email já cadastrado!')
    }

    const hashedPassword = await hash(password, 8)

    await this.prisma.user.create({
      data: { name, email, password: hashedPassword },
    })
  }
}
