import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.services'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'

import request from 'supertest'

describe('Create Review (E2E)', () => {
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

  test('[POST] /reviews', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Juan',
        email: 'juanpablo@gmail.com',
        password: await hash('12345678', 8),
      },
    })

    await prisma.establishment.create({
      data: {
        id: '1',
        name: 'Test',
        linkMap: 'https://google.com',
        linkReview:
          'https://www.google.com/maps/rpc/listugcposts?authuser=0&hl=en&gl=br&pb=!1m8!1s0x94ca136a319ab859%3A0x541bc6382b1dbc0!3s!6m4!4m1!1e1!4m1!1e3!9b0!2m2!1i10!2s!5m2!1sGWL6ZfD1NI6J1sQPvYCvmAo!7e81!8m5!1b1!2b1!3b1!5b1!7b1!11m6!1e3!2e1!3sen!4sbr!6m1!1i2!13m1!1e1',
      },
    })

    const accessToken = jwt.sign({ sub: user.id })
    const response = await request(app.getHttpServer())
      .post('/reviews')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        establishmentId: '1',
      })
    expect(response.status).toBe(201)

    expect(response.body).toEqual(
      expect.objectContaining({
        establishment: expect.any(String),
        total: expect.any(Number),
      }),
    )
  })
})
