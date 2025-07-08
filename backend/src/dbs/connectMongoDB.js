'use strict'

import mongoose from 'mongoose'
import env from '~/config/environment'
import { countConnect } from '~/helpers/checkConnect'

const { MONGODB_URI, DATABASE_NAME, BUILD_MODE } = env

class Database {
    constructor() {
        this.connect() // Call the connect method when creating an instance
    }

    //connect
    connect() {
        // if (BUILD_MODE === 'dev') {
        //     mongoose.set('debug', true)
        //     mongoose.set('debug', { color: true })
        // }

        mongoose
            .connect(MONGODB_URI, {
                maxPoolSize: 50,
                dbName: DATABASE_NAME,
            })
            // eslint-disable-next-line no-unused-vars
            .then((_) => {
                // eslint-disable-next-line no-console
                console.log('Connected Mongodb Success!')
                countConnect()
            })
            .catch((err) =>
                // eslint-disable-next-line no-console
                console.log(`Error Connect! \n Error: ${err.stack}`)
            )
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }
        return Database.instance
    }
}

const instanceMongodb = Database.getInstance()
export default instanceMongodb
