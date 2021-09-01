import axios, { AxiosResponse } from 'axios'
import { Context } from '../context'
import { INflEndpointResponse } from '../espn/responseTypes'
import { NFL_SCOREBOARD_ENDPOINT } from '../espn/constants'
import { responsePathAsArray } from 'graphql'
import { ApolloError } from 'apollo-server'

export class StadiumService {
  static upsertStadiums = async (
    context: Context,
    response: AxiosResponse<INflEndpointResponse> | null,
  ) => {
    if (!response) {
      response = await axios.get<INflEndpointResponse>(NFL_SCOREBOARD_ENDPOINT)
    }

    if (!response || !response.data) {
      throw new ApolloError('Stadiums upsert broken')
    }

    const events = response.data.events

    console.log('HERE HERE HERE HERE')
    for (const event of events) {
      const competitions = event.competitions

      for (const competition of competitions) {
        const stadiumInfo = competition.venue

        const stadiumExistenceCheck = await context.prisma.stadium.findUnique({
          where: { espnStadiumId: parseInt(stadiumInfo.id) },
        })

        if (!stadiumExistenceCheck) {
          await context.prisma.stadium.create({
            data: {
              name: stadiumInfo.fullName,
              city: stadiumInfo.address.city,
              state: stadiumInfo.address.state,
              roof: stadiumInfo.indoor ? 'indoor' : 'outdoor',
              espnStadiumId: parseInt(stadiumInfo.id),
            },
          })
        }
      }
    }

    return await context.prisma.stadium.findMany()
  }
}
