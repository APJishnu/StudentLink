var express = require('express');
var router = express.Router();
const userHelper = require('../helpers/loginSignup');
const userHelper2 = require('../helpers/data-helpers');
const { uploadImage } = require('../helpers/multer');
const nodemailer = require('nodemailer');



function generateVerificationCode() {
  return Math.floor(1000 + Math.random() * 9000); 
}


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'photosg707@gmail.com',
      pass: 'jdcgtwggpasadgik'
  },
  tls:{
    rejectUnauthorized : false
  } 
});




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
});


router.post('/forgotPassword', async (req, res) => {

  const verificationCode = generateVerificationCode();
    res.json({status : true , verificationCode:verificationCode})
})





router.post('/verifyingEmail', async (req, res) => {
  const { emailInput, verificationCode } = req.body;
  let email = emailInput;
  
  const mailOptions = {
      from: 'photosg707@gmail.com',
      to: email,
      subject: 'Password Reset Verification',
      html: `<h2>Email Verification</h2>
           <h4>Your verification code is: ${verificationCode}</h4>`
  };

  let verificationCollection = await userHelper.verificationEmail(email, verificationCode);
  console.log(verificationCollection);

  transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
          console.log(error);
          res.status(500).json({ error: 'Failed to send verification code.' });
      } else {
          console.log('Email sent: ' + info.response);
          req.session.verificationCollectionId = verificationCollection._id;
          req.session.verificationCollectionEmail = verificationCollection.email;
          req.session.verificationCollectionCode = verificationCollection.verificationCode;

          res.redirect('/verification');
          
          // Set a timeout to delete verification data after 5 minutes
          setTimeout(async () => {
              try {
                  await userHelper.deleteVerificationDataById(verificationCollection._id);
                  console.log("Verification data deleted after 30 seconds");
              } catch (error) {
                  console.error("Error occurred while deleting verification data:", error);
              }
          }, 30 * 1000); // 30 seconds
      }
  });
});


router.get('/verification', (req, res) => {
  let verificationCollectionId = req.session.verificationCollectionId; // Retrieve verification ID from session
  let verificationCollectionEmail = req.session.verificationCollectionEmail; // Retrieve verification ID from session
  let verificationCollectionCode = req.session.verificationCollectionCode; // Retrieve verification ID from session
  res.render('user/forgot-password', { verificationCollectionId: verificationCollectionId ,verificationCollectionEmail:verificationCollectionEmail,verificationCollectionCode:verificationCollectionCode});
});


router.post('/verification', async (req,res)=>{
  let userVerificationCode = req.session.verificationCollectionCode;
  let verificationCollectionId = req.session.verificationCollectionId;
  console.log(userVerificationCode ) 
  console.log(verificationCollectionId ) 

  try {
    // Retrieve the verification data from the database
    let verificationData = await userHelper.getVerificationDataById(verificationCollectionId);

    let verificationEmail = verificationData.email

    delete req.session.verificationCollectionId;

    // Check if the verification code matches
    if (verificationData.verificationCode === userVerificationCode) {
      // Verification successful, perform actions like resetting password
      // Delete the verification data
      await userHelper.deleteVerificationDataById(verificationCollectionId);
     
      res.render('user/reset-password',{verificationEmail});
    } else {
      // Verification failed
      res.send('<script>alert("Invalid verification code."); window.history.go(-2);</script>');

    }
  } catch (error) {
    console.error("Error occurred during verification:", error);
    res.status(500).send('<script>alert("An error occurred during verification."); window.history.back();</script>');
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    await userHelper.resetPassword(req.body, (error, result) => {
      if (error) {
        // Handle error cases
        if (error === 'Passwords do not match') {
          res.send('<script>alert("Passwords do not match"); window.location.href="/login";</script>');
        } else {
          res.send('<script>alert("Error resetting password"); window.location.href="/login";</script>');
        }
        return;
      }
      // Password reset successful
      res.send('<script>alert("Password reset successful"); window.location.href="/login";</script>');
    });
  } catch (error) {
    console.error(error);
    res.render('error', { message: 'Error resetting password', error });
  }
});



module.exports = router;
