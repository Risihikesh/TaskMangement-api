const { Admin, Task, User } = require("../models/models");
const {
  validateRegister,
  validateLogin,
  validateTask,
} = require("../controllers/validation");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");

const JWT_KEY = process.env.JWT_KEY;
const BCRYPT_SALT = Number(process.env.BCRYPT_SALT);

const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  // Register info validation
  const isValid = validateRegister(req.body);
  if (isValid.error) {
    return res.send({
      status: 401,
      message: "Invalid input",
      data: isValid.error,
    });
  }

  // Check if any account is already registered with this account
  const check = await Admin.find({ email });
  if (check.length > 0) {
    return res.send({
      status: 409,
      message: "email already exists",
    });
  }

  // Generate an encrypted password to store in database
  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT);

  // Create a new Admin document and save it in database
  const AdminData = new Admin({
    admin_name: name,
    email,
    password: hashedPassword,
  });

  await AdminData.save();

  res.send({
    status: 201,
    message: "Registered Successfully",
  });
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  // Check whether the login info is validate or not
  const isValid = validateLogin(req.body);

  if (isValid.error) {
    return res.send({
      status: 401,
      message: "Invalid input",
      data: isValid.error,
    });
  }

  // Get the admin data if it exists, else return error message
  const AdminData = await Admin.findOne({ email });

  if (!AdminData) {
    return res.send({
      status: 404,
      message: "User not found",
    });
  }

  // Check if the password in database matches the given login password
  const check = await bcrypt.compare(password, AdminData.password);

  if (!check) {
    return res.send({
      status: 403,
      message: "Incorrect password!",
    });
  }

  // Create a payload which will hold admin data and create a JWT token
  const payload = {
    admin_name: AdminData.admin_name,
    email,
    admin_id: AdminData._id,
  };

  const token = jwt.sign(payload, JWT_KEY);

  res.send({
    status: 200,
    message: "Successfully logged in",
    token: token,
  });
};

const createTask = async (req, res) => {
  const { title, description, due_date, assigned_users } = req.body;
  const admin_id = req.locals.admin_id;

  // Validate the task details
  const isValid = validateTask(req.body);
  if (isValid.error) {
    return res.send({
      status: 401,
      message: "Invalid input",
      data: isValid.error,
    });
  }

  // Since the usre ids in assigned_users array will be in string, we convert it into
  // a valid mongoDB objectId and store it
  let assigned_users_list = [];
  if (assigned_users) {
    assigned_users_list = assigned_users.map(
      (id) => new mongoose.Types.ObjectId(id)
    );
  }
  const taskObj = new Task({
    title,
    description,
    due_date,
    status: 'In progress',
    admin_id,
    assigned_users: assigned_users_list,
  });

  await taskObj.save();
  res.send({
    status: 201,
    message: "Successfully created a task",
  });
};

const assignTask = async (req, res) => {
  const { task_id, user_id } = req.body;
  const admin_id = req.locals.admin_id;

  const taskData = await Task.findById(task_id);
  // If no data is found return 404 error
  if (!taskData) {
    return res.send({
      status: 404,
      message: "Not Found",
    });
  }
  // If the current admin is not the owner of this task, return error.
  // This can be changed by removing this if block, after that any admin can access
  // any task
  if (taskData.admin_id.toString() !== admin_id) {
    return res.send({
      status: 403,
      message:
        "Access Denied: You don't have permission to access or update data created by a different admin.",
    });
  }

  // Find and update the task
  await Task.findOneAndUpdate(
    { _id: task_id },
    { $push: { assigned_users: new mongoose.Types.ObjectId(user_id) } }
  );

  res.send({
    status: 200,
    message: "Successfully assigned the task",
  });
};

const fetchAllTasks = async (req, res) => {
  const admin_id = req.locals.admin_id;

  // finds all the tasks assigned by the current admin and populates 
  // the assigned user field automatically
  const tasksList = await Task.find({ admin_id }).populate("assigned_users", [
    "_id",
    "user_name",
  ]);
  if (tasksList.length == 0) {
    return res.send({
      status: 404,
      message: "No Task Found.",
    });
  }
  res.send({
    status: 200,
    message: "Successfully fetched all tasks",
    data: tasksList,
  });
};

const fetchById = async (req, res) => {
  const task_id = req.query.task_id;

  // Find and populate the task created by the admin
  const taskData = await Task.findById(task_id).populate("assigned_users", [
    "_id",
    "user_name",
  ]);
  if (!taskData) {
    return res.send({
      status: 404,
      message: "Task Not Found",
    });
  }

  res.send({
    status: 200,
    message: "Successfully fetched Task",
    data: taskData,
  });
};

const updateTask = async (req, res) => {
  const { task_id, title, description, due_date, status } = req.body;

  // If the admin updates the status by setting it to true,
  // that means the task has been finished and the finished date will
  // get updated to the current date on which the task finished
  const queryObj = {
    title,
    description,
    due_date,
    status: status ? 'Finished' : "In progress",
    finished_date: status ? Date.now() : undefined,
  };

  try {
    await Task.findByIdAndUpdate(task_id, queryObj);
    return res.send({
      status: 200,
      message: "Successfully updated",
    });
  } catch (err) {
    return res.send({
      status: 400,
      message: "Failed to update",
      data: err,
    });
  }
};

const deleteTask = async (req, res) => {
  const task_id = req.query.task_id;

  try {
    await Task.findByIdAndDelete(task_id);
    return res.send({
      status: 200,
      message: "Deleted task successfully",
    });
  } catch (err) {
    return res.send({
      status: 400,
      message: "Failed to delete task",
      data: err,
    });
  }
};

const analytics = async (req, res) => {
  const days = Number(req.query.days);

  // Create a date object with current date.
  const date = new Date();
  // Subtract the "Date" from number of days and update is new date
  date.setDate(date.getDate() - days);

  // The updated date will work as the boundary
  const data = await Task.find({ finished_date: { $gte: date } });

  if (data.length == 0) {
    return res.send({
      status: 404,
      send: "No data found",
    });
  }

  return res.send({
    status: 200,
    message: "Data fetched successfully",
    data: data,
  });
};

module.exports = {
  registerAdmin,
  loginAdmin,
  createTask,
  assignTask,
  fetchAllTasks,
  fetchById,
  updateTask,
  deleteTask,
  analytics,
};
