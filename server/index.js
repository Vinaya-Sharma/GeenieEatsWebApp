import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import {signUpUser, loginUser, findUser, findMeals, addToCart, getCartItems, deleteCartItem, placeOrder, updateQuantity, history} from './logic/userLogic.js'
import {restaurantSignup, restaurantLogin, findRestaurants, findRestaurant, findTheRest, addDish, findDishes, deleteDish, updateMeal, setAvailability, getOrders, levelUp} from './logic/restaurantLogic.js'
import userSchema from './schemas/Users.js'
import 'dotenv/config'

const app = express()
app.use(cors())
app.use(express.json())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const PORT = process.env.PORT || 5000
const url = process.env.API_URI

mongoose.connect(url, { useUnifiedTopology: true,
    useNewUrlParser: true})
    
const db = mongoose.connection;
db.on('error', console.error.bind(console,"connection error"))
db.once('open', function(){
    console.log('CONNECTED')
})

app.post('/login', loginUser)
app.post('/signup', signUpUser)

app.post('/restaurant/signup', restaurantSignup)
app.post('/restaurant/login', restaurantLogin)

app.get('/findRestaurants', findRestaurants)
app.post('/findRestaurant', findRestaurant)
app.post('/findTheRestaurant', findTheRest)
app.post('/findUser', findUser)


app.post('/addDish/:email', addDish)
app.post('/findDishes', findDishes)
app.post('/deleteDish', deleteDish)
app.put('/updateMeal', updateMeal)
app.put('/updateAvailability', setAvailability)

app.post('/findMeals', findMeals)
app.post('/addToCart', addToCart)
app.post('/getCartItems', getCartItems)
app.post('/deleteCartItem', deleteCartItem)
app.put('/updateQuantity/:id', updateQuantity)
app.put('/placeOrder/:email', placeOrder)


app.post('/getOrders/:email', getOrders)
app.put('/levelUp', levelUp)
app.post('/history/:email', history)

app.listen(PORT, () => {
    console.log('server is working on', PORT)
})