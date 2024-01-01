import { FastifyReply, FastifyRequest } from 'fastify'
import { CreateUserInput, LoginUserInput } from './user.schema'
import bcrypt from 'bcrypt'
import prisma from '../../utils/prisma'
import { HttpStatus as HttpStatus } from '../../common/constants'

const SALT_ROUNDS = 10

export async function createUser(
  req: FastifyRequest<{
    Body: CreateUserInput
  }>,
  reply: FastifyReply,
) {
  const { password, email, name } = req.body
  // TODO Validate input

  const user = await req.server.userService.getByEmail(email)
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

export async function loginUser(
  req: FastifyRequest<{
    Body: LoginUserInput
  }>,
  reply: FastifyReply,
) {
  const { email, password } = req.body
  // TODO validate input
  const user = await prisma.user.findUnique({ where: { email } })

  const isValidUser = user && (await bcrypt.compare(password, user.password))

  if (!user || !isValidUser) {
    return reply.code(HttpStatus.UNAUTHORIZED).send({
      message: "Invalid email or password"
    })
  }

  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
  }
  const token = req.jwt.sign(payload)

  reply.setCookie('access_token', token, {
    path: '/',
    httpOnly: true,
    secure: true,
  })

  return { accessToken: token }
}

export async function logoutUser(req: FastifyRequest, reply: FastifyReply) {
  reply.clearCookie('access_token')

  return reply.status(HttpStatus.OK).send({ message: 'Logout successful' })
}