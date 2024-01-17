// data-helpers.js
const { AdminCollection } = require('../config/connection');

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


};
