import {
  arg,
  intArg,
  makeSchema,
  objectType,
  inputObjectType,
  asNexusMethod,
  enumType,
  nonNull,
  stringArg,
  booleanArg,
  floatArg,
  list,
} from 'nexus'
import { DateTimeResolver } from 'graphql-scalars'
import { Context } from './context'
import { NflTeamService } from './services/nflTeam'
import { GameService } from './services/game'
import { StadiumService } from './services/stadium'
import { PlayerTeamService } from './services/playerTeam'
import { PickService } from './services/pick'
import { AdminMessageService } from './services/adminMessage'
import { LeagueService } from './services/league'
export const DateTime = asNexusMethod(DateTimeResolver, 'date')

const Query = objectType({
  name: 'Query',
  definition(t) {
    // t.nonNull.list.field('adminMessages', {
    //   type: 'AdminMessage',
    //   resolve: (_parent, _args, context: Context) => {
    //     return context.prisma.adminMessage.findMany()
    //   },
    // })

    t.nonNull.list.field('adminMessagesGetVisible', {
      type: 'AdminMessage',
      resolve: (_parent, _args, context: Context) => {
        return context.prisma.adminMessage.findMany()
      },
    })

    t.nonNull.list.field('gamesByWeek', {
      type: 'Game',
      args: {
        week: intArg(),
      },
      resolve: (_parent, args, context: Context) => {
        return context.prisma.game.findMany({
          where: { week: args.week || undefined },
        })
      },
    })
    t.nonNull.list.field('nflTeams', {
      type: 'NflTeam',
      resolve: (_parent, _args, context: Context) => {
        return context.prisma.nflTeam.findMany()
      },
    })
    t.nonNull.list.field('leagues', {
      type: 'League',
      resolve: async (_parent, _args, context: Context) => {
        const current_season =
          (await context.prisma.league.aggregate({ _max: { season: true } })) ??
          0
        return context.prisma.league.findMany({
          where: { season: current_season._max.season || 2021 },
        })
      },
    })
    t.nonNull.list.field('playerTeams', {
      type: 'PlayerTeam',
      args: {
        leagueId: nonNull(stringArg()),
      },
      resolve: async (_parent, args, context: Context) => {
        return await context.prisma.playerTeam.findMany({
          where: { leagueId: args.leagueId },
        })
      },
    })
    t.nonNull.list.field('users', {
      type: 'User',
      resolve: (_parent, _args, context: Context) => {
        return context.prisma.user.findMany()
      },
    })
  },
})

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.nonNull.field('adminMessageCreate', {
      type: 'AdminMessage',
      args: {
        userId: nonNull(stringArg()),
        message: nonNull(stringArg()),
        type: nonNull(stringArg()),
        visible: nonNull(booleanArg()),
      },
      resolve: async (_, args, context: Context) => {
        return await AdminMessageService.createAdminMessage(
          context,
          args.userId,
          args.message,
          args.type,
          args.visible,
        )
      },
    })

    t.nonNull.field('adminMessageUpdate', {
      type: 'AdminMessage',
      args: {
        id: nonNull(stringArg()),
        userId: nonNull(stringArg()),
        message: nonNull(stringArg()),
        type: nonNull(stringArg()),
        visible: nonNull(booleanArg()),
      },
      resolve: async (_, args, context: Context) => {
        return await AdminMessageService.updateAdminMessage(
          context,
          args.id,
          args.userId,
          args.message,
          args.type,
          args.visible,
        )
      },
    })
    t.list.nonNull.field('nflTeamsPopulate', {
      type: 'NflTeam',
      resolve: async (_, args, context: Context) => {
        return await NflTeamService.upsertTeams(context)
      },
    })
    t.list.nonNull.field('gamesUpdate', {
      type: 'Game',
      resolve: async (_, args, context: Context) => {
        return await GameService.updateGames(context)
      },
    })
    t.nonNull.field('leagueCreate', {
      type: 'League',
      args: {
        data: nonNull(
          arg({
            type: 'LeagueCreateInput',
          }),
        ),
      },
      resolve: async (_, args, context: Context) => {
        return await LeagueService.createLeague(
          context,
          args.data.name,
          args.data.description,
          args.data.price,
          args.data.leagueTypeId,
          args.data.startWeek,
          args.data.completed,
          args.data.season,
        )
      },
    })

    t.nonNull.field('leagueUpdate', {
      type: 'League',
      args: {
        data: nonNull(
          arg({
            type: 'LeagueUpdateInput',
          }),
        ),
      },
      resolve: async (_, args, context: Context) => {
        return await LeagueService.updateLeague(
          context,
          args.data.id,
          args.data.name,
          args.data.description,
          args.data.price,
          args.data.leagueTypeId,
          args.data.startWeek,
          args.data.completed,
          args.data.season,
        )
      },
    })

    t.list.nonNull.field('stadiumsPopulate', {
      type: 'Stadium',
      resolve: async (_, args, context: Context) => {
        return await StadiumService.upsertStadiums(context)
      },
    })

    t.nonNull.field('pickMake', {
      type: 'Pick',
      args: {
        playerTeamId: nonNull(stringArg()),
        nflTeamId: nonNull(stringArg()),
        gameId: nonNull(stringArg()),
        week: nonNull(intArg()),
      },
      resolve: async (_, args, context: Context) => {
        return PickService.makePick(
          context,
          args.playerTeamId,
          args.gameId,
          args.week,
          args.nflTeamId,
        )
      },
    })

    t.nonNull.field('playerTeamCreate', {
      type: 'PlayerTeam',
      args: {
        leagueId: nonNull(stringArg()),
        userId: nonNull(stringArg()),
        name: nonNull(stringArg()),
      },
      resolve: async (_, args, context: Context) => {
        return await PlayerTeamService.createPlayerTeam(
          context,
          args.leagueId,
          args.userId,
          args.name,
        )
      },
    }),
      t.nonNull.field('playerTeamToggleActive', {
        type: 'PlayerTeam',
        args: {
          playerTeamId: nonNull(stringArg()),
          active: nonNull(booleanArg()),
        },
        resolve: async (_, args, context: Context) => {
          return await PlayerTeamService.togglePlayerTeamActive(
            context,
            args.playerTeamId,
            args.active,
          )
        },
      })
    t.nonNull.field('playerTeamTogglePaid', {
      type: 'PlayerTeam',
      args: {
        playerTeamId: nonNull(stringArg()),
        paid: nonNull(booleanArg()),
      },
      resolve: async (_, args, context: Context) => {
        return await PlayerTeamService.togglePlayerTeamPaid(
          context,
          args.playerTeamId,
          args.paid,
        )
      },
    })
    t.nonNull.field('playerTeamUpdate', {
      type: 'PlayerTeam',
      args: {
        id: nonNull(stringArg()),
        name: nonNull(stringArg()),
      },
      resolve: async (_, args, context: Context) => {
        return await PlayerTeamService.updatePlayerTeam(
          context,
          args.id,
          args.name,
        )
      },
    })
  },
})

const AdminMessage = objectType({
  name: 'AdminMessage',
  definition(t) {
    t.nonNull.string('id')
    t.nonNull.string('userId')
    t.nonNull.string('message')
    t.nonNull.boolean('visible')
    t.nonNull.string('type')
    t.field('user', {
      type: 'User',
      resolve: (parent, _, context: Context) => {
        return context.prisma.playerTeam
          .findUnique({
            where: { id: parent.id },
          })
          .user()
      },
    })
  },
})

const Game = objectType({
  name: 'Game',
  definition(t) {
    t.nonNull.string('id'), t.nonNull.string('homeTeamId')
    t.nonNull.int('homeTeamScore')
    t.nonNull.string('awayTeamId')
    t.nonNull.int('awayTeamScore')
    t.nonNull.string('dayOfWeek')
    t.date('gameDate')
    t.nonNull.string('quarter')
    t.nonNull.string('quarterTime')
    t.nonNull.int('week')
    t.nonNull.boolean('started')
    t.nonNull.string('stadiumId')
    t.nonNull.string('oddsId')
    t.nonNull.int('espnGameId')
    t.field('homeTeam', {
      type: 'NflTeam',
      resolve: (parent, _, context: Context) => {
        return context.prisma.game
          .findUnique({
            where: { id: parent.id },
          })
          .homeTeam()
      },
    })
    t.field('awayTeam', {
      type: 'NflTeam',
      resolve: (parent, _, context: Context) => {
        return context.prisma.game
          .findUnique({
            where: { id: parent.id },
          })
          .awayTeam()
      },
    })
    t.field('stadium', {
      type: 'Stadium',
      resolve: (parent, _, context: Context) => {
        return context.prisma.game
          .findUnique({
            where: { id: parent.id },
          })
          .stadium()
      },
    })
    t.nonNull.list.nonNull.field('picks', {
      type: 'Pick',
      resolve: (parent, _, context: Context) => {
        return context.prisma.game
          .findUnique({
            where: { id: parent.id },
          })
          .picks()
      },
    })
  },
})

const League = objectType({
  name: 'League',
  definition(t) {
    t.nonNull.string('id')
    t.nonNull.string('name')
    t.nonNull.string('description')
    t.nonNull.float('price')
    t.nonNull.string('leagueTypeId')
    t.nonNull.int('startWeek')
    t.nonNull.boolean('completed')
    t.nonNull.int('season')
    t.field('leagueType', {
      type: 'LeagueType',
      resolve: (parent, _, context: Context) => {
        return context.prisma.league
          .findUnique({
            where: { id: parent.id },
          })
          .leagueType()
      },
    })
    t.nonNull.list.nonNull.field('playerTeams', {
      type: 'PlayerTeam',
      resolve: (parent, _, context: Context) => {
        return context.prisma.league
          .findUnique({
            where: { id: parent.id },
          })
          .playerTeams()
      },
    })
  },
})

const LeagueType = objectType({
  name: 'LeagueType',
  definition(t) {
    t.nonNull.string('id')
    t.nonNull.string('name')
    t.nonNull.string('description')
    t.nonNull.list.nonNull.field('leagues', {
      type: 'League',
      resolve: (parent, _, context: Context) => {
        return context.prisma.leagueType
          .findUnique({
            where: { id: parent.id },
          })
          .leagues()
      },
    })
  },
})

const NflTeam = objectType({
  name: 'NflTeam',
  definition(t) {
    t.nonNull.string('id')
    t.nonNull.string('abbreviation')
    t.nonNull.string('location')
    t.nonNull.string('fullName')
    t.nonNull.string('nickname')
    t.nonNull.list.nonNull.field('homeGames', {
      type: 'Game',
      resolve: (parent, _, context: Context) => {
        return context.prisma.nflTeam
          .findUnique({
            where: { id: parent.id },
          })
          .homeGames()
      },
    }),
      t.nonNull.list.nonNull.field('awayGames', {
        type: 'Game',
        resolve: (parent, _, context: Context) => {
          return context.prisma.nflTeam
            .findUnique({
              where: { id: parent.id },
            })
            .awayGames()
        },
      }),
      t.nonNull.list.nonNull.field('picks', {
        type: 'Pick',
        resolve: (parent, _, context: Context) => {
          return context.prisma.nflTeam
            .findUnique({
              where: { id: parent.id },
            })
            .picks()
        },
      })
  },
})

const Odds = objectType({
  name: 'Odds',
  definition(t) {
    t.nonNull.string('id')
    t.nonNull.string('espnGameId')
    t.nonNull.string('details')
    t.nonNull.float('overUnder')
    t.nonNull.list.nonNull.field('game', {
      type: 'Game',
      resolve: (parent, _, context: Context) => {
        return context.prisma.odds
          .findUnique({
            where: { id: parent.id },
          })
          .games()
      },
    })
  },
})

const Pick = objectType({
  name: 'Pick',
  definition(t) {
    t.nonNull.string('id')
    t.nonNull.string('playerTeamId')
    t.nonNull.string('gameId')
    t.nonNull.int('week')
    t.nonNull.string('nflTeamId')
    t.field('playerTeam', {
      type: 'PlayerTeam',
      resolve: (parent, _, context: Context) => {
        return context.prisma.pick
          .findUnique({
            where: { id: parent.id },
          })
          .playerTeam()
      },
    })
    t.field('game', {
      type: 'Game',
      resolve: (parent, _, context: Context) => {
        return context.prisma.pick
          .findUnique({
            where: { id: parent.id },
          })
          .game()
      },
    })
    t.field('nflTeam', {
      type: 'NflTeam',
      resolve: (parent, _, context: Context) => {
        return context.prisma.pick
          .findUnique({
            where: { id: parent.id },
          })
          .nflTeam()
      },
    })
  },
})

const PlayerTeam = objectType({
  name: 'PlayerTeam',
  definition(t) {
    t.nonNull.string('id')
    t.nonNull.string('leagueId')
    t.nonNull.string('userId')
    t.nonNull.string('name')
    t.nonNull.boolean('active')
    t.nonNull.boolean('paid')
    t.nonNull.int('streak')
    t.field('league', {
      type: 'League',
      resolve: (parent, _, context: Context) => {
        return context.prisma.playerTeam
          .findUnique({
            where: { id: parent.id },
          })
          .league()
      },
    })
    t.field('user', {
      type: 'User',
      resolve: (parent, _, context: Context) => {
        return context.prisma.playerTeam
          .findUnique({
            where: { id: parent.id },
          })
          .user()
      },
    })
    t.nonNull.list.nonNull.field('picks', {
      type: 'Pick',
      resolve: (parent, _, context: Context) => {
        return context.prisma.playerTeam
          .findUnique({
            where: { id: parent.id },
          })
          .picks()
      },
    })
  },
})

const Stadium = objectType({
  name: 'Stadium',
  definition(t) {
    t.nonNull.string('id')
    t.nonNull.string('name')
    t.nonNull.string('city')
    t.nonNull.string('state')
    t.nonNull.string('roof')
    t.nonNull.list.nonNull.field('games', {
      type: 'Game',
      resolve: (parent, _, context: Context) => {
        return context.prisma.stadium
          .findUnique({
            where: { id: parent.id },
          })
          .games()
      },
    })
  },
})

const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.string('id')
    t.string('name')
    t.nonNull.string('email')
    t.nonNull.list.field('adminMessages', {
      type: 'AdminMessage',
      resolve: async (parent, _, context: Context) => {
        return context.prisma.user
          .findUnique({
            where: { id: parent.id },
          })
          .adminMessages()
      },
    })
    t.nonNull.list.nonNull.field('userMessages', {
      type: 'UserMessage',
      resolve: async (parent, _, context: Context) => {
        return await context.prisma.user
          .findUnique({
            where: { id: parent.id },
          })
          .userMessages()
      },
    })
    t.nonNull.list.nonNull.field('playerTeams', {
      type: 'PlayerTeam',
      resolve: (parent, _, context: Context) => {
        return context.prisma.user
          .findUnique({
            where: { id: parent.id },
          })
          .playerTeams()
      },
    })
  },
})

const UserMessage = objectType({
  name: 'UserMessage',
  definition(t) {
    t.nonNull.string('id')
    t.nonNull.string('message')
    t.nonNull.string('typeId')
    t.nonNull.date('createdAt')
    t.nonNull.boolean('read')
    t.nonNull.date('readDate')
    t.nonNull.string('userId')
    t.field('messageType', {
      type: 'UserMessageType',
      resolve: (parent, _, context: Context) => {
        return context.prisma.userMessage
          .findUnique({
            where: { id: parent.id },
          })
          .messageType()
      },
    })
    t.field('user', {
      type: 'User',
      resolve: (parent, _, context: Context) => {
        return context.prisma.userMessage
          .findUnique({
            where: { id: parent.id },
          })
          .user()
      },
    })
  },
})

const UserMessageType = objectType({
  name: 'UserMessageType',
  definition(t) {
    t.nonNull.string('id')
    t.nonNull.string('type')
    t.nonNull.list.nonNull.field('userMessages', {
      type: 'UserMessage',
      resolve: (parent, _, context: Context) => {
        return context.prisma.userMessageType
          .findUnique({
            where: { id: parent.id },
          })
          .userMessages()
      },
    })
  },
})

const SortOrder = enumType({
  name: 'SortOrder',
  members: ['asc', 'desc'],
})

const UserUniqueInput = inputObjectType({
  name: 'UserUniqueInput',
  definition(t) {
    t.int('id')
    t.string('email')
  },
})

const PostCreateInput = inputObjectType({
  name: 'PostCreateInput',
  definition(t) {
    t.nonNull.string('title')
    t.string('content')
  },
})

const UserCreateInput = inputObjectType({
  name: 'UserCreateInput',
  definition(t) {
    t.nonNull.string('email')
    t.string('name')
    t.list.nonNull.field('posts', { type: 'PostCreateInput' })
  },
})

const LeagueCreateInput = inputObjectType({
  name: 'LeagueCreateInput',
  definition(t) {
    t.nonNull.string('name')
    t.nonNull.string('description')
    t.nonNull.float('price')
    t.nonNull.string('leagueTypeId')
    t.nonNull.int('startWeek')
    t.nonNull.boolean('completed')
    t.nonNull.int('season')
  },
})

const LeagueUpdateInput = inputObjectType({
  name: 'LeagueUpdateInput',
  definition(t) {
    t.nonNull.string('id')
    t.nonNull.string('name')
    t.nonNull.string('description')
    t.nonNull.float('price')
    t.nonNull.string('leagueTypeId')
    t.nonNull.int('startWeek')
    t.nonNull.boolean('completed')
    t.nonNull.int('season')
  },
})

export const schema = makeSchema({
  types: [
    Query,
    Mutation,
    AdminMessage,
    Game,
    League,
    LeagueCreateInput,
    LeagueUpdateInput,
    LeagueType,
    NflTeam,
    Odds,
    Pick,
    PlayerTeam,
    Stadium,
    User,
    UserMessage,
    UserMessageType,
    UserUniqueInput,
    UserCreateInput,
    PostCreateInput,
    SortOrder,
    DateTime,
  ],
  outputs: {
    schema: __dirname + '/../schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  contextType: {
    module: require.resolve('./context'),
    export: 'Context',
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
})
