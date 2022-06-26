var express = require('express')
var app = express()
var mongodb = require('mongodb');
app.set('view engine', 'hbs')
app.use(express.urlencoded({
    extended: true
}))

var MongoClient = require('mongodb').MongoClient
var url = 'mongodb+srv://CongNX:Cong10052002@cluster0.acmzc.mongodb.net/test'

app.get('/', async(req, res) => {
    let server = await MongoClient.connect(url)
    let dbo = server.db("ATNToys")
    let products = await dbo.collection('product').find().toArray()

    res.render('allProduct', {'products': products})
})

app.get('/delete/:id', async(req, res) => {
    let server = await MongoClient.connect(url)
    let dbo = server.db("ATNToys")
    await dbo.collection('product').deleteOne({
        _id: mongodb.ObjectId(req.params.id)
    })

    res.redirect('/')
})

app.post('/newProduct', async(req, res) => {
    let name = req.body.txtName
    let price = req.body.txtPrice
    let picture = req.body.txtPicture
    if (name.length <5) {
        res.render('newProduct', {
            'nameError': 'Name must be 5 length characters'
        })
        return
    }
    if (name.startsWith('L')){
        res.render('newProduct', {
            'nameError': 'Name must not be start with L'
        })
        return
    }
    for(i=0;i<price.length;i++){
        if(isNaN(price[i])){
            res.render('newProduct', {
                'priceError': 'Price must be number'
            })
            return
        }
    }
    if (picture=="") {
        res.render('newProduct', {
            'picError': 'Fill required'
        })
        return
    }
    let product = {
        'name': name,
        'price': price,
        'img': picture
    }
    let server = await MongoClient.connect(url)
    let dbo = server.db("ATNToys")
    await dbo.collection('product').insertOne(product)
    res.redirect('/')
})

app.get('/insert', (req, res) => {
    res.render('newProduct')
})

app.post('/search',async (req,res)=>{
    let name = req.body.txtName

    //1. ket noi den server co dia chi trong url
    let server = await MongoClient.connect(url)
    //truy cap Database ATNToys
    let dbo = server.db("ATNToys")
    //get data
    let products = await dbo.collection('product').find({'name': new RegExp(name,'i')}).toArray()
    res.render('allProduct',{'products':products})
})


const PORT = process.nextTick.PORT || 5000
app.listen(PORT)
console.log('server is running')