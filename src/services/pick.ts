import { ApolloError } from 'apollo-server'
import { Context } from '../context'
import { GameService } from './game'
import { NflTeamService } from './nflTeam'
import { PlayerTeamService } from './playerTeam'
import { UserInputError } from 'apollo-server'

export class PickService {
  static makePick = async (
    context: Context,
    playerTeamId: string,
    gameId: string,
    week: number,
    nflTeamId: string,
  ) => {
    await GameService.updateGames(context)
    const maxWeek = await GameService.getMaxWeek(context)
    const gameDto = await GameService.getGameById(context, gameId)

    if (!gameDto) {
      throw new UserInputError('Invalid game id')
    } else if (gameDto.week !== maxWeek) {
      throw new UserInputError('Invalid week')
    } else if (gameDto.quarter !== 'P') {
      throw new UserInputError('Invalid selection. Game has already started')
    }

    const playerTeamDto = await PlayerTeamService.getPlayerTeamById(
      context,
      playerTeamId,
    )
    if (!playerTeamDto) {
      throw new UserInputError('Invalid player team id')
    } else if (!playerTeamDto.active) {
      throw new UserInputError('Player team is inactive')
    }

    const nflTeamDto = await NflTeamService.getNflTeamById(context, nflTeamId)
    const playerTeamPicks = await PickService.getPicksByPlayerTeamId(
      context,
      playerTeamId,
    )
    const alreadySelectedTeamCheck = playerTeamPicks.find(
      (p) => p.nflTeamId === nflTeamId && p.week !== week,
    )

    if (!nflTeamDto) {
      throw new UserInputError('Invalid nfl team id')
    } else if (alreadySelectedTeamCheck) {
      throw new UserInputError(
        `Invalid nfl team selected. Team was already chosen in week ${alreadySelectedTeamCheck.week}`,
      )
    } else if (
      nflTeamId !== gameDto.homeTeamId &&
      nflTeamId !== gameDto.awayTeamId
    ) {
      throw new UserInputError(`Invalid selection. TeamId ${nflTeamId} 
        named ${nflTeamDto.nickname} is not playing in game ${gameDto.id} between Home: ${gameDto.homeTeam.nickname} Away: ${gameDto.awayTeam.nickname}`)
    }

    const currentPick = await PickService.getPickByPlayerTeamIdAndWeek(
      context,
      playerTeamId,
      week,
    )

    if (!currentPick) {
      return await context.prisma.pick.create({
        data: {
          gameId: gameId,
          nflTeamId: nflTeamId,
          playerTeamId: playerTeamId,
          week: week,
        },
      })
    } else {
      const currentPickGame = await GameService.getGameById(
        context,
        currentPick.gameId,
      )
      if (!currentPickGame) {
        throw new ApolloError('Unable to find game with that id')
      }
      if (currentPickGame.quarter !== 'P') {
        throw new UserInputError(
          'Cannot change pick. The previously selected game has already started',
        )
      }

      return await context.prisma.pick.update({
        where: { id: currentPick.id },
        data: {
          gameId: gameId,
          nflTeamId: nflTeamId,
        },
      })
    }
  }

  static getPickByPlayerTeamIdAndWeek = async (
    context: Context,
    playerTeamId: string,
    week: number,
  ) => {
    return await context.prisma.pick.findFirst({
      where: { playerTeamId: playerTeamId, week: week },
    })
  }

  static getPicksByPlayerTeamId = async (
    context: Context,
    playerTeamId: string,
  ) => {
    return await context.prisma.pick.findMany({
      where: { playerTeamId: playerTeamId },
    })
  }
}
