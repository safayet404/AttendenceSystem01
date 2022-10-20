const mongoose = require('mongoose')
module.exports = mongoose.model('Event', EventSchema);

function connectDB(connectionStr){

    return mongoose.connect(connectionStr)


}

module.exports = connectDB;

/**
 * 
 */