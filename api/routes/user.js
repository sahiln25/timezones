const express = require('express');
const router = express.Router();

const ObjectId = require('mongodb').ObjectID;
const User = require('../model/user');
const Record = require('../model/Record');

const authenticate = require('../middleware/authenticate');
const bcrypt = require("bcryptjs");
const common = require('../common');
const config = require('../config');
const jwt = require('jsonwebtoken');
const sanitize = require('mongo-sanitize');

const sendJsonResponse = common.sendJsonResponse;


/**
 * Create User
 * Send response object with success = true if the user was successfully created.
 * Send response object with success = false and error message if the user wasn't able to be created.
 */
router.post('/', function(req, res, next) {
    let newUser = req.body;

    //Only continue if data is valid
    if(common.checkValidEmail(newUser.email, res) && common.checkValidPassword(newUser.password, res)) {
        newUser.email = sanitize(newUser.email);
        newUser.password = sanitize(newUser.password);

        User.find({email: newUser.email}, function(err, docs) {
            if(err) {
                console.log(err);
                sendJsonResponse(res, false, "There was an error processing your request.", 400);
            }
            else if(docs.length > 0) { //If e-mail was found in database, generate error
                sendJsonResponse(res, false, "This e-mail already exists in the database.", 409);
            }
            else {
                //Create user based on data submitted.
                let user = new User({email: newUser.email, password: bcrypt.hashSync(newUser.password, 10), permission_level: "REGULAR"});

                //Save it in the database.
                user.save(function (err) {
                    if (err) {
                        console.log(err);
                        sendJsonResponse(res, false, "There was an error processing your request.", 400);
                    }
                    else { //If everything is fine
                        //Create token to login the registered user which expires in 24h.
                        let token = jwt.sign(user.toJSON(), config.secret, {expiresIn: '24h'});
                        sendJsonResponse(res, true, "User has been registered!", 200, {"token": token});
                    }
                });
            }
        });
    }
});


/**
 * Get User Routes
 * Allows regular permission users to get their own info, or higher permission users to get a specific user or all users
 * Send response object with success = true and the user(s).
 * Send response object with success = false and error message if not able to get user.
 */
router.get('/all', authenticate, function(req, res, next) {
    let loggedInUser = req.authenticatedUser;
    if(common.permissions[loggedInUser.permission_level] >= 2) {
        User.find({}, {password: 0}, function(err, users) {
            if(err) {
                console.log(err);
                sendJsonResponse(res, false, "There was an error processing your request.", 400);
            }
            else {
                sendJsonResponse(res, true, "Successfully retrieved users.", 200, {"users": users});
            }
        });
    }
    else {
        sendJsonResponse(res, false, "Invalid permissions.", 403);
    }
});

router.get('/:id', authenticate, function(req, res, next) {
    let loggedInUser = req.authenticatedUser;
    let id = sanitize(req.params.id);

    if(common.permissions[loggedInUser.permission_level] >= 2 || id === loggedInUser._id) {
        if(common.checkValidMongoID(id, res)) {
            User.findOne({_id: id}, {password: 0}, function (err, user) {
                if (err) {
                    console.log(err);
                    sendJsonResponse(res, false, "There was an error processing your request.", 400);
                }
                else {
                    sendJsonResponse(res, true, "Successfully retrieved user.", 200, {"user": user});
                }
            });
        }
    }
    else {
        sendJsonResponse(res, false, "This action is forbidden.", 403);
    }
});

router.get('/', authenticate, function(req, res, next) {
    let loggedInUser = req.authenticatedUser;

    User.findOne({_id: loggedInUser._id}, {password: 0}, function (err, user) {
        if (err) {
            console.log(err);
            sendJsonResponse(res, false, "There was an error processing your request.", 400);
        }
        else {
            sendJsonResponse(res, true, "Successfully retrieved user.", 200, {"user": user});
        }
    });
});


/**
 * Update User
 * Send response object with success = true if the user was successfully updated.
 * Send response object with success = false and error message if the user wasn't able to be updated.
 */
router.put(['/:id', '/'], authenticate, function(req, res, next) {
    let loggedInUser = req.authenticatedUser;
    let updatedUserInfo = req.body;
    let id = sanitize(req.params.id);

    if(id === undefined) { //If no id parameter is given, we want to update the logged in user instead.
        id = loggedInUser._id;
    }

    updatedUserInfo.email = sanitize(updatedUserInfo.email);
    updatedUserInfo.password = sanitize(updatedUserInfo.password);
    updatedUserInfo.permission_level = sanitize(updatedUserInfo.permission_level);

    //Sanity checks for email, password and permission level.
    if(common.checkValidEmail(updatedUserInfo.email, res) && (updatedUserInfo.password === "" || common.checkValidPassword(updatedUserInfo.password, res)) && common.checkValidPermission(updatedUserInfo.permission_level, res)) {

        //A regular user can only update himself so this checks if the user being updated is himself or if a user manager or admin is updating the user
        if(common.permissions[loggedInUser.permission_level] >= 2 || id === loggedInUser._id) {
            if(common.checkValidMongoID(id, res)) {
                User.findOne({_id: ObjectId(id)}, function(err, user) {
                    if(err) {
                        sendJsonResponse(res, false, "There was an error processing your request.", 400);
                    }
                    else if(common.permissions[user.permission_level] > common.permissions[loggedInUser.permission_level]) {
                        sendJsonResponse(res, false, "Cannot update user with higher permission level.", 403);
                    }
                    else {
                        User.findOne({email: updatedUserInfo.email}, function(err, doc) {
                            if(doc && doc.email !== user.email) {
                                sendJsonResponse(res, false, "E-mail already exists.", 409);
                            }
                            else {
                                user.email = updatedUserInfo.email;
                                if(updatedUserInfo.password !== "") { //only want to update password if it was modified
                                    user.password = bcrypt.hashSync(updatedUserInfo.password);
                                }
                                if(updatedUserInfo.permission_level && common.permissions[loggedInUser.permission_level] >= 3) {
                                    user.permission_level = updatedUserInfo.permission_level;
                                }

                                user.save().then(function() {
                                    //create new token to send user if user updated himself
                                    if(user._id == loggedInUser._id) {
                                        let token = jwt.sign(user.toJSON(), config.secret, {expiresIn: '24h'});
                                        sendJsonResponse(res, true, "Successfully updated user.", 200, {"token": token});
                                    }
                                    else { //otherwise just update the user data, no token
                                        sendJsonResponse(res, true, "Successfully updated user.", 200);
                                    }
                                }, function(err) {
                                    console.log(err);
                                    sendJsonResponse(res, false, "There was an error processing your request.", 400);
                                });
                            }
                        });
                    }
                });
            }
        }
        else {
            sendJsonResponse(res, false, "This action is forbidden.", 403);
        }

    }
});


/**
 * Delete User
 * Allows a user id parameter for usage of user managers and admins to be able to delete a user that is not himself.
 * Send response object with success = true if the user was successfully deleted.
 * Send response object with success = false and error message if the user wasn't able to be deleted.
 */

router.delete(['/:id', '/'], authenticate, function(req, res, next) {
    let loggedInUser = req.authenticatedUser;
    let id = sanitize(req.params.id);

    if(id === undefined) { //If no id parameter is given, we want to delete logged in user instead.
        id = loggedInUser._id;
    }

    if(common.permissions[loggedInUser.permission_level] >= 2 || id === loggedInUser._id) {
        if(common.checkValidMongoID(id, res)) {
            User.remove({"_id": new ObjectId(id)}, function(err, result) {
                if(err) {
                    console.log(err);
                    sendJsonResponse(res, false, "There was an error processing your request.", 400);
                }
                else if(result.n === 0) {
                    sendJsonResponse(res, false, "No matching ID was found. Nothing changed in DB.", 400);
                }
                else {
                    sendJsonResponse(res, true, "Successfully deleted user.", 200);
                    Record.deleteMany({user: ObjectId(id)}, function(err) {
                        if(err) {
                            console.log(err);
                        }
                    });
                }
            });
        }
    }
    else {
        sendJsonResponse(res, false, "This action is forbidden.", 403);
    }
});

module.exports = router;