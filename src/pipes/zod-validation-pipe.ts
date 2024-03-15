import { BadRequestException, PipeTransform } from '@nestjs/common'
import { ZodError, ZodSchema } from 'zod'
import { fromZodError } from 'zod-validation-error'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}
  transform(value: unknown) {
    try {
      this.schema.parse(value)
    } catch (err) {
      if (err instanceof ZodError) {
        throw new BadRequestException({
          message: 'Erro de validação',
          statusCode: 400,
          errors: fromZodError(err),
        })
      }

      throw new BadRequestException('Erro de validação')
    }

    return value
  }
}
