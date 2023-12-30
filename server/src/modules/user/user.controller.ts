import { FastifyReply, FastifyRequest } from 'fastify'
import { CreateUserInput, LoginUserInput } from './user.schema'
import bcrypt from 'bcrypt'
import prisma from '../../utils/prisma'
import { HTTP_RESP_CODE as HttpStatus } from '../../common/constants'

const SALT_ROUNDS = 10

export async function createUser(
  req: FastifyRequest<{
    Body: CreateUserInput
  }>,
  reply: FastifyReply,
) {
  const { password, email, name } = req.body

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  })
  if (user) {
    return reply.code(HttpStatus.UNAUTHORIZED).send({
      message: 'User already exists with this email',
    })
  }

  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS)
    const user = await prisma.user.create({
      data: {
        password: hash,
        email,
        name,
      },
    })

    return reply.code(HttpStatus.CREATED).send(user)
  } catch (e) {
    return reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send(e)
  }
}
