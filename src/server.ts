import { ApolloServer } from 'apollo-server'
import { schema } from './schema'
import { context } from './context'

const server = new ApolloServer({
  schema: schema,
  context: context,
  playground: true,
})
const PORT = process.env.PORT || 3000

server.listen(PORT).then(async ({ url }) => {
  console.log(`\
🚀 Server ready at: ${url}
⭐️ See sample queries: http://pris.ly/e/ts/graphql#using-the-graphql-api
  `)
})
