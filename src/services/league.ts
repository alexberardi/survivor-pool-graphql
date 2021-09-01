import { Context } from '../context'
import { UserInputError } from 'apollo-server'
import { LeagueTypeService } from './leagueType'

export class LeagueService {
  static createLeague = async (
    context: Context,
    name: string,
    description: string,
    price: number,
    leagueTypeId: string,
    startWeek: number,
    completed: boolean,
    season: number,
  ) => {
    const leagueTypeDto = await LeagueTypeService.getLeagueTypeById(
      context,
      leagueTypeId,
    )

    if (!leagueTypeDto) {
      throw new UserInputError('Invalid league type id')
    }

    return await context.prisma.league.create({
      data: {
        name,
        description,
        price,
        leagueTypeId,
        startWeek,
        completed,
        season,
      },
    })
  }
  static updateLeague = async (
    context: Context,
    id: string,
    name: string,
    description: string,
    price: number,
    leagueTypeId: string,
    startWeek: number,
    completed: boolean,
    season: number,
  ) => {
    const leagueTypeDto = await LeagueTypeService.getLeagueTypeById(
      context,
      leagueTypeId,
    )

    if (!leagueTypeDto) {
      throw new UserInputError('Invalid league type id')
    }

    return await context.prisma.league.update({
      where: { id },
      data: {
        name,
        description,
        price,
        leagueTypeId,
        startWeek,
        completed,
        season,
      },
    })
  }
}
