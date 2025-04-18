require('dotenv')
const express = require('express')
const mongoose = require('mongoose')
const taskRoutes = require('./routes/taskRoutes')
const logger = require('./logger')
const errorHandler = require('./middleware/errorHandler')

const uri = "mongodb+srv://gabriel15:Caminando65@cluster0.z1ctu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


const app = express()
const PORT = process.env.PORT

mongoose.connect(uri)
	.then(() => logger.info('MongoDB connected succesfullyl'))
	.catch(err => logger.error('MongoDB connection error:', err))


app.use(express.json())
app.use('/api', taskRoutes)


process.on('unhandledRejection', (reason, promise) => {
	logger.error('!!! UNHANDLED REJECTION !!!', {
	  reason: reason instanceof Error ? { message: reason.message, stack: reason.stack } : reason,
	})	
})

process.on('uncaughtException', (error) => {
	logger.error('!!! UNCAUGHT EXCEPTION !!!', {
		message: error.message,
		stack: error.stack,
		name: error.name
	})	
	logger.info('Uncaught exception detected. Shutting down gracefully...')	
	process.exit(1) 
  })

app.use(errorHandler)

app.listen(PORT, () => {
	logger.info(`Server is running on http://localhost:${PORT}`)
})