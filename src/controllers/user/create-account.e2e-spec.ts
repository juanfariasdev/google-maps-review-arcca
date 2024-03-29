import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.services'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import request from 'supertest'

describe('Create Account (E2E)', () => {
  let app: INestApplication

  let prisma: PrismaService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    await app.init()
  })

  test('[POST] /accounts', async () => {
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'Juan',
      email: 'juanpablo@gmail.com',
      password: '123456',
    })
    expect(response.status).toBe(201)

    const userDatabase = prisma.user.findUnique({
      where: {
        email: 'juanpablo@gmail.com',
      },
    })

    expect(userDatabase).toBeTruthy()
  })
})
