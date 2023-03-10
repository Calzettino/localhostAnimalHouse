const express = require('express')
const router = express.Router()
const Item = require("../models/mItem")

//get all
router.get('/', async(req, res)=> {
    try{
        const items = await Item.find()
        res.json(items)
    } catch(err) {
        res.status(500).json({message: err.message})
    }


})
//get one
router.get('/:id', getItem, (req, res)=> {
    res.json(res.item)
})

//get 3 by type
router.get('/animal/:animal/species/:species/size/:size', async(req, res)=> {
    //console.log('ao')
    const animal = req.params.animal
    //console.log(animal)
    const species = req.params.species
    //console.log(species)
    const size = req.params.size
    //console.log(size)
    var items
    var moreItems
        items = await Item.aggregate([
            {$match: {$and: [{species: species}, {quantity: {$gt: 0}}, {$or: [{size: size}, {size:'All'}]}]}},
            { $sample: { size: 3}}])
    console.log(items)

        if(items.length<3){
            moreItems = await Item.aggregate([
                {$match: {$and: [{animal: animal}, {quantity: {$gt: 0}}]}},
                { $sample: { size: 3-items.length}}])
            moreItems.forEach(moreItems => {
                items.push(moreItems)
            })
        }
    //console.log(items)
    try{
        res.json(items)
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

//create one
router.post('/', async (req, res)=> {
    const item = new Item({
        name: req.body.name,
        price: req.body.price,
        img: req.body.img,
        quantity: req.body.quantity,
        description: req.body.description,
        size:req.body.size,
        species:req.body.species,
        animal:req.body.animal,
        category:req.body.category
    })
    try{
        const newItem = await item.save()
        res.status(201).json(newItem)
    } catch(err) {
        res.status(400).json({message: err.message})
    }
})
//update one
router.patch('/:id', getItem, async (req, res)=> {
    if(req.body.name != null){
        res.item.name=req.body.name
    }
    if(req.body.price != null){
        res.item.price=req.body.price
    }
    if(req.body.img != null){
        res.item.img=req.body.img
    }
    if(req.body.quantity != null){
        res.item.quantity=req.body.quantity
    }
    if(req.body.description != null){
        res.item.description=req.body.description
    }

    try{
        const updateItem = await res.item.save()
        res.json(updateItem)
    } catch(err){
        res.status(400).json({message: err.message}) //parametro non accettabile
    }

})
//delete one
router.delete('/:id', getItem, async (req, res)=> {
    try{
        await res.item.remove()
        res.json({message: 'Deleted Successfully'})
    } catch(err){
        res.status(500).json({message : err.message})
    }
})

async function getItem (req, res, next){
    let item
    try{
        item= await Item.findById(req.params.id)
        if(item==null){
            return res.status(404).json({message : 'Cannot find item'})
        }
    } catch(err){
        return res.status(500).json({message : err.message})
    }
    res.item=item
    next()
}

module.exports = router