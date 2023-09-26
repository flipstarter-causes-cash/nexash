/* Import modules. */
import PouchDB from 'pouchdb'

/* Initialize databases. */
const groupDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/transactions_group`) // LEGACY -- REMOVE
const groupTxsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/group_txs`)

export default async (_transaction) => {
    /* Initialize locals. */
    let group
    let output
    let outputs
    let result
    let scriptPubKey

    outputs = _transaction.vout

    for (let i = 0; i < outputs.length; i++) {
        /* Set output. */
        output = outputs[i]

        /* Set script public key. */
        scriptPubKey = output?.scriptPubKey

        /* Set group. */
        group = scriptPubKey?.group
        // console.log('HANDLING GROUP', typeof group, group)

        if (typeof group === 'undefined') {
            continue
        }
        // console.log('SCRIPT PUB KEY', scriptPubKey)

        result = await groupTxsDb
            .put({
                _id: _transaction.txidem,
                ..._transaction
            })
            .catch(err => {
                console.error(err)
            })

        // FIXME: THIS IS LEGACY -- REMOVE
        result = await groupDb
            .put({
                _id: _transaction.txidem,
                ..._transaction
            })
            .catch(err => {
                console.error(err)
            })
    }

    return result
}
