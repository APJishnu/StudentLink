const { collection } = require('../config/connection');
const { AdminLogin } = require('../config/connection');
const { verification } = require('../config/connection');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
  SignUp: async (values, callback) => {
    try {

      let userExist = await collection.findOne({ email: values.email });
      if (userExist) {

        callback('userExist')

      } else {


        const password = await bcrypt.hash(values.pw, 10);
        console.log('bcrypt pass:' + password);
        let userId = new ObjectId;
        // Create a new product instance using the Mongoose model
        const Data = new collection({

          user:userId,
          firstname: values.firstname,
          lastname: values.lastname,
          pw: password,
          email: values.email,
          phone: values.phone,
        });

        // Save the new product to the MongoDB collection
        await Data.save();

       
        console.log(userId);
        callback(null, userId);
      }
    } catch (error) {
      console.error(error);
      callback(error, null);
    }
  },

  Login: async (values, callback) => {
    try {

      const check = await collection.findOne({ email: values.email });

      console.log("1..." + values.pw);


      if (check) {
        const isUser = await bcrypt.compare(values.pw, check.pw);
        console.log(isUser);
        if (isUser) {

          callback(check, null)

        }
        else {
          let msg = "Incorrect password"
          callback(null, msg)
        }
      } else {
        let msg = "Incorrect Email Address"
        callback(null, msg)
      }
    } catch (error) {
      console.error(error);
      callback(error);
    }
  },


  updateProfile: async (userId, values, callback) => {
    try {
      const updatedData = await collection.updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            photo: values.filename,
          },
        }
      );

      if (updatedData) {
        const updatedUser = await collection.findOne({ _id: new ObjectId(userId) }).exec();
        callback(null, updatedUser);
      } else {
        console.error('No matching user found or no modification made');
        callback('No matching user found or no modification made', null);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      callback('Internal server error', null);
    }
  },

  checkAdmin: async (admindata, callback) => {
    try {
      const check = await AdminLogin.findOne({ email: admindata.email });
  
      if (check) {
        if (check.password === admindata.pw) {
          callback(check, null);
        } else {
          let msg = "Incorrect password";
          callback(null, msg);
        }
      } else {
        let msg = "Incorrect Email Address";
        callback(null, msg);
      }
    } catch (error) {
      console.error(error);
      callback(error);
    }
  },
  

  verificationEmail: (email, verificationCode) => {

    return new Promise(async (resolve, reject) => {


      let verificationData = new verification({
        email: email,
        verificationCode: verificationCode,
      });

      await verificationData.save();

      resolve(verificationData)

    })

  },

  getVerificationDataById: (verificationId) => {

    return new Promise(async (resolve, reject) => {
      let verificationData = await verification.findById(verificationId);

      resolve(verificationData);
    })

  },
  deleteVerificationDataById: (verificationId) => {

    return new Promise(async (resolve, reject) => {
      let verificationData = await verification.findByIdAndDelete(verificationId);

      resolve(verificationData);
    })

  },

  resetPassword: async (datas, callback) => {
    try {
      if (datas.newPassword !== datas.confirmPassword) {
        // Passwords don't match
        callback('Passwords do not match', null);
        return;
      }

      const password = await bcrypt.hash(datas.newPassword, 10);
      console.log('bcrypt pass:' + password);

      let updateObject = {
        pw: password,
      };

      const updatedPassword = await collection.findOneAndUpdate(
        { email: datas.email },
        { $set: updateObject },
        { returnOriginal: false }
      );

      callback(null, updatedPassword);
    } catch (error) {
      console.error(error);
      // Handle other errors during password reset
      callback('Error resetting password', null);
    }
  },


};
