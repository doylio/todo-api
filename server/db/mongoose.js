const mongoose = require('mongoose')

mongoose.Promise = global.Promise //Sets the promise type for mongoose.  Only do once
mongoose.connect(process.env.MONGODB_URI)

module.exports = {mongoose}