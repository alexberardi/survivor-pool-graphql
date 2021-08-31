import { ApolloError } from 'apollo-server'
import { Context } from '../context'
import { UserInputError } from 'apollo-server'

export class LeagueTypeService {
  static getLeagueTypeById = async (context: Context, id: string) => {
    return await context.prisma.leagueType.findUnique({
      where: { id },
    })
  }
}
