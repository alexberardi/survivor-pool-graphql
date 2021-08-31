import axios from 'axios'
import { Context } from '../context'
import { INflEndpointResponse } from '../espn/responseTypes'
import { NFL_SCOREBOARD_ENDPOINT } from '../espn/constants'

export class StadiumService {
  static upsertStadiums = async (context: Context) => {
    const response = await axios.get<INflEndpointResponse>(
      NFL_SCOREBOARD_ENDPOINT,
    )
    const events = response.data.events
    await events.forEach(async (event) => {
      const competitions = event.competitions
      await competitions.forEach(async (competition) => {
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
      })
    })
    return await context.prisma.stadium.findMany()
  }
}
