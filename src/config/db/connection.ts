import mongoose from 'mongoose'

const { MONGO_DATABASE, MONGO_USER, MONGO_PASSWORD, MONGO_URI } = process.env

mongoose.connect(MONGO_URI as string, {useNewUrlParser: true, useUnifiedTopology: true, keepAlive: true, keepAliveInitialDelay: 300000})

const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log("***** Connection established to DB ******"))

export default mongoose