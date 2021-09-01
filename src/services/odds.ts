import axios from 'axios'
import { Context } from '../context'
import { INflEndpointResponse } from '../espn/responseTypes'
import { NFL_SCOREBOARD_ENDPOINT } from '../espn/constants'

export class OddsService {
  static upsertOdds = async (context: Context) => {
    const response = await axios.get<INflEndpointResponse>(
      NFL_SCOREBOARD_ENDPOINT,
    )
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
