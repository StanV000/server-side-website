const Booking = require("../schema/booking")

const express = require('express');
const router = express.Router();
const deleteBooking = require('../public/javascripts/script');


/* routes to the home page */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home Page' });
});

/* Routes to booking. */
router.get('/booking', function(req, res, next) {
  res.render('booking', { title: 'Booking Page' });
});

/* routes to about */
router.get('/About', function(req, res, next) {
  res.render('About', { title: 'About Page' });
});

/* Routes to help */
router.get('/Help', function(req, res, next) {
  res.render('Help', { title: 'Help' });
});

/* routes to /url. */
router.get('/url', function(req, res, next) {
  res.render('url', { title: 'url' });
});

//Database stuff and booking



router.post("/createBooking", async (req, res)  => {
  // Get attributes from the post request made by the client.
  console.log({body: req.body})
  const {username, surname, dob, email, telephone} = req.body
  
  const newBooking = new Booking({
    username,
    surname,
    dob,
    email,
    telephone,
    datetime: new Date() // << time and date of booking
  });
  console.log("Data to save...", {newBooking})

  // Add the data to mongodb database and save it.
  await newBooking.save()
  res.render('success', { title: 'Success Page' });
})

router.get("/viewbookings", async (req, res) => {
  // Returns all bookings in the database.
  const allBookings = await Booking.find({}, 'username surname dob email telephone datetime')
  console.log(allBookings)
  res.render('viewbookings', { title: 'Bookings Page', allBookings});
})


// Delete booking route

router.post('/deleteBooking/:id', async (req, res, next) => {
  const bookingId = req.params.id;

  try {
     const deletedBooking = await Booking.findByIdAndDelete(bookingId);

     res.redirect('/viewbookings'); // a way of updating the page.
  } catch (error) {
     console.error('Error deleting booking:', error);
     res.status(500).send({ message: 'Internal server error' });
  }
});

//Update booking
router.post('/updateBooking/:id', async (req, res, next) => {
  console.log("Update booking")
  const bookingId = req.params.id;
    // Get attributes from the post request made by the client.
   
    const {username, surname,dob, email, telephone, datetime} = req.body

  try {
    const newBooking = {
      username,
      surname,
      dob,
      email,
      telephone,
      datetime
    };
  
    const updatedBooking = await Booking.findByIdAndUpdate(bookingId, newBooking);

    if (!updatedBooking) {
      return res.status(404).send({ message: 'Booking not found' });
    }

    res.redirect('/viewbookings'); // a way of updating the page.
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

router.post('/edit/:id', async (req, res) => {
  console.log("running edit");
  console.log(req.body);
  const bookingId = req.params.id;

  // Destructure the properties directly from req.body
  const { username, surname, dob, email, telephone, datetime } = req.body;

  const updatedBooking = {
    id: req.params.id,
    username,
    surname,
    dob,
    email,
    telephone,
    datetime
  };

  console.log({body: req.body})  // get booking details based on the id.
  const checkBooking = await Booking.findById(bookingId);
  if (!checkBooking) {
    return res.status(404).send({ message: 'Booking not found' });
  }

  // Render edit page with booking detail
  res.render('../views/edit', { title: 'Booking Page', updatedBooking });
});


//Search function
router.post("/viewbookings", async (req, res) => {
  try {
    const { username, startDate, endDate } = req.body;

    let query = { username };

    // Add date range conditions if start and end dates are provided
    if (startDate && endDate) {
      query.datetime = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const allBookings = await Booking.find(query, 'username surname dob email telephone datetime');

    res.render('viewbookings', { title: 'Bookings Page', allBookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});



module.exports = router;
