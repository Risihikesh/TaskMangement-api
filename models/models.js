const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminSchema = Schema({
  admin_name: String,
  email: String,
  password: String,
});

const UserSchema = Schema({
  user_name: String,
  email: String,
  password: String,
});

const Admin = mongoose.model("admins", AdminSchema);
const User = mongoose.model("users", UserSchema);



module.exports = { User, Admin };