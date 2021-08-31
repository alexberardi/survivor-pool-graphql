import axios from 'axios'
import { Context } from '../context'
import { INflEndpointResponse } from '../espn/responseTypes'
import { NFL_SCOREBOARD_ENDPOINT } from '../espn/constants'

export class NflTeamService {
  static upsertTeams = async (context: Context) => {
    try {
      const response = await axios.get<INflEndpointResponse>(
        NFL_SCOREBOARD_ENDPOINT,
      )
      const events = response.data.events

      for (const event of events) {
        const competitions = event.competitions

        for (const competition of competitions) {
          for (const competitor of competition.competitors) {
            const teamExistenceCheck = await context.prisma.nflTeam.findFirst({
              where: { nickname: competitor.team.shortDisplayName },
            })
            if (!teamExistenceCheck) {
              await context.prisma.nflTeam.create({
                data: {
                  abbreviation: competitor.team.abbreviation,
                  fullName: competitor.team.displayName,
                  location: competitor.team.location,
                  nickname: competitor.team.shortDisplayName,
                  espnTeamId: parseInt(competitor.team.id),
                },
              })
            }
          }
        }
      }
    } catch (exception) {
      console.log('Error populating nfl teams')
      console.log(exception)
    }
    return await context.prisma.nflTeam.findMany()
  }
  static getNflTeamById = async (context: Context, id: string) => {
    return await context.prisma.nflTeam.findUnique({
      where: { id: id },
    })
  }
}
