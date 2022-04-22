import mongoose from 'mongoose'

const restaurantSchema = new mongoose.Schema({
    name: String,
    password:String,
    img:String,
    logo:String,
    location:String,
    website:String,
    email:String,
    orders:[String],
    dishes:[{
        name:String,
        description:String,
        cost:Number,
        ingredients: [String],
        prepTime:Number,
        available:Boolean,
        img:String
    }],
    pastOrders:[String],
    verified:Boolean
})

export default new mongoose.model('restaurants', restaurantSchema)