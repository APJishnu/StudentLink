// config/connection.js

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const uri = 'mongodb://localhost:27017/MainProject';

mongoose.connect(uri, {

});

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

const signupSchema = new mongoose.Schema({
  user: { type: ObjectId, required: true },

  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  pw: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: false
  }
})


const AdminSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },
  file: {
    type: String,
    required: true
  },
  department: {
    type: String, // You can adjust the type based on your needs (String, Number, etc.)
    required: true
  },
  sem: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },



})
const AdminLoginSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    default: 'admin@gmail.com' // Default email value
  },
  password: {
    type: String,
    required: true,
    default: 'admin123' // Default password value
  }
});


const verificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  verificationCode: {
    type: String,
    required: true,
  }
});

const assignmentSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    required: true,
  },
  
  department: { type: String, required: true },
  sem: { type: String, required: true },
  name: { type: String, required: true },
  Regnumber: { type: String, required: true },

    number: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
    submitted: {
      type: ObjectId,
      required: true,
    },

 
});

const makeAssignmentSchema = new mongoose.Schema({

  department: { type: String, required: true },
  sem: { type: String, required: true },
  name: { type: String, required: true },
    number: {
      type: String,
      required: true,
    },
    dateAndTime: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },


});









const collection = new mongoose.model('collection1', signupSchema)
const AdminCollection = new mongoose.model('AdminData', AdminSchema)
const AdminLogin = new mongoose.model('AdminLogin', AdminLoginSchema)
const verification = new mongoose.model('verification', verificationSchema)
const AssignmentFile = new mongoose.model('Assignment', assignmentSchema)
const makeAssignment = new mongoose.model('makeAssignment',makeAssignmentSchema)

// const newAdminLogin = new AdminLogin({
//     email: 'admin@gmail.com', // Custom email value
//     password: 'admin123' // Custom password value
//   });

//   // Save the document to the database
//   newAdminLogin.save()
//     .then((result) => {
//       console.log('Document saved:', result);
//     })
//     .catch((error) => {
//       console.error('Error saving document:', error);
//     });


module.exports = { mongoose, db, collection, AdminCollection, AdminLogin, verification, AssignmentFile ,makeAssignment};
