'use strict'

import mongoose from 'mongoose'
import os from 'os'
import process from 'process'
const _SECONDS = 5000

// count Connect
export const countConnect = () => {
    const numConnection = mongoose.connections.length
    // eslint-disable-next-line no-console
    console.log(`Number of connections::${numConnection}`)
}

// check over load
export const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length
        const numCores = os.cpus().length
        const memoryUsage = process.memoryUsage().rss
        const maxConnections = numCores * 5

        // eslint-disable-next-line no-console
        console.log(`Active connections: ${numConnection}`)
        // eslint-disable-next-line no-console
        console.log(`Memory usage:: ${memoryUsage / 1024 / 1024} MB`)

        if (numConnection > maxConnections) {
            // eslint-disable-next-line no-console
            console.log('Connection overload detected!')
            // Handle when the number of connections exceeds the load. (VD: notify.send())
        }
    }, _SECONDS) // Monitor every 5
}
