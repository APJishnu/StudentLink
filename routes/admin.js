// routes/admin.js

var express = require('express');
var router = express.Router();
const { uploadPdf } = require('../helpers/multer');
const adminHelper = require('../helpers/data-helpers');
const adminLogin = require('../helpers/loginSignup');

router.get('/',async(req,res)=>{
  if(req.session.adminLoggin){
    res.render('admin/admin-home',{admin:true})
  }else{
    res.redirect('/admin/admin-login')
  } 
})

router.get('/admin-viewfiles', async function (req, res, next) {
  try {
    if (req.session.adminLoggin) {
      const department = req.query.department;
      console.log('Selected Department:', department);
      const data = await adminHelper.getFile(department);
      res.render('admin/view-file', { admin: true, data, department });
    } else {
      res.redirect('/admin/admin-login');
    }
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).render('error', { message: 'Error fetching files', error });
  }
});


router.get('/add-files', (req, res, next) => {
  if (req.session.adminLoggin) {
    let department=req.query.department;
    console.log("addfile department",department)
    res.render('admin/add-files', { admin: true,department });
  } else {
    res.redirect('/admin/admin-login')
  }

});

router.post('/computer-subjects', (req, res) => {
  const year = req.body.year;
  const semester = req.body.semester;

  // Fetch subjects based on the selected year and semester from your database
  // Modify this logic according to your actual data
  let subjects = [];

  if (semester === '1') {
    subjects = ['Applied Physics I', 'Applied Chemistry', 'Mathematics I', 'Communication skills in English', 'Engineering Graphics', 'Sports & yoga', 'Engineering worshop practice', 'Introduction to IT system lab'];
  } else if (semester === '2') {
    subjects = ['Mathematics II', 'Applied physics II', 'Environmental science', 'Fundametals of Electrical & electronics Engineering', 'Problem solving & programming', 'Communication skills in english lab', 'Engineering worshop practice'];
  } else if (semester === '3') {
    subjects = ['Computer organisation', 'Programming in c', 'Database management system', 'Digital computer fundamentals', 'Web technology lab', 'Computer system hardware lab'];
  } else if (semester === '4') {
    subjects = ['Object oriented programming', 'Data Structure', 'Computer communication & network', 'Community skills in indian knowledge system', 'Web programming lab', 'Application development lab', 'Minor project'];
  } else if (semester === '5') {
    subjects = ['Artificial intelligence and Machine learning', 'Operating System', 'System Administrator', 'Embedded system & real time operating system', 'Project management & software engineering'];
  } else if (semester === '6') {
    subjects = ['Enterpreneurship and startup', 'Internet of things', 'Multimedia', 'Indian constitution', 'Computer network engineering lab', 'Smartdevice programming lab', 'Major project'];
  }


  // Send the subjects as a JSON response
  res.json({ subjects });
});




router.post('/printing-subjects', (req, res) => {
  const year = req.body.year;
  const semester = req.body.semester;

  // Fetch subjects based on the selected year and semester from your database
  // Modify this logic according to your actual data
  let subjects = [];

  if (semester === '1') {
    subjects = ['Printing Basics', 'Typography', 'Computer Applications in Printing', 'English Communication', 'Mathematics I', 'Workshop Practice'];
  } else if (semester === '2') {
    subjects = ['Printing Materials', 'Prepress Techniques', 'Offset Printing Technology', 'English Communication II', 'Mathematics II', 'Workshop Practice II'];
  } else if (semester === '3') {
    subjects = ['Flexography and Gravure Printing', 'Digital Printing Technology', 'Postpress and Finishing', 'Printing Quality Management', 'Industrial Training'];
  } else if (semester === '4') {
    subjects = ['Packaging Technology', 'Color Science and Management', 'Printing Machinery Maintenance', 'Printing Business Management', 'Project Work'];
  } else if (semester === '5') {
    subjects = ['Advanced Printing Processes', 'Printed Electronics', 'Industrial Automation in Printing', 'Environment and Safety Management', 'Internship'];
  } else if (semester === '6') {
    subjects = ['Research Methodology', 'Entrepreneurship Development', 'Print Media Marketing', 'Innovation in Printing', 'Major Project'];
  }

  // Send the subjects as a response
  res.json({ subjects });
});

router.post('/electronics-subjects', (req, res) => {
  const semester = req.body.semester;

  // Define the subjects for each semester based on the diploma syllabus
  let subjects = [];

  if (semester === '1') {
    subjects = ['Mathematics I', 'Physics', 'Basic Electronics', 'Engineering Drawing', 'Electrical Engineering Fundamentals', 'Workshop Practice'];
  } else if (semester === '2') {
    subjects = ['Mathematics II', 'Chemistry', 'Electronic Devices & Circuits', 'Digital Electronics', 'Electrical Machines'];
  } else if (semester === '3') {
    subjects = ['Engineering Mathematics III', 'Analog Communication', 'Linear Integrated Circuits', 'Microcontrollers', 'Electrical Measurements & Instruments'];
  } else if (semester === '4') {
    subjects = ['Electrical Power Generation', 'Digital Communication', 'Industrial Electronics', 'Control Systems', 'Microprocessors'];
  } else if (semester === '5') {
    subjects = ['Computer Networks', 'Digital Signal Processing', 'Elective I (e.g., VLSI Design)', 'Elective II (e.g., Embedded Systems)', 'Project Work Phase I'];
  } else if (semester === '6') {
    subjects = ['Microcontroller Based System Design', 'Advanced Microprocessors', 'Elective III (e.g., Robotics)', 'Elective IV (e.g., Power Electronics)', 'Project Work Phase II'];
  }

  // Send the subjects as a JSON response
  res.json({ subjects });
});

router.post('/mechanical-subjects', (req, res) => {
  const semester = req.body.semester;

  // Define the subjects for each semester based on the diploma syllabus
  let subjects = [];

  if (semester === '1') {
    subjects = ['Mathematics I', 'Physics', 'Chemistry', 'Engineering Graphics', 'Basic Mechanical Engineering', 'Workshop Practice'];
  } else if (semester === '2') {
    subjects = ['Mathematics II', 'Materials Science', 'Thermodynamics', 'Fluid Mechanics', 'Manufacturing Processes I'];
  } else if (semester === '3') {
    subjects = ['Engineering Mathematics III', 'Mechanics of Solids', 'Fluid Machinery', 'Heat Transfer', 'Manufacturing Processes II'];
  } else if (semester === '4') {
    subjects = ['Engineering Economics', 'Theory of Machines', 'Machine Design I', 'Metrology and Quality Control', 'Industrial Engineering'];
  } else if (semester === '5') {
    subjects = ['Automobile Engineering', 'Dynamics of Machinery', 'Machine Design II', 'Finite Element Analysis', 'Project Management'];
  } else if (semester === '6') {
    subjects = ['Refrigeration and Air Conditioning', 'Energy Engineering', 'Operations Research', 'CAD/CAM', 'Project Work'];
  }

  // Send the subjects as a JSON response
  res.json({ subjects });
});







router.get('/delete/:id', async (req, res) => {
  const adminIdToDelete = req.params.id;
  console.log('hai', req.params.id);

  await adminHelper.deleteAdminById(adminIdToDelete);

  res.redirect('/admin');
});

router.post('/add-files', uploadPdf.single('file'), async (req, res) => {

  try {

    if (req.session.adminLoggin) {
      await adminHelper.addFile(req.body, req.file, (result) => {
        let department = req.body.department;

        res.send(`<script>alert("Notes Added successfully!"); window.location="/admin/admin-viewfiles?department=${department}";</script>`);
      });

    } else {
      res.redirect('/admin/admin-login')
    }

  } catch (error) {
    console.error(error);
    res.render('error', { admin: true, message: 'Error adding product', error });
  }
});

router.get('/edit-files/:id', async (req, res) => {
  if (req.session.adminLoggin) {

    const fileId = req.params.id;

    await adminHelper.getFileDetails(fileId, (file) => {

      console.log("File:", file)

      res.render('admin/edit-file', { admin: true, file });

    })


  } else {
    res.redirect('/admin/admin-login')
  }


})


router.post('/edit-files/:id', uploadPdf.single('file'), async (req, res) => {


  const currentId = req.params.id;
  const data = req.body;
  const newFile = req.file;

  await adminHelper.editProducts(currentId, data, newFile, (result) => {

    console.log('Product updated successfully:', result);
    res.redirect('/admin')

  })

});


router.get('/admin-login', async (req, res) => {

  res.render('admin/login', { admin: true })
});

router.post('/admin-login', async (req, res) => {
  const admindata = req.body;

  await adminLogin.checkAdmin(admindata, (result, error) => {
    if (result) {
      req.session.adminLoggin = true;
      req.session.admin = admindata;
      res.render('admin/admin-home', { admin: true });
    } else {
      if (error) {
        console.error(error);
        res.send('<script>alert("' + error + '"); window.location.href="/admin/admin-login"</script>');
      } else {
        res.send('<script>alert("An error occurred during login. Please try again later."); window.location.href="/admin/admin-login"</script>');
      }
    }
  });
});


router.get('/assignmentCheck', async (req, res, next) => {
  if (req.session.adminLoggin) {
    let department = req.query.department;

    res.render('admin/checkAssignment', { admin: true,department:department})

  } else {
    res.redirect('/admin/admin-login');
  }

});

router.post('/assignmentCheck', async (req, res, next) => {
  try {
    // Check if admin is logged in
    if (!req.session.adminLoggin) {
      return res.redirect('/admin/admin-login'); // Redirect to admin login page
    }

    const selectedSubject = req.body.name;
    const department = req.body.department;
    console.log(req.body)
    console.log(selectedSubject);

    const data = await adminHelper.getAssignmentFilesBySubject(department, selectedSubject);
    const filteredData = data.filter((file) => file.name === selectedSubject);
    console.log(filteredData)
    res.render('admin/view-assignment', { admin:true,user: req.session.user, data: filteredData, selectedSubject});
  } catch (error) {
    console.error(error);
    res.render('error', { user: req.session.user, message: 'Error fetching files', error });
  }
});



module.exports = router;
