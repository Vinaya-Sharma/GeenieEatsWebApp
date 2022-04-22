import express from 'express'
import userModel from '../schemas/Users.js'
import restaurantModel from '../schemas/Restaurants.js'
import orderModel from '../schemas/Order.js'

export const history = async(req,res) => {
    const email = req.params.email

    try{
        const resp = await orderModel.find({'email':email, "placed":true})
        res.status(201).send(resp)
    }catch(err){
        console.log(err)
    }
}

export const placeOrder = async(req,res) => {
    const email = req.params.email;
    const {placed, placedAt} = req.body;

    try{
        await orderModel.updateMany({"email":email, "placed":false}, {
            "$set": {
                "placed":placed,
                "placedAt":placedAt
            }, function(err,result){
                if(err){
                    res.status(404).send(err)
                } else{
                    res.status(201).json('orders placed', result)
                }
            }
        })
    }catch(err){
        console.log(err)
        res.status(404).send('could not place order')
    }
}

export const updateQuantity = async(req,res) => {
    const id = req.params.id;
    const {quantity} = req.body;

    try{
        await orderModel.findOne({"_id":id}).then((meal) => {
            meal.quantity = quantity;
            return meal.save()
        }).then(() => res.status(201).send('quantity updated successfully'))
    }catch(err){
        console.log(err)
        res.status(400).send('could not update order quantity')
    }
}


export const deleteCartItem = async(req,res) => {
    const {id} = req.body

    try{
        await orderModel.deleteOne({"_id":id})
        res.status(201).send('deletion successfull')
    }catch(err){
        console.log('could not remove from cart')
    }
}

export const getCartItems = async(req,res) => {
    const {email} = req.body

    try{
        const resp = await orderModel.find({email, placed:false}).exec()
        res.status(201).json(resp)
    }catch(err){
        console.log(err)
        res.status(404).send('cant find cart items')
    }
}

export const addToCart = async(req, res) => {
    const {name, email, itemName, prepTime,restEmail,itemImg, restName, restLocation, itemCost} = req.body
    const obj = {
        name, email, itemName, prepTime,itemImg, restEmail,restName, restLocation, itemCost
    }
    const meal = new orderModel(obj)

    try{
        meal.save()
        res.status(201).json(meal)
    }catch(err){
        console.log(err)
    }

}

export const findMeals = async(req,res) => {
    const {name} = req.body 

    try{
        const resp = await restaurantModel.findOne({name})
        res.status(201).json(resp)
    }catch(err){
        console.log(err)
    }
}

export const findUser = async(req,res) => {
    const {email} = req.body

    try{
        const theUser = await userModel.findOne({email})
        res.status(201).json(theUser)

    }catch(err){
        console.log(err)
        res.status(404).send('user not found')
    }
}

export const signUpUser = async(req,res) => {
    const user = new userModel(req.body)

    try{
        await user.save()
        res.status(200).json(user)
    }catch(err){
        res.status(404).send('email taken')
        console.log(err)
    }
}

export const loginUser = async (req,res) => {
    const {email, password} = req.body
    try{
        const theUser = await userModel.findOne({email})

        if (theUser.password === password){
            res.status(201).json(theUser)
        } else(
            res.status(404).send('invalid credentials')
        ) 
        }catch(err){
            res.status(404).send('invalid credentials')
        }}
