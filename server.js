const express = require('express')
const mongoose = require('mongoose')
const taskRoutes = require('./routes/taskRoutes')

const uri = "mongodb+srv://gabriel15:Caminando65@cluster0.z1ctu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


const app = express()
const port = 3000

mongoose.connect(uri)
	.then(() => console.log('Connection succesful'))
	.catch(err => console.error('An error occurred:', err))

app.use(express.json())
app.use('/api', taskRoutes)

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}` )
})
