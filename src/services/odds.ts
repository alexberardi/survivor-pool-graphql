import axios, { AxiosResponse } from 'axios'
import { Context } from '../context'
import { INflEndpointResponse } from '../espn/responseTypes'
import { NFL_SCOREBOARD_ENDPOINT } from '../espn/constants'
import { ApolloError } from 'apollo-server'

export class OddsService {
  static upsertOdds = async (
    context: Context,
    response: AxiosResponse<INflEndpointResponse> | null,
  ) => {
    if (!response) {
      response = await axios.get<INflEndpointResponse>(NFL_SCOREBOARD_ENDPOINT)
    }

    if (!response || !response.data) {
      throw new ApolloError('Odds upsert broken')
    }

    const events = response.data.events

    for (const event of events) {
      const competitions = event.competitions
      for (const competition of competitions) {
        await context.prisma.odds.upsert({
          where: { espnGameId: parseInt(competition.id) },
          update: {
            espnGameId: parseInt(competition.id),
            details: competition.odds ? competition.odds[0].details : '',
            overUnder: competition.odds ? competition.odds[0].overUnder : 0,
          },
          create: {
            espnGameId: parseInt(competition.id),
            details: competition.odds ? competition.odds[0].details : '',
            overUnder: competition.odds ? competition.odds[0].overUnder : 0,
          },
        })
      }
    }
  }
}
