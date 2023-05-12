const mongoose = require('mongoose')
require('colors')
exports.connected = (url) => {
    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true

    }), console.log('connected to DB'.bgRed)
}