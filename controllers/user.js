const { User } = require("../models/models");
const { validateRegister, validateLogin } = require("../controllers/validation");

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_KEY = process.env.JWT_KEY;
const BCRYPT_SALT = Number(process.env.BCRYPT_SALT);

const registerUser = async (req, res) => {
    const {name, email, password} = req.body;

    // Register info validation
    const isValid = validateRegister(req.body);
    if(isValid.error){
        return res.send({
            status: 401,
            message: 'Invalid input',
            data: isValid.error,
        })
    }

    // Check if any account is already registered with this account
    const check = await User.find({ email });
    if(check.length > 0){
        return res.send({
            status: 409,
            message: 'email already exists',
        })
    }

    // Generate an encrypted password to store in database
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT);

    // Create a new User document and save it in database
    const UserData = new User({
        user_name: name,
        email,
        password: hashedPassword
    })

    await UserData.save();

    res.send({
        status: 201,
        message: 'Registered Successfully',
    })

}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Check whether the login info is validate or not
    const isValid = validateLogin(req.body);

    if(isValid.error){
        return res.send({
            status: 401,
            message: 'Invalid input',
            data: isValid.error,
        })
    }

    // Get the user data if it exists, else return error message
    const UserData = await User.findOne({ email });

    if(!UserData){
        return res.send({
            status: 404,
            message: 'User not found',
        })
    }

    // Check if the password in database matches the given login password
    const check = await bcrypt.compare(password, UserData.password);

    if(!check){
        return res.send({
            status: 403,
            message: 'Incorrect password!'
        })
    }

    // Create a payload which will hold user data and create a JWT token
    const payload = {
        user_name: UserData.user_name,
        email,
        user_id: UserData._id,
    }

    const token = jwt.sign(payload, JWT_KEY);

    res.send({
        status: 200,
        message: 'Successfully logged in',
        token: token,
    })

}

module.exports = { registerUser, loginUser };