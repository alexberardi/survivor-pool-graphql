import { ApolloError } from 'apollo-server'
import { Context } from '../context'
import { UserInputError } from 'apollo-server'

export class AdminMessageService {
  static createAdminMessage = async (
    context: Context,
    userId: string,
    message: string,
    type: string,
    visible: boolean,
  ) => {
    const userDto = await context.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!userDto) {
      throw new UserInputError('Invalid User Id')
    }

    return await context.prisma.adminMessage.create({
      data: {
        userId,
        message,
        type,
        visible,
      },
    })
  }

  static updateAdminMessage = async (
    context: Context,
    id: string,
    userId: string,
    message: string,
    type: string,
    visible: boolean,
  ) => {
    const messageDto = await context.prisma.adminMessage.findUnique({
      where: { id: id },
    })

    if (!messageDto) {
      throw new UserInputError('Invalid message id')
    }

    const userDto = await context.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!userDto) {
      throw new UserInputError('Invalid User Id')
    }

    return await context.prisma.adminMessage.update({
      where: { id: id },
      data: {
        userId,
        message,
        type,
        visible,
      },
    })
  }
}
