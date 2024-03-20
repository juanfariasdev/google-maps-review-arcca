import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.services'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'

import request from 'supertest'

describe('List Establishment (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let accessToken: string

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[GET] /establishment', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Juan',
        email: 'juanpablo@gmail.com',
        password: await hash('12345678', 8),
      },
    })

    accessToken = jwt.sign({ sub: user.id })

    await prisma.establishment.create({
      data: {
        name: 'empresa 1',
        linkMap: 'http://google.com',
        linkReview: 'http://google.com',
      },
    })
    await prisma.establishment.create({
      data: {
        id: '1',
        name: 'empresa 2',
        linkMap: 'http://google.com',
        linkReview: 'http://google.com',
      },
    })

    const response = await request(app.getHttpServer())
      .get('/establishment')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(200)
    expect(response.body).length(2)

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: 'empresa 1',
          linkMap: 'http://google.com',
          linkReview: 'http://google.com',
        }),
        expect.objectContaining({
          id: expect.any(String),
          name: 'empresa 2',
          linkMap: 'http://google.com',
          linkReview: 'http://google.com',
        }),
      ]),
    )
  })
  test('[GET] /establishment with id query', async () => {
    const response = await request(app.getHttpServer())
      .get('/establishment')
      .query({
        id: '1',
      })
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(200)
    expect(response.body).length(1)

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: 'empresa 2',
          linkMap: 'http://google.com',
          linkReview: 'http://google.com',
        }),
      ]),
    )
  })
})
