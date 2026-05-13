require('dotenv').config();
const routes = require('./routers/route');
const handlebars = require('express-handlebars');
var session = require('express-session');
var cookieParser = require('cookie-parser');
const express = require('express');
const middlewares = require('./middleware/middleware'); 
const app = express();
app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 60 * 1000 }
}));

const mongoose = require('mongoose');
const db_mongoose = require('./config/db_mongoose');

mongoose.connect(db_mongoose.connection).then(()=>{
    console.log('Conectado com o BD');
}).catch((err)=>{
    console.log('Erro na conexão com o BD');
    console.log(err);
});

app.engine('handlebars', handlebars.engine({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log('middlewares:', typeof middlewares.logRegister, typeof middlewares.sessionControl);
app.use(middlewares.logRegister);
app.use(middlewares.sessionControl);
app.use(routes);

app.listen(8081, function(){
    console.log("Servidor no http://localhost:8081");
});