require('dotenv').config({ path: './config/dev.env' })
var colors = require('colors');
const path = require('path')
const home = require('./router/home')
const posts = require('./router/api/posts')
const login = require('./router/login')
const logout = require('./router/logout')
const register = require('./router/register')
const login_router = require('./router/login')
const body_parser = require('body-parser')
const session = require('express-session')
const {
    connected
} = require('./db/connect')

const express = require('express');
const { post } = require('./router/home');
const app = express()
app.use(session({
    secret: "TwitterClone",
    resave: true,
    saveUninitialized: false

}))
app.set('view engine', 'pug');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, "public")));
app.use(body_parser.urlencoded({ extended: false }))
app.use(login_router)
app.use('/home', home)
app.use('/login', login)
app.use('/logout', logout)
app.use('/api/posts', posts)
app.use('/register', register)

const Run = async() => {
    await connected(process.env.MONGODB_KEY);
    const port = process.env.PORT
    app.listen(port, () => {
        console.log('Server up Port on '.yellow, port)
    })
}
Run()