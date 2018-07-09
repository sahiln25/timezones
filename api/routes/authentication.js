const express = require('express');
const router = express.Router();

const User = require('../model/user');

const authenticate = require('../middleware/authenticate');
const bcrypt = require('bcryptjs');
const common = require('../common');
const config = require('../config');
const jwt = require('jsonwebtoken');
const sanitize = require('mongo-sanitize');

const sendJsonResponse = common.sendJsonResponse;

/**
 * Create Authentication
 * Will check login credentials and respond with a jwt token and success true if everything was correct.
 */
router.post('/', function(req, res, next) {
    let loginCredentials = req.body;
    loginCredentials.email = sanitize(loginCredentials.email);
    loginCredentials.password = sanitize(loginCredentials.password);

    if(common.checkValidEmail(loginCredentials.email, res) && common.checkValidPassword(loginCredentials.password, res)) {
        User.find({email: loginCredentials.email}, function(err, docs) {
            if(err) {
                console.log(err);
                sendJsonResponse(res, false, "There was an error processing your request.", 400);
            }
            else if(docs.length === 0) {
                sendJsonResponse(res, false, "No registered user with that e-mail address.", 400);
            }
            else {
                if(bcrypt.compareSync(loginCredentials.password, docs[0].password)) { //If the password matches/is valid
                    // create a jwt token for user which expires in 24h
                    let token = jwt.sign(docs[0].toJSON(), config.secret, {expiresIn: '24h'});
                    sendJsonResponse(res, true, "Successfully logged in.", 200, {"token": token});
                }
                else {
                    sendJsonResponse(res, false, "Invalid password. Please try again.", 400);
                }
            }
        });
    }
});


/**
 * Get Authentication
 * Check if authentication is valid
 */
router.get('/', authenticate, function(req, res, next) {
    sendJsonResponse(res, true, "Authentication is valid.", 200);
});


/**
 * Update Authentication
 */
router.put('/', function(req, res, next) {

});


/**
 * Delete Authentication
 */
router.delete('/', function(req, res, next) {

});


module.exports = router;