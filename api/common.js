const validator = require('validator');
const mongoose = require('mongoose');

const permissions = { "REGULAR": 1, "MANAGER": 2, "ADMIN": 3 };

/** sendJsonResponse function - sends a json response with optional status code and optional token
 * @param res - response object
 * @param success - true if request was successful, false if request was unsuccessful
 * @param message - details on what happened with the request
 * @param statusCode (optional) - HTTP status code to send in response
 * @param token (optional) - jwt token to authenticate user
 */
const sendJsonResponse = function(res, success, message, statusCode, data) {
    let resData = {
        success: success,
        message: message
    };

    if(data) {
        resData.data = data;
    }

    if(statusCode) {
        res.status(statusCode).json(resData);
    }
    else {
        res.json(resData);
    }
};

/**
 * function checkValidEmail
 * This function will check if the e-mail is valid and if not it will send an invalid e-mail response (if available)
 * @param email - email address to check if it is valid
 * @param res - response object
 * @returns {boolean} - true if e-mail is valid
 */
const checkValidEmail = function(email, res) {
    if(email !== undefined && validator.isEmail(email)) {
        return true;
    }
    else {
        if(res) {
            sendJsonResponse(res, false, "Invalid e-mail address.", 400);
        }
        return false;
    }
};

/**
 * function checkValidPassword
 * This function will check if a given is valid and if not it will send an invalid password response (if available)
 * @param password - password to validate
 * @param res - response object
 * @returns {boolean} - true if passwords are valid, false otherwise
 */
const checkValidPassword = function(password, res) {
    if(password !== undefined && password.length >= 5 && password.length <= 20) {
        return true;
    }
    else {
        if(res) {
            sendJsonResponse(res, false, "Invalid password.", 400);
        }
        return false;
    }
};

/**
 * function checkValidPermission
 * @param permission_level - permission_level to validate
 * @param res - response object
 * @returns {boolean} - true if permission_level is valid, false otherwise
 */
const checkValidPermission = function(permission_level, res) {
    if(permissions[permission_level] !== undefined) {
        return true;
    }
    else {
        if(res) {
            sendJsonResponse(res, false, "Invalid permission level.", 400);
        }
        return false;
    }
};

const checkValidMongoID = function(id, res) {
    if(id && mongoose.Types.ObjectId.isValid(id)) {
        return true;
    }
    else {
        if(res) {
            sendJsonResponse(res, false, "Invalid ID parameter passed.", 400);
        }
        return false;
    }
};

/**
 * function checkValidName
 * This function will check if the record name or city name is valid
 * @param name - The string we need to check
 * @param res - response object
 * @returns {boolean} - true if string is alpha-numeric
 */
const checkValidName = function(name, res) {
    if(name !== undefined && name.length >= 1 && name.length <= 40) {
        return true;
    }
    else {
        if(res) {
            sendJsonResponse(res, false, "Strings must be between 1 and 40 characters.", 400);
        }
        return false;
    }
};

/**
 * function checkValidGMT
 * This function will check if the gmt difference is valid (isNumeric)
 * @param gmt_difference - The string we need to check
 * @param res - response object
 * @returns {boolean} - true if string is alpha-numeric
 */
const checkValidGMT = function(gmt_difference, res) {
    gmt_difference = String(gmt_difference);
    if(gmt_difference !== undefined && validator.isNumeric(gmt_difference)) {
        return true;
    }
    else {
        if(res) {
            sendJsonResponse(res, false, "GMT Difference is not valid.", 400);
        }
        return false;
    }
};

module.exports = {
    permissions,
    sendJsonResponse,
    checkValidEmail,
    checkValidPassword,
    checkValidPermission,
    checkValidMongoID,
    checkValidGMT,
    checkValidName
};