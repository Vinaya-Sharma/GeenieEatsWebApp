import mongoose from "mongoose";
import slug from "mongoose-slug-generator";
mongoose.plugin(slug);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  slug: { type: String, slug: "name", unique: true },
  orders: [String],
  pastOrders: [String],
});

export default mongoose.model("user", userSchema);
