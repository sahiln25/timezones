const config = require('../config');
const jwt = require('jsonwebtoken');
const User = require('../model/user');

/**
 * authenticate function
 * This function is a middleware to check if the user is authenticated. If authenticated, the user may continue
 * with action, otherwise, return failure json.
 * @param req - the request including token
 * @param res - response to send
 * @param next - callback function if the user is authenticated
 */

module.exports = function(req, res, next) {
    let token = req.headers['x-access-token'];

    // verifies secret and checks exp
    if(token !== undefined && token !== '') {
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                return res.status(401).json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.authenticatedUser = decoded;
                //See if anything changed in the database
                User.findOne({_id: decoded._id, email: decoded.email, password: decoded.password, permission_level: decoded.permission_level}, function(err, docs) {
                    if(docs) {
                        return next();
                    }
                    else {
                        return res.status(401).json({
                            success: false,
                            message: "Invalid login token. Please get a new token by logging in."
                        });
                    }
                });
            }
        });
    } else {
        return res.status(401).json({
            success: false,
            message: "No login token found. Please get a new token by logging in."
        });
    }

};
