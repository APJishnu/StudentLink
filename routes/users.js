var express = require('express');
var router = express.Router();
const userHelper = require('../helpers/loginSignup');
const userHelper2 = require('../helpers/data-helpers');
const { uploadImage } = require('../helpers/multer');
const nodemailer = require('nodemailer');



/* GET users listing. */
router.get('/', (req, res) => {

  if (req.session.loggedIn) {
    console.log(req.session.loggedIn)
    res.render('user/home', { admin: false, user: req.session.user });
  } else {

    res.redirect('/login');
  }
});

//.......
router.get('/about', (req, res) => {
  if (req.session.loggedIn) {

    res.render('user/about', { user: req.session.user });
  } else {
    res.redirect('/login')
  }
});
//........
router.get('/contact', (req, res) => {
  if (req.session.loggedIn) {

    res.render('user/contact', { user: req.session.user });
  } else {
    res.redirect('/login')
  }
});
//........
router.get('/courses', (req, res) => {
  if (req.session.loggedIn) {

    res.render('user/courses', { user: req.session.user });
  } else {
    res.redirect('/login')
  }
});
//......


//computer......
router.get('/get-Notes', async (req, res, next) => {
  if (req.session.loggedIn) {
    let department = req.query.department;

    res.render('user/getNotes', { admin: false, user: req.session.user ,department})

  } else {
    res.redirect('/login');
  }

})
//printing......
router.get('/printing', async (req, res, next) => {
  if (req.session.loggedIn) {

    res.render('user/printing', { admin: false, user: req.session.user ,printing:true})

  } else {
    res.redirect('/login');
  }

})


//login
router.get('/login', (req, res) => {

  console.log(req.session.loginErr)
  res.render('user/login', { admin: false, login: true ,loginErr:req.session.loginErr});
  req.session.loginErr = false;
});
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/login'); // Redirect to the login page after logout
  });
});

//signin
router.get('/signup', (req, res) => {

  res.render('user/signup', { signup: true });
});

router.post('/signup', async (req, res) => {

  try {
    // Add a new product
    await userHelper.SignUp(req.body, (result) => {
      const _id = result;
      res.redirect('/login'); // Redirect to view all products after adding
    });
  } catch (error) {
    console.error(error);
    res.render('error', { message: 'Error adding product', error });
  }

});


router.post('/login', async (req, res) => {
  try {
    await userHelper.Login(req.body, (result,msg) => {
      console.log(result)
      if (result == null) {


        req.session.loginErr = msg;
        res.redirect('/login');
      } else {
        req.session.loggedIn = true;
        req.session.user = result;
        res.render('user/home', { admin: false, user: req.session.user });
      }
    });
  } catch (error) {
    console.error(error);
    res.render('error', { message: 'Error adding product', error });
  }
});



router.post('/get-Notes', async (req, res) => {
  const selectedSubject = req.body.name;
  const department = req.body.department;
  console.log(req.body)
  console.log(selectedSubject);

  try {
    await userHelper2.getFilesBySubject(department,selectedSubject, (error, data) => {
      if (error) {
        res.render('error', { user: req.session.user, message: 'Error fetching files', error });
      } else {
        const filteredData = data.filter((file) => file.name === selectedSubject);
        res.render('user/view-file', { user: req.session.user, data: filteredData, selectedSubject ,view:true});
      }
    });
  } catch (error) {
    console.error(error);
    res.render('error', { user: req.session.user, message: 'Error fetching files', error });
  }
});

router.get('/profile', (req, res) => {
  if (req.session.loggedIn) {
    console.log(req.session.user._id)
    const profile = "profile"
    // Render the profile page for logged-in users
    res.render('user/profile', { profile, user: req.session.user });
  } else {
    // Redirect to the login page if the user is not logged in
    res.redirect('/login');
  }
});

router.post('/upload', uploadImage.single('photo'), async (req, res) => {
  if (req.session.loggedIn) {
    let userId = req.session.user._id;
    console.log('UserID:', userId);
    console.log('Uploaded File:', req.file);

    await userHelper.updateProfile(userId, req.file, (error, updatedUser) => {
      if (error) {
        console.error('Error updating profile:', error);
        res.render('error', { user: req.session.user, message: 'Error updating profile', error });
      } else {
        console.log('Updated User:', updatedUser);
        req.session.user.photo = updatedUser.photo;
        console.log(req.session.user.photo)
        console.log(req.session.user)
        res.redirect('/profile');
      }
    });
  }
});

router.post('/remove-profilePhoto',async(req,res)=>{
  if(req.session.loggedIn){
    
      delete req.session.user.photo;
   
      res.json({status:true})
  }else{
    res.sendStatus(401).end()
  }
})











module.exports = router;
