import cors from 'cors'
import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'

/* Set port. */
const PORT = 3000

// NOTE: Construct a schema, using GraphQL schema language.
const schema = buildSchema(`
  type Query {
    addr(base58: String, script: String): Address
    addrs(base58: [String], script: [String]): [Address]

    block(height: Int, hash: String): Block
    blocks(height: [Int], hash: [String]): [Block]

    token(id: String, owner: String): Token
    tokens(id: [String], owner: [String]): [Token]

    tx(txid: String, txidem: String): Transaction
    txs(txid: [String], txidem: [String]): [Transaction]
  }

  type Address {
    base58: String
    script: String
    type: String
  }

  type Block {
    height: Int
    hash: String
    txs: [Transaction]
  }

  type Token {
    id: String
  }

  type Transaction {
    txid: String
    txidem: String
    amount: Int
  }
`)

// NOTE: The root provides a resolver function for each API endpoint.
const rootValue = {
    addr: (_args) => {
        /* Set base58. */
        const base58 = _args?.base58 || 'nexa:my-awesome-address'

        return {
            base58,
            script: '001840888777666555444333222111',
            type: 'template',
        }
    },

    addrs: (_args) => {
        /* Set base58. */
        const base58 = _args?.base58 || 'nexa:my-awesome-address'

        return [{
            base58,
            script: '001840888777666555444333222111',
            type: 'template',
        }]
    },

    block: (_args) => {
        /* Set height. */
        const height = _args?.height || 201337

        return {
            height,
            hash: 'my-leet-hash',
            txs: [SAMPLE_TX],
        }
    },

    blocks: (_args) => {
        /* Set height. */
        const height = _args?.height || 201337

        return [{
            height,
            hash: 'my-leet-hash',
            txs: [SAMPLE_TX],
        }]
    },

    token: (_args) => {
        /* Set tokenid. */
        const tokenid = _args?.tokenid || 'my-leet-tokenid'

        return {
            tokenid,
            amount: 888.00
        }
    },

    tokens: (_args) => {
        /* Set tokenid. */
        const tokenid = _args?.tokenid || 'my-leet-tokenid'

        return [{
            tokenid,
            amount: 888.00
        }]
    },

    tx: (_args) => {
        /* Set txidem. */
        const txidem = _args?.txidem || 'my-leet-txidem'

        return {
            txid: 'my-leet-txid',
            txidem,
            amount: 1337.00
        }
    },

    txs: (_args) => {
        /* Set txidem. */
        const txidem = _args?.txidem || 'my-leet-txidem'

        return [{
            txid: 'my-leet-txid',
            txidem,
            amount: 1337.00
        }]
    },
}

/* Set interactive flag. */
const graphiql = true

/* Set options. */
const graphqlOptions = {
    schema,
    rootValue,
    graphiql,
}

/* Initialize application. */
const app = express()

/* Enable CORS. */
app.use(cors())

/* Setup GraphQL endpoint. */
app.use('/graphql', graphqlHTTP(graphqlOptions))

app.listen(PORT)
console.log(`Running a GraphQL API server at http://localhost:${PORT}/graphql`)
