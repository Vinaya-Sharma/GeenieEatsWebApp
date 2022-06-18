import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  name: String,
  stripeId: {
    type: String,
    default: "0",
  },
  email: String,
  itemId: String,
  itemName: String,
  itemImg: String,
  restName: String,
  restEmail: String,
  paid: {
    type: Boolean,
    default: false,
  },
  restLocation: String,
  itemCost: String,
  prepTime: Number,
  quantity: { type: Number, default: 1 },
  placed: { type: Boolean, default: false },
  completed: { type: String, default: "pending" },
  placedAt: {
    type: Date,
  },
});

export default new mongoose.model("orders", orderSchema);
