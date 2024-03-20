import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.services'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'

import request from 'supertest'

describe('Authenticate (E2E)', () => {
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

  test('[POST] /sessions', async () => {
    await prisma.user.create({
      data: {
        name: 'Juan',
        email: 'juanpablo@gmail.com',
        password: await hash('12345678', 8),
      },
    })
    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'juanpablo@gmail.com',
      password: '12345678',
    })
    expect(response.status).toBe(200)

    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
