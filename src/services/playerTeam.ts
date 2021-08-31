import { Context } from '../context'
import { UserInputError } from 'apollo-server'

export class PlayerTeamService {
  static createPlayerTeam = async (
    context: Context,
    leagueId: string,
    userId: string,
    name: string,
  ) => {
    const league = await context.prisma.league.findUnique({
      where: { id: leagueId },
    })
    if (!league) {
      throw new UserInputError('Invalid league id')
    } else if (league.completed) {
      throw new UserInputError('Invalid league. League is completed')
    }

    const user = await context.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new UserInputError('Invalid user id')
    }

    return context.prisma.playerTeam.create({
      data: {
        leagueId: leagueId,
        userId: userId,
        name: name,
        paid: false,
        active: true,
        streak: 0,
      },
    })
  }

  static updatePlayerTeam = async (
    context: Context,
    id: string,
    name: string,
  ) => {
    const playerTeam = context.prisma.playerTeam.findUnique({
      where: { id: id },
    })

    if (!playerTeam) {
      throw new UserInputError('Invalid team id')
    }

    return context.prisma.playerTeam.update({
      where: { id: id },
      data: {
        name: name,
      },
    })
  }

  static togglePlayerTeamActive = async (
    context: Context,
    id: string,
    active: boolean,
  ) => {
    const playerTeamDto = await PlayerTeamService.getPlayerTeamById(context, id)
    if (!playerTeamDto) {
      throw new UserInputError('Invalid player team id')
    }
    return await context.prisma.playerTeam.update({
      where: { id: id },
      data: {
        active: active,
      },
    })
  }

  static togglePlayerTeamPaid = async (
    context: Context,
    id: string,
    paid: boolean,
  ) => {
    const playerTeamDto = await PlayerTeamService.getPlayerTeamById(context, id)
    if (!playerTeamDto) {
      throw new UserInputError('Invalid player team id')
    }
    return await context.prisma.playerTeam.update({
      where: { id: id },
      data: {
        paid: paid,
      },
    })
  }

  static getPlayerTeamById = async (context: Context, id: string) => {
    return await context.prisma.playerTeam.findUnique({
      where: { id: id },
    })
  }
}
