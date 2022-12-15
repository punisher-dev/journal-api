import express from 'express'
import mongoose from 'mongoose'

// const categories = ['Food', 'Coding', 'Work', 'Other']

// const entries = [
//     {category: 'Food', content: 'Hello!'},
//     {category: 'Coding', content: 'Express is cool!'},
//     {category: 'Work', content: 'Another day at the office'}
// ]

// Connecting to Mongo db via mongoose
mongoose.connect('mongodb+srv://GusCostaCoder:MongooseMongoDB@cluster0.b1xw6jm.mongodb.net/journal?retryWrites=true&w=majority')
    .then((m) => console.log(m.connection.readyState === 1 ? 'Mongoose Connected' : 'Mongoose Failed to connect'))
    .catch((err) => console.log(err))

// creating a mongoose schame to define the structure of a model
const entrySchema = new mongoose.Schema({
    category: { type: String, required: true},
    content: { type: String, required: true}
})

// create a Mongoose model based on the schema
const EntryModel = mongoose.model('Entry', entrySchema)

// creating a mongoose schame to define the structure of a model
const categorySchema = new mongoose.Schema({
    category: { type: String, required: true}
})

// create a Mongoose model based on the schema
const CategoryModel = mongoose.model('Category', categorySchema)




const app = express()
const port = 4001

app.use(express.json())

app.get('/', (request, response) => response.send({ info: 'Journal API' }))

app.get('/categories', async (req, res) => res.send(await CategoryModel.find())) 

app.get('/categories/:id', async (req, res) => {
    try{
    const Category = await CategoryModel.findById(req.params.id)
    if (Category){
    res.send(Category)
    } else {
        res.status(404).send({error: 'Category not found'})
    }
}
catch (err) {
    res.status(500).send({error: err.message})
}
})

app.post('/categories', async (req, res) => {
    
    try{
    const { category } = req.body
    const newCategory = { category }
    const insertedCategory = await CategoryModel.create(newCategory)
    res.status(201).send(insertedCategory)
    }
    catch (err) {
        res.status(500).send({error: err.message})
    }
})

app.get('/entries', async (req, res) => res.send(await EntryModel.find()))

app.get('/entries/:id', async (req, res) => {
    try{
    const entry = await EntryModel.findById(req.params.id)
    if (entry){
    res.send(entry)
    } else {
        res.status(404).send({error: 'Entry not found'})
    }
}
catch (err) {
    res.status(500).send({error: err.message})
}
})

app.post('/entries', async (req, res) => {
    
    try{
    //to Debbug
    // console.log(req.body)
    // console.log(req.body.foo)

    // 1. Create a new entry object with values passed in from the request
    //Secure Way:
    // const newEntry = { category: req.body.category, content: req.body.content}
    //Even more secure way
    const { category, content } = req.body
    //Validation/sanitize
    const newEntry = { category, content }
    //Not Secure way:
    // res.send(req.body)
    // 2. Push the new entry to the entries array
    // entries.push(newEntry)
    const insertedEntry = await EntryModel.create(newEntry)
    // 3. Send the new entry with 201 status
    res.status(201).send(insertedEntry)
    }
    catch (err) {
        res.status(500).send({error: err.message})
    }
})

app.listen(port, () => console.log(`App running at http://localhost:${port}/`))
