const createError = require('http-errors');
const express = require('express');
// database
const mongoose = require('mongoose')

const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

async function connectDatabase() {
  await mongoose.connect('mongodb://127.0.0.1/sswd', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log("Connected to the mongodb database.\n")
}


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

let PORT = 8080;

app.listen(PORT, async () => {
  await connectDatabase()
  console.log(`Listening to localhost:${PORT}`)
})




function validateForm() {
  var username = document.getElementById("username").value;
  var surname = document.getElementById("surname").value;
  var dob = document.getElementById("dob").value;
  var email = document.getElementById("email").value;
  var telephone = document.getElementById("telephone").value;
  var cardname = document.getElementById("cardname").value;
  var cardnumber = document.getElementById("cardnumber").value;
  var cvv = document.getElementById("cvv").value;

  // Simple validation, you can customize this based on your requirements
  if (username === "" || surname === "" || dob === "" || email === "" || telephone === "" || cardname === "" || cardnumber === "" || cvv === "") {
     alert("Please fill out all the fields");
     return false;
  }

}

module.exports = app;
