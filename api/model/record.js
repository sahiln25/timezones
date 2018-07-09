const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//Record schema
const RecordSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    gmt_difference: {
        type: Number,
        required: true
    },
    user: {
        type: Schema.ObjectId,
        required: true
    }
});

const Record = mongoose.model('Record', RecordSchema);

module.exports = Record;