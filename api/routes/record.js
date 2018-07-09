const express = require('express');
const router = express.Router();

const ObjectId = require('mongodb').ObjectID;
const Record = require('../model/Record');
const User = require('../model/user');

const authenticate = require('../middleware/authenticate');
const bcrypt = require("bcryptjs");
const common = require('../common');
const jwt = require('jsonwebtoken');
const sanitize = require('mongo-sanitize');

const sendJsonResponse = common.sendJsonResponse;


/**
 * Create Record
 * Send response object with success = true if the record was successfully created.
 * Send response object with success = false and error message if the record wasn't able to be created.
 */
router.post('/', authenticate, function(req, res, next) {
    let loggedInUser = req.authenticatedUser;
    let newRecord = req.body;

    if(common.checkValidName(newRecord.name, res) && common.checkValidName(newRecord.city, res) && common.checkValidGMT(newRecord.gmt_difference, res) && common.checkValidMongoID(newRecord.user, res)) {
        if(common.permissions[loggedInUser.permission_level] >= 3 || String(loggedInUser._id) === String(newRecord.user)) {
            let record = new Record({name: sanitize(newRecord.name), city: sanitize(newRecord.city), gmt_difference: sanitize(newRecord.gmt_difference), user: ObjectId(sanitize(newRecord.user))});
            User.findOne({_id: ObjectId(record.user)}, function(err, user) {
                if(err) {
                    sendJsonResponse(res, false, "There was an error processing your request.", 400);
                }
                else if(user) {
                    record.save(function (err) {
                        if (err) {
                            console.log(err);
                            sendJsonResponse(res, false, "There was an error processing your request.", 400);
                        }
                        else { //If everything is fine, add the record
                            sendJsonResponse(res, true, "Record added!", 200, {_id: record._id});
                        }
                    });
                }
                else {
                    sendJsonResponse(res, false, "There was no user found with that ID.", 404);
                }
            });
        }
        else {
            sendJsonResponse(res, false, "Invalid permission to perform this action.", 403);
        }
    }
});


/**
 * Get all records of another user (to be used by admins)
 */
router.get('/all/user/:id/', authenticate, function(req, res, next) {
    let loggedInUser = req.authenticatedUser;
    let requestedUserID = sanitize(req.params.id);

    if(common.checkValidMongoID(requestedUserID, res)) {
        if (ObjectId(requestedUserID) == loggedInUser._id || common.permissions[loggedInUser.permission_level] >= 3) {
            Record.find({user: ObjectId(requestedUserID)}, function(err, records) {
                if(err) {
                    console.log(err);
                    sendJsonResponse(res, false, "There was an error processing your request.", 400);
                }
                else if(records) {
                    sendJsonResponse(res, true, "Successfully retrieved record(s).", 200, {records: records});
                }
                else {
                    sendJsonResponse(res, false, "There was no records for that user.", 404);
                }
            });
        }
        else {
            sendJsonResponse(res, false, "Invalid permission to perform this action.", 403);
        }
    }
});

/**
 * Get all of the authenticated user's own records
 */
router.get('/all', authenticate, function(req, res, next) {
    let loggedInUser = req.authenticatedUser;

    Record.find({user: loggedInUser._id}, function(err, records) {
        if(err) {
            console.log(err);
            sendJsonResponse(res, false, "There was an error processing your request.", 400);
        }
        else if(records) {
            sendJsonResponse(res, true, "Successfully retrieved record(s).", 200, {records: records});
        }
        else {
            sendJsonResponse(res, false, "There was no records for that user.", 404);
        }
    });
});

/**
 * Get a specific record specified by the record id
 */
router.get('/:id', authenticate, function(req, res, next) {
    let loggedInUser = req.authenticatedUser;
    let record_id = sanitize(req.params.id);

    if(common.checkValidMongoID(record_id, res)) {
        Record.findOne({_id: ObjectId(record_id)}, function(err, record) {
            if(err) {
                sendJsonResponse(res, false, "There was an error processing your request.", 400);
            }
            else if(record) {
                if(record.user == loggedInUser._id || common.permissions[loggedInUser.permission_level] >= 3) {
                    sendJsonResponse(res, true, "Successfully retrieved record.", 200, {record: record});
                }
                else {
                    sendJsonResponse(res, false, "Invalid permission to perform this action.", 403);
                }
            }
            else {
                sendJsonResponse(res, false, "There was no record found with that id.", 404);
            }
        });
    }
});


/**
 * Update Record Route(s)
 * Send response object with success = true if the record was successfully updated.
 * Send response object with success = false and error message if the record wasn't able to be updated.
 */
router.put('/:id', authenticate, function(req, res, next) {
    let loggedInUser = req.authenticatedUser;
    let updateRecordID = sanitize(req.params.id); //The ID of the record that's going to be updated
    let updatedRecord = req.body; //The updated values of the record

    if(common.checkValidName(updatedRecord.name, res) && common.checkValidName(updatedRecord.city, res) && common.checkValidGMT(updatedRecord.gmt_difference, res) && common.checkValidMongoID(updateRecordID, res)) {
        Record.findOne({_id: updateRecordID}, function(err, rec) {
            if(err) {
                sendJsonResponse(res, false, "There was an error processing your request.", 400);
            }
            else if(rec) {
                if(rec.user == loggedInUser._id || common.permissions[loggedInUser.permission_level] >= 3) {
                    rec.name = sanitize(updatedRecord.name);
                    rec.city = sanitize(updatedRecord.city);
                    rec.gmt_difference = sanitize(updatedRecord.gmt_difference);

                    rec.save(function (err) {
                        if (err) {
                            console.log(err);
                            sendJsonResponse(res, false, "There was an error processing your request.", 400);
                        }
                        else { //If everything is fine
                            sendJsonResponse(res, true, "Record updated!", 200);
                        }
                    });
                }
                else {
                    sendJsonResponse(res, false, "Invalid permission to perform this action.", 403);
                }
            }
            else {
                sendJsonResponse(res, false, "There was no record found with that id.", 404);
            }
        });
    }

});


/**
 * Delete record
 * Sends a response object with success true if record was deleted.
 * Sends a response object with success false if record couldn't be deleted.
 */
router.delete('/:id', authenticate, function(req, res, next) {
    let loggedInUser = req.authenticatedUser;
    let recordToDeleteID = sanitize(req.params.id);

    if(common.checkValidMongoID(recordToDeleteID, res)) {
        Record.findOne({_id: ObjectId(recordToDeleteID)}, function(err, record) {
            if(err) {
                sendJsonResponse(res, false, "There was an error processing your request.", 400);
            }
            else if(record) {
                if(record.user == loggedInUser._id || common.permissions[loggedInUser.permission_level] >= 3) {
                    record.remove().then(function() {
                        sendJsonResponse(res, true, "Successfully removed record.");
                    }, function() {
                        sendJsonResponse(res, false, "Unable to delete record.", 400);
                    });
                }
                else {
                    sendJsonResponse(res, false, "Invalid permission to perform this action.", 403);
                }
            }
            else {
                sendJsonResponse(res, false, "There was no record found with that id.", 404);
            }
        });
    }
});

module.exports = router;