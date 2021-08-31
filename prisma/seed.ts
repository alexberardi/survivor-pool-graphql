import { PrismaClient, Prisma } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import * as nflTeamData from './nflTeams.json'
const prisma = new PrismaClient()

const firstUserMessageTypeId = uuidv4()
const secondUserMessageTypeId = uuidv4()
const thirdUserMessageTypeId = uuidv4()
const userMessageTypeData: Prisma.UserMessageTypeCreateInput[] = [
  {
    id: firstUserMessageTypeId,
    type: 'first-user-message-type',
  },
  {
    id: secondUserMessageTypeId,
    type: 'second-user-message-type',
  },
  {
    id: thirdUserMessageTypeId,
    type: 'third-user-message-type',
  },
]

const standardLeagueTypeId = uuidv4()
const freeLeagueTypeId = uuidv4()

const firstStandardLeagueId = uuidv4()
const secondStandardLeagueId = uuidv4()
const freeLeagueId = uuidv4()
const leagueTypeData: Prisma.LeagueTypeCreateInput[] = [
  {
    id: standardLeagueTypeId,
    name: 'Standard League',
    description: 'This is a standard league',
    leagues: {
      create: [
        {
          id: firstStandardLeagueId,
          name: 'Standard Survivor Pool League',
          description: 'Standard SP description',
          price: 10.0,
          startWeek: 1,
          completed: false,
          season: 2021,
        },
        {
          id: secondStandardLeagueId,
          name: 'Another Standard Survivor Pool League',
          description: 'Another Standard SP description',
          price: 15.0,
          startWeek: 1,
          completed: false,
          season: 2020,
        },
      ],
    },
  },
  {
    id: freeLeagueTypeId,
    name: 'Free League',
    description: 'This is a free league',
    leagues: {
      create: [
        {
          id: freeLeagueId,
          name: 'Another Standard Survivor Pool League',
          description: 'Another Standard SP description',
          price: 0,
          startWeek: 1,
          completed: false,
          season: 2020,
        },
      ],
    },
  },
]

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'Alice',
    email: 'alice@prisma.io',
    adminMessages: {
      create: [
        {
          message: 'This is the first message',
          visible: true,
          type: 'Error',
        },
      ],
    },
    userMessages: {
      create: [
        {
          typeId: firstUserMessageTypeId,
          message: 'This is the first message',
          readDate: null,
        },
      ],
    },
    playerTeams: {
      create: [
        {
          leagueId: firstStandardLeagueId,
          name: 'Seeded Standard League Team',
          active: true,
          paid: true,
          streak: 0,
        },
        {
          leagueId: freeLeagueId,
          name: 'Seeded Free League Team',
          active: true,
          paid: true,
          streak: 0,
        },
      ],
    },
  },
  {
    name: 'Nilu',
    email: 'nilu@prisma.io',
    adminMessages: {
      create: [
        {
          message: 'This is the second message',
          visible: false,
          type: 'Error',
        },
      ],
    },
    userMessages: {
      create: [
        {
          typeId: secondUserMessageTypeId,
          message: 'This is the second message',
          readDate: null,
        },
      ],
    },
    playerTeams: {
      create: [
        {
          leagueId: secondStandardLeagueId,
          name: 'Seeded Standard League Team',
          active: true,
          paid: true,
          streak: 0,
        },
        {
          leagueId: secondStandardLeagueId,
          name: 'Seeded Second Standard League Team',
          active: true,
          paid: true,
          streak: 0,
        },
        {
          leagueId: freeLeagueId,
          name: 'Another Seeded Free League Team',
          active: true,
          paid: true,
          streak: 0,
        },
      ],
    },
  },
  {
    name: 'Mahmoud',
    email: 'mahmoud@prisma.io',
  },
]

async function main() {
  console.log(`Start seeding ...`)

  nflTeamData.data.nflTeams.forEach(async (n) => {
    const teamExistenceCheck = await prisma.nflTeam.findFirst({
      where: { nickname: n.nickname },
    })

    if (!teamExistenceCheck) {
      await prisma.nflTeam.create({
        data: {
          abbreviation: n.abbreviation,
          fullName: n.fullName,
          location: n.location,
          nickname: n.nickname,
        },
      })
    }
  })

  for (const um of userMessageTypeData) {
    const userMessageType = await prisma.userMessageType.create({
      data: um,
    })
    console.log(`Created user message type with id: ${userMessageType.id}`)
  }
  for (const l of leagueTypeData) {
    const leagueType = await prisma.leagueType.create({
      data: l,
    })
    console.log(`Created league type with id: ${leagueType.id}`)
  }
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
