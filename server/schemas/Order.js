import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    name:String,
    email:String,
    itemName:String,
    itemImg:String, 
    restName:String,
    restEmail:String,
    restLocation:String,
    itemCost:String,
    prepTime:Number,
    quantity:{type:Number, default:1},
    placed:{type:Boolean, default:false},
    completed:{type:String, default:'pending'},
    placedAt:{
        type:Date
    }
})

export default new mongoose.model('orders', orderSchema)