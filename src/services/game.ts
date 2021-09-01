import axios from 'axios'
import { Context } from '../context'
import { INflEndpointResponse } from '../espn/responseTypes'
import { NFL_SCOREBOARD_ENDPOINT } from '../espn/constants'
import { NflTeamService } from './nflTeam'
import { StadiumService } from './stadium'
import { OddsService } from './odds'
import moment from 'moment'

export class GameService {
  static updateGames = async (context: Context) => {
    const currentWeek =
      (await context.prisma.game.aggregate({ _max: { week: true } })) ?? 0

    const response = await axios.get<INflEndpointResponse>(
      NFL_SCOREBOARD_ENDPOINT,
    )

    await NflTeamService.upsertTeams(context, response)
    await StadiumService.upsertStadiums(context, response)
    await OddsService.upsertOdds(context, response)

    const week = response.data.week.number
    const events = response.data.events
    for (const event of events) {
      const competitions = event.competitions

      for (const competition of competitions) {
        const homeTeam = competition.competitors.find(
          (c) => c.homeAway === 'home',
        )

        const awayTeam = competition.competitors.find(
          (c) => c.homeAway === 'away',
        )

        const stadiumDto = await context.prisma.stadium.findUnique({
          where: { espnStadiumId: parseInt(competition.venue.id) },
        })

        const oddsDto = await context.prisma.odds.findUnique({
          where: { espnGameId: parseInt(competition.id) },
        })

        const homeTeamDto = await context.prisma.nflTeam.findUnique({
          where: { espnTeamId: parseInt(homeTeam?.id ?? '0') },
        })

        const awayTeamDto = await context.prisma.nflTeam.findUnique({
          where: { espnTeamId: parseInt(awayTeam?.id ?? '0') },
        })

        const status = event.status
        const espnGameId = parseInt(event.id)

        if (
          homeTeamDto &&
          homeTeam &&
          awayTeamDto &&
          awayTeam &&
          stadiumDto &&
          oddsDto
        ) {
          await context.prisma.game.upsert({
            where: { espnGameId: espnGameId },
            update: {
              homeTeamId: homeTeamDto.id,
              homeTeamScore: homeTeam.team.score ?? 0,
              awayTeamId: awayTeamDto.id,
              awayTeamScore: awayTeam.team.score ?? 0,
              dayOfWeek: moment(event.date).format('ddd'),
              gameDate: new Date(event.date),
              quarter: status.period === 0 ? 'P' : status.period.toString(),
              quarterTime: status.clock.toString(),
              week: week,
              started: status.period !== 0,
              stadiumId: stadiumDto.id,
              oddsId: oddsDto.id,
              espnGameId: espnGameId,
            },
            create: {
              homeTeamId: homeTeamDto.id,
              homeTeamScore: homeTeam.team.score ?? 0,
              awayTeamId: awayTeamDto.id,
              awayTeamScore: awayTeam.team.score ?? 0,
              dayOfWeek: moment(event.date).format('ddd'),
              gameDate: new Date(event.date),
              quarter: status.period === 0 ? 'P' : status.period.toString(),
              quarterTime: status.clock.toString(),
              week: week,
              started: status.period !== 0,
              stadiumId: stadiumDto.id,
              oddsId: oddsDto.id,
              espnGameId: espnGameId,
            },
          })
        }
      }
    }

    return await context.prisma.game.findMany({
      where: { week: currentWeek._max.week ?? 1 },
      orderBy: [
        {
          gameDate: 'asc',
        },
        {
          espnGameId: 'asc',
        },
      ],
    })
  }

  static getGameById = async (context: Context, id: string) => {
    return await context.prisma.game.findUnique({
      where: { id: id },
      include: {
        awayTeam: true,
        homeTeam: true,
      },
    })
  }

  static getMaxWeek = async (context: Context) => {
    const maxWeek = await context.prisma.game.aggregate({
      _max: {
        week: true,
      },
    })

    return maxWeek._max.week ?? 1
  }

  static getGamesByWeek = async (context: Context, week: number) => {
    await context.prisma.game.findMany({
      where: { week: week },
    })
  }
}
