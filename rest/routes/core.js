/* Import modules. */
import Client from 'bitcoin-core'
import ethers from 'ethers'
import moment from 'moment'
import { callNode } from 'nexajs'
import superagent from 'superagent'
import { v4 as uuidv4 } from 'uuid'

/* Initialize new Bitcoin client. */
const client = new Client({
    port: process.env.NEXA_RPC_PORT || 7227, // Testnet RPC port is 7229
    host: process.env.NEXA_RPC_HOST || '127.0.0.1',
    username: process.env.NEXA_RPC_USER || 'user',
    password: process.env.NEXA_RPC_PASS || 'password',
})

/**
 * Core (Node) Module
 *
 * @param {Object} req
 * @param {Object} res
 * @returns
 */
export default async (req, res) => {
    let action
    let address
    let body
    let endpoint
    let params
    let pkg
    let response

    try {
        body = req.body
        console.log('BODY', body)

        action = body.action
        address = body.address
        params = body.params

        const options = {
            username: 'user',
            password: 'password',
        }

        /* Validate body. */
        if (!body) {
            /* Set status. */
            res.status(400)

            /* Return error. */
            return res.json({
                error: 'Missing body parameter.'
            })
        }

        if (action === 'getbalance') {
            const balance = await client
                .getBalance('*', 0)
                .catch(err => {
                    console.error('ERROR (getbalance):', err)
                })
            // console.log('BALANCE', balance)
            return res.json(balance)
        }

        /* Handle mining candidate. */
        if (action === 'getminingcandidate') {
            /* Make core request. */
            response = await callNode(action, params, options)
            // console.log('RPC RESPONSE', response)

            /* Return response. */
            return res.json(response)
        }

        if (action === 'getmininginfo') {
            const miningInfo = await callNode(action, params, options)
            // console.log('MINING INFO', miningInfo)

            return res.json(miningInfo)
        }

        if (action === 'validateaddress') {
            const validateAddress = await callNode(action, params, options)
            // console.log('VALIDATE ADDRESS', validateAddress)

            return res.json(validateAddress)
        }

        if (!pkg) {
            /* Set status. */
            res.status(400)

            /* Return error. */
            return res.json({
                error: 'Invalid action requested.'
            })
        }

        /* Fallback. */
        return res.end('Oops! Something went wrong.')
    } catch (err) {
        console.error('CORE ERROR', err)

        return res.json(err)
    }
}
