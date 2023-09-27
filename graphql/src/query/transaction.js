/* Import modules. */
import PouchDB from 'pouchdb'

/* Initialize databases. */
const logsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/logs`)
const transactionsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/transactions`)

/* Import types. */
import TransactionType from '../types/Transaction.js'

import {
    GraphQLInt,
    GraphQLList,
    GraphQLString,
} from 'graphql'

export default {
    type: new GraphQLList(TransactionType),
    args: {
        txidem: {
            type: new GraphQLList(GraphQLString),
            description: `Provide a __Transaction__ idem.`,
        },
        txid: {
            type: new GraphQLList(GraphQLString),
            description: `Provide a __Transaction__ id.`,
        },
    },
    resolve: async (_root, _args, _ctx) => {
        // console.log('Transaction (args):', _args)

        /* Initialize transaction. */
        let transaction = null

        /* Validate transaction id. */
        // if (!transaction && _args?.txid) {
        //     transaction = await transactionsDb
        //         .query('api/byHash', {
        //             key: _args.txidem[0],
        //         })
        //         .catch(err => console.error(err))
        //     console.log('TRANSACTION (by id):', transaction)
        // }

        /* Validate transaction height. */
        if (!transaction && _args?.txidem) {
            // NOTE: We MUST convert height (Int) to a (String).
            transaction = await transactionsDb
                .get(_args.txidem[0])
                .catch(err => console.error(err))
            // console.log('TRANSACTION (by idem):', transaction)
        }

        if (!transaction && _args?.txid) {
            // NOTE: We MUST convert height (Int) to a (String).
            transaction = await transactionsDb
                .query('api/byTxid', {
                    key: _args.txid[0],
                    include_docs: true,
                })
                .catch(err => console.error(err))
            // console.log('TRANSACTION (by id):', transaction)

            /* Retrieve (document) result. */
            if (transaction?.rows[0]?.doc) {
                transaction = transaction.rows[0].doc
            }
        }

        /* Validate transaction. */
        if (!transaction) {
            return []
        }

        /* Return transaction details. */
        return [transaction]
    },
    description: `Request full __Transaction__ details by _hash_ or _height_.`,
}