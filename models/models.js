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

const TaskSchema = Schema({
  title: String,
  description: String,
  admin_id: Schema.Types.ObjectId,
  assigned_users: [
    {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  due_date: Date,
  finished_date: Date,
  status: String,
});

const Admin = mongoose.model("admins", AdminSchema);
const User = mongoose.model("users", UserSchema);
const Task = mongoose.model("tasks", TaskSchema);

module.exports = { User, Task, Admin };
