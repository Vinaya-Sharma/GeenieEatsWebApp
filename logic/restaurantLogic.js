import express from "express";
import restaurantModel from "../schemas/Restaurants.js";
import orderSchema from "../schemas/Order.js";
import jwt from "jsonwebtoken";

export const restNumDishes = async (req, res) => {
  const { email } = req.body;
  try {
    const item = await orderSchema.aggregate([
      { $group: { _id: "$restEmail", sum_val: { $sum: "$quantity" } } },
    ]);
    const itemC = await orderSchema.count({ restEmail: email });
    const restNum = item.filter((value) => value._id == email);
    res.status(200).json(restNum[0].sum_val);
  } catch (err) {
    console.log(err);
  }
};

export const impactReportRest = async (req, res) => {
  const { slug } = req.body;
  console.log("slug", slug);

  try {
    const resp = await restaurantModel.findOne({
      slug: slug,
    });
    res.status(201).send(resp);
  } catch (err) {
    console.log(err);
  }
};

export const levelUp = async (req, res) => {
  const { id, completed } = req.body;

  try {
    orderSchema
      .findOne({ _id: id })
      .then((order) => {
        order.completed = completed;
        return order.save();
      })
      .then(() => {
        res.status(201).send("status updated");
      });
  } catch (err) {
    console.log(err);
  }
};

export const getOrders = async (req, res) => {
  const email = req.params.email;

  try {
    const resp = await orderSchema
      .find({
        restEmail: email,
        placed: true,
        placedAt: {
          $gte: new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000),
        },
      })
      .sort({ placedAt: "-1" });
    res.status(201).send(resp);
  } catch (err) {
    console.log(err);
  }
};

export const setAvailability = async (req, res) => {
  const { email, id, available } = req.body;

  try {
    await restaurantModel
      .findOne({ email })
      .then((store) => {
        const meal = store.dishes.id(id);
        meal.available = available;
        return store.save();
      })
      .then(() => {
        res.status(201).send("updated visibility");
      });
  } catch (err) {
    console.log(err);
    res.status(404).send("could not alter visibility");
  }
};

export const updateMeal = async (req, res) => {
  const { email, id, name, description, ingredients, cost, prepTime, img } =
    req.body;
  const available = true;

  const obj = {
    name,
    description,
    ingredients,
    cost,
    prepTime,
    img,
    available,
  };

  try {
    await restaurantModel
      .findOne({ email })
      .then((store) => {
        const meal = store.dishes.id(id);
        meal.set(obj);

        return store.save();
      })
      .then(() => {
        res.status(201).send("update successfull");
      });
  } catch (err) {
    console.log(err);
    res.status(404).send("could not update");
  }
};

export const deleteDish = async (req, res) => {
  const { id, email } = req.body;

  try {
    await restaurantModel.updateOne(
      { email: email },
      { $pull: { dishes: { _id: id } } }
    );
    res.status(201).send("dish deleted successfully");
  } catch (err) {
    res.status(404).send("could not delete this dish at the moment");
    console.log(err);
  }
};

export const findDishes = async (req, res) => {
  const { email } = req.body;

  try {
    const resp = await restaurantModel.findOne({ email });
    res.status(201).json(resp);
  } catch (err) {
    console.log(err);
    res.status(404).send("coulding find meals successfully");
  }
};

export const addDish = async (req, res) => {
  const { name, description, ingredients, cost, prepTime, img } = req.body;
  const available = true;
  const obj = {
    name,
    description,
    ingredients,
    cost,
    prepTime,
    img,
    available,
  };
  const restEmail = req.params.email;

  try {
    const resp = await restaurantModel.updateOne(
      {
        email: restEmail,
      },
      {
        $addToSet: {
          dishes: obj,
        },
      }
    );
    res.status(201).json("item added");
  } catch (err) {
    res.status(404);
    console.log(err);
  }
};

export const findTheRest = async (req, res) => {
  const { email } = req.body;

  try {
    const theRest = await restaurantModel.findOne({ email });
    res.status(201).json(theRest);
  } catch (err) {
    console.log(err);
    res.status(404).send("rest not found");
  }
};

export const findRestaurant = async (req, res) => {
  const { name } = req.body;

  try {
    const theRest = await restaurantModel.findOne({ name });
    res.status(201).json(theRest);
  } catch (err) {
    console.log(err);
    res.status(404).send("rest not found");
  }
};

export const findRestaurants = async (req, res) => {
  try {
    const restaurants = await restaurantModel.find({});
    res.status(201).json(restaurants);
  } catch (err) {
    console.log(err);
    res.status(404).send("failed");
  }
};

export const restaurantSignup = async (req, res) => {
  const { email, password } = req.body;
  const restaurant = restaurantModel(req.body);

  try {
    const restaurantLogin = await restaurant.save();
    const token = jwt.sign({ restaurant }, email, {
      expiresIn: 60 * 24,
    });
    res.status(200).json({ rest: restaurantLogin, token });
  } catch (err) {
    console.log(err);
    res.status(404).send("request recieved");
  }
};

export const restaurantLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const theRest = await restaurantModel.findOne({ email });

    if (theRest.password === password) {
      const token = jwt.sign({ theRest }, email, {
        expiresIn: 60 * 24,
      });
      res.status(201).send({ rest: theRest, token });
    } else {
      res.status(404).send("incorrect credentials");
    }
  } catch (err) {
    res.status(404).send("incorrect credentials");
    console.log(err);
  }
};
