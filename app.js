const http= require('http');
const express = require('express');
const app = express();
const mongoose=require('mongoose')

var cors = require('cors')
app.use(cors())
//rout4es
app.get('/', (req,res)=>{
    res.send('ao');
});

mongoose.connect('mongodb://127.0.0.1/animalHouse', { useNewUrlParser: true}, ()=>{
    console.log('connected to mongo db')
})
const db= mongoose.connection
db.on('error', (error)=> console.log(error))
db.once('open', () => {console.log('Connected to the database')})



//middleware
app.use(express.json());

const animalRouter = require('./routes/animal')
const itemRouter = require('./routes/item')
const userRouter = require('./routes/user')
const staffRouter = require('./routes/staff')
const serviceRouter = require('./routes/service')
const locationRouter = require('./routes/location')
const quizRouter = require('./routes/quiz')
const dogFactRouter = require('./routes/dogFact')

app.use('/animal', animalRouter)
app.use('/item', itemRouter)
app.use('/user', userRouter)
app.use('/staff', staffRouter)
app.use('/service', serviceRouter)
app.use('/location', locationRouter)
app.use('/quiz', quizRouter)
app.use('/dogFact', dogFactRouter)

app.listen(8000, ()=>{
    console.log('server started')
});