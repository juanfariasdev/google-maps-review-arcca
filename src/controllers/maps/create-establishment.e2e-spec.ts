import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.services'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'

import request from 'supertest'

describe('Create Establishment (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[POST] /establishment', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Juan',
        email: 'juanpablo@gmail.com',
        password: await hash('12345678', 8),
      },
    })

    const accessToken = jwt.sign({ sub: user.id })
    const response = await request(app.getHttpServer())
      .post('/establishment')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        url: 'https://maps.app.goo.gl/nqsABVSeTCiHbJ327',
      })
    expect(response.status).toBe(201)

    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        linkMap: 'https://maps.app.goo.gl/nqsABVSeTCiHbJ327',
        linkReview: expect.any(String),
      }),
    )
  })
})
