const expressFunction = require('express');
const mongoose = require('mongoose');
var expressApp = expressFunction();

const url = 'mongodb://localhost:27017/db';
const config = {
    autoIndex: true,
    userNewUrlParser: true,
    userUnifiedTopology: true 
};

expressApp.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200')
    res.setHeader('Access-Control-Allow-Methods','POST, GET, PUT, PATCH, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers','Content-Type, Option, Authorization')
    return next()
});
expressApp.use(expressFunction.json());

expressApp.use((req, res, next) => {
    mongoose.connect(url, config)
    .then(() => {
        console.log('Connected to MongoDB...');
        next();
    })
    .catch(err => {
        console.log('Cannot connect to MongoDB');
        res.status(501).send('Cannot connect to MongoDB')
    });
});

expressApp.use('/user', require('./routes/users'))
//expressApp.use('/login', require('./routes/signin'))
expressApp.use('/product', require('./routes/products'))
expressApp.use('/history', require('./routes/history'))

expressApp.listen(3000, function(){
    console.log('Listening on port 3000')
});