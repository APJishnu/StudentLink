// data-helpers.js
const { AdminCollection } = require('../config/connection');
const { AssignmentFile } = require('../config/connection');
const { collection } = require('../config/connection');
const { makeAssignment } = require('../config/connection');

const mongoose = require('mongoose');
const ObjectId=mongoose.Types.ObjectId;

module.exports = {
  addFile: async (data, filedata, callback) => {
    try {
      const newData = new AdminCollection({
        name: data.name,
        file: filedata.filename,
        department: data.department,
        sem: data.sem,
        content: data.content,
      });

      await newData.save();

      const savedData = await AdminCollection.findOne({ _id: newData._id }).exec();
      const DataId = savedData._id.toString();

      console.log(DataId);
      callback(null, DataId);
    } catch (error) {
      console.error(error);
      callback(error, null);
    }
  },

  getFile: async (department) => {
    try {
      const Datas = await AdminCollection.find({ department }).exec(); // Filter by department
      console.log(Datas);
      return Datas;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  
  

  deleteAdminById: async (adminId) => {
    try {
      const result = await AdminCollection.deleteOne({ _id: adminId });
      console.log(`Deleted ${result.deletedCount} document`);
    } catch (error) {
      console.error('Error deleting admin document:', error);
    }
  },

  getFilesBySubject: async (department,subject, callback) => {
    try {
      const files = await AdminCollection.find({department:department, name: subject }).exec();
      callback(null, files);
    } catch (error) {
      console.error(error);
      callback(error, null);
    }
  },

  getFileDetails: async (fileId, callback) => {

    const File = await AdminCollection.findOne({ _id: fileId });

    callback(File)
  },

  editProducts: async (fileId, data, newFile, callback) => {

    try {
      let updateObject = {


        name: data.name,

        department: data.department,
        sem: data.sem,
        content: data.content,


      };
      if (newFile) {
        updateObject.file = newFile.filename;
      }




      const updatedProduct = await AdminCollection.findByIdAndUpdate(
        { _id: (fileId) },
        {
          $set: updateObject,
        },
        { returnOriginal: false }
      );

      console.log(updatedProduct);
      callback(updatedProduct);
    } catch (error) {
      console.error('Error updating product details:', error);
      callback(error, null);
    }

  },
  
 makeAssignmentSchedule:async (formData) => {
  try {
    let ifSubject = await makeAssignment.findOne({department:formData.department, name: formData.name});


      await makeAssignment.insertMany({
        
        department:formData.department,
        sem:formData.sem,
        name:formData.name,
        number: formData.number,
        dateAndTime:formData.dateTime,
        description:formData.description,
      });
      ifSubject = await makeAssignment.findOne({name: formData.name });
      return ifSubject;
    
    
} catch (error) {
    console.error(error);
    throw error;
}
},

 addAssignment:async (formData, fileData) => {
  try {
    
      await AssignmentFile.insertMany({
        user:ObjectId.createFromHexString(formData.userId),
        department:formData.department,
        sem:formData.sem,
        name:formData.name,
        Regnumber:formData.Regnumber,
        number: formData.number, 
        file: fileData.filename ,
        submitted:ObjectId.createFromHexString(formData.arrayId)
      });
      ifUser = await AssignmentFile.findOne({department:formData.department, user: formData.userId });
      return ifUser;
    
    
} catch (error) {
    console.error(error);
    throw error;
}
},

getAssignmentFilesBySubject :async (department, subject) => {
  try {
    const files = await AssignmentFile.find({ department:department, name: subject }).populate({
      path: 'user', // Populate the 'user' field
      model:  collection // Use the Login model
    }).exec();
    
    console.log(files);
    return files;
  } catch (error) {
    console.error(error);
    throw error;
  }
},

getAssignmentSchedule:async(formData)=>{
  try {
  const assignmentSchedules = await makeAssignment.find({department:formData.department, name: formData.name });
  
  console.log(assignmentSchedules);
  return assignmentSchedules;
} catch (error) {
  console.error(error);
  throw error;
}
},

deleteMakedAssignment: async (DeleteId) => {
  try {
    const result = await makeAssignment.deleteOne( { _id: DeleteId }  );
    console.log(`Deleted ${result.nModified} document`);
  } catch (error) {
    console.error('Error deleting assignment document:', error);
  }
},

getIfAssignment: async (department, userId) => {
  try {
    // Get all assignments created by admins
    let assignmentCollection = await makeAssignment.find({ department: department });

    // Find assignments submitted by the user
    let userAssignments = await AssignmentFile.find({ department: department, user: userId });

    if (userAssignments && userAssignments.length > 0) {
      // Extract submitted assignment IDs
      let submittedAssignmentIds = userAssignments.map(collection => collection.submitted.toString());

      // Filter out assignments from assignmentCollection that have the same ID as the submitted assignments
      assignmentCollection = assignmentCollection.filter(assignment => !submittedAssignmentIds.includes(assignment._id.toString()));
    }

    return assignmentCollection;
  } catch (error) {
    console.error('Error fetching assignment documents:', error);
    throw error;
  }
}



};
