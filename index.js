import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import {
  signUpUser,
  loginUser,
  findUser,
  findMeals,
  addToCart,
  getCartItems,
  deleteCartItem,
  placeOrder,
  updateQuantity,
  history,
  placeStripeOrder,
  checkAvailability,
  numDishes,
  impactReportUser,
} from "./logic/userLogic.js";
import {
  restaurantSignup,
  restaurantLogin,
  findRestaurants,
  findRestaurant,
  findTheRest,
  addDish,
  findDishes,
  deleteDish,
  updateMeal,
  setAvailability,
  getOrders,
  levelUp,
  impactReportRest,
  restNumDishes,
} from "./logic/restaurantLogic.js";
import dotenv from "dotenv";
import Stripe from "stripe";
import orderModel from "./schemas/Order.js";

const stripe = new Stripe(
  "sk_test_51Kv8nTG69IjSQdLWjfHJs2Ns7iJ8ZGLsOXEmjOoHGANUO17NIymd86kDYT3UNymqQ0hYcOm5UbFriTHr74APEGit00CHepBAGf"
);

const YOUR_DOMAIN = "https://geenieeatswebapp.herokuapp.com";

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5000",
      "https://checkout.stripe.com",
    ],
  })
);
app.use(express.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

dotenv.config();
const PORT = process.env.PORT || 5000;
const url = process.env.MONGO_API_URI;

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function () {
  console.log("CONNECTED");
});

app.post("/create-checkout-session", async (req, res) => {
  const items = req.body;
  const theLineItems = items?.map((item) => ({
    price_data: {
      currency: "cad",
      product_data: {
        name: item.itemName,
      },
      unit_amount: item.itemCost * 100,
    },
    adjustable_quantity: {
      enabled: true,
      minimum: 1,
    },
    quantity: item.quantity,
  }));

  try {
    const params = {
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      line_items: theLineItems,
      mode: "payment",
      success_url: `${YOUR_DOMAIN}/history/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/cancelled/`,
    };
    const session = await stripe.checkout.sessions.create(params);
    res.status(200).send(session);
  } catch (err) {
    console.log(err);
  }
});

app.post("/placeStripeOrder", async (req, res) => {
  try {
    const { orderId, user } = req.body;
    const session = await stripe.checkout.sessions.retrieve(orderId);

    const status = session.payment_status;
    //if status === paid update db --> set every item by the user to be paid
    if (status == "paid") {
      try {
        await orderModel.updateMany(
          { email: user, placed: false },
          {
            $set: {
              placed: true,
              placedAt: new Date(),
              paid: true,
            },
            function(err, result) {
              if (err) {
                console.log(err);
                res.status(404).send(err);
              } else {
                res.status(201).json("orders placed", result);
              }
            },
          }
        );
      } catch (err) {
        console.log(err);
        res.status(404).send("could not place order");
      }
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", loginUser);
app.post("/signup", signUpUser);

app.post("/restaurant/signup", restaurantSignup);
app.post("/restaurant/login", restaurantLogin);

app.get("/findRestaurants", findRestaurants);
app.post("/findRestaurant", findRestaurant);
app.post("/findTheRestaurant", findTheRest);
app.post("/findUser", findUser);

app.post("/addDish/:email", addDish);
app.post("/findDishes", findDishes);
app.post("/deleteDish", deleteDish);
app.put("/updateMeal", updateMeal);
app.put("/updateAvailability", setAvailability);

app.post("/findMeals", findMeals);
app.post("/addToCart", addToCart);
app.post("/getCartItems", getCartItems);
app.post("/deleteCartItem", deleteCartItem);
app.put("/updateQuantity/:id", updateQuantity);
app.put("/placeOrder/:email", placeOrder);

app.post("/getOrders/:email", getOrders);
app.put("/levelUp", levelUp);
app.post("/history/:email", history);

app.post("/checkAvailability", checkAvailability);
app.post("/numDishes", numDishes);
app.post("/impactReportUser", impactReportUser);

app.post("/impactReportRest", impactReportRest);
app.post("/restNumDishes", restNumDishes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "build")));
  app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("server is working on", PORT);
});
