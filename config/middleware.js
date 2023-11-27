const jwt = require('jsonwebtoken');
const JWT_KEY = "secret";

// Authentication middleware
const isAuth = (req, res, next) => {
    const token = req.headers.token;
    if(!token){
        return res.send({
            status: 403,
            message: 'No token found. Login to access this page',
        })
    }

    // Verify token. If valid, store the payload data in locals, else return error message
    const payload = jwt.verify(token, JWT_KEY);
    if(!payload){
        return res.status(401).send({
            status: 401,
            message: 'Invaid token / User not logged in'
        });
    }

    req.locals = payload;
    next();
}

// Middleware to check whether the user is admin or not
const isAdmin = (req, res, next) => {
    if(!req.locals.admin_id){
        return res.send({
            status: 403,
            message: 'Only admins can access this page'
        })
    }
    next();
}

module.exports = { isAuth, isAdmin };

