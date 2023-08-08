import { Schema, models, model } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    unique: [true, "the email should be unique"],
    required: [true, "the email is required"],
  },
  username: {
    type: String,
    required: [true, "the email is required"],
  },
  image: {
    type: String,
  },
});

const User = models.User || model("User", userSchema);
export default User;
