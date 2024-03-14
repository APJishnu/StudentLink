const multer = require('multer');
const path = require('path');

// Storage configuration for images
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/img/'); // Store uploaded image files in the 'public/img' directory
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, Date.now() + extname); // Rename the image file to a unique name with its original extension
  },
});

// Storage configuration for PDF files
const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/pdf/'); // Store uploaded PDF files in the 'public/pdf' directory
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, Date.now() + extname); // Rename the PDF file to a unique name with its original extension
  },
});
const assignmentpdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/assignmentPdf/'); // Store uploaded PDF files in the 'public/pdf' directory
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, Date.now() + extname); // Rename the PDF file to a unique name with its original extension
  },
});

// Multer instances for image and PDF uploads
const uploadImage = multer({ storage: imageStorage });
const uploadPdf = multer({ storage: pdfStorage });
const uploadassignmentPdf = multer({ storage: assignmentpdfStorage });

module.exports = { uploadImage, uploadPdf ,uploadassignmentPdf };
