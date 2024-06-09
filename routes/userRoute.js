const express = require("express");
const { verifyToken } = require("../middleware/VerifyToken.js");
const { editProfile, getUser, getMahasiswa, uploadProfilePicture } = require("../controllers/auth.js");
const { changePassword } = require("../controllers/auth.js");
const { sendForm, getRiwayat } = require("../controllers/Users.js");
const Permintaan = require("../models/PermintaanModel.js");
const Mahasiswa = require("../models/MahasiswaModel.js");
const Users = require("../models/UserModel.js");
const StatusPermintaan = require("../models/StatusPermintaanModel.js");

const router = express.Router();


router.get('/', (req, res) => {
  res.redirect('/home'); 
});


router.get("/home", verifyToken('mahasiswa'), async function (req, res) {
    const mahasiswa = await getMahasiswa(req, res); 
    res.render("user/home", { mahasiswa , page:'home' });
});

router.get("/layanan", verifyToken('mahasiswa'), async function (req, res) {
  const mahasiswa = await getMahasiswa(req, res); 
  res.render("user/layanan", { mahasiswa, page:'layanan'});
});

router.get("/layanan/form", verifyToken('mahasiswa'), async function (req, res) {
  const user = await getUser(req, res); 
  const mahasiswa = await getMahasiswa(req, res); 

  res.render("user/form", { mahasiswa, user, page:'home'});
});

router.get("/profile", verifyToken('mahasiswa'), async function (req, res) {
  const mahasiswa = await getMahasiswa(req, res); 
  const user = await getUser(req, res);
  res.render("user/profile", { mahasiswa , user, page:'home'});
});



router.get('/profile/change-password',verifyToken('mahasiswa'), async function (req, res) {
  const mahasiswa = await getMahasiswa(req, res); 

  res.render('user/change-password', { mahasiswa , page:'home'});
});

router.post('/change-password', verifyToken('mahasiswa'), async (req, res) => {
  await changePassword(req, res);
});


router.get('/logout', (req, res) => {
  res.clearCookie('refreshToken');
  res.redirect('/login');
});


router.get('/profile/change-profile',verifyToken('mahasiswa'), async (req, res) => {
  const mahasiswa = await getMahasiswa(req, res); 

  const user = await getUser(req, res); 

  console.log(mahasiswa);
  res.render('user/change-profile', { mahasiswa, user , page:'home'});
});




router.get("/riwayat", verifyToken('mahasiswa'), getRiwayat);



router.get('/riwayat/:idPermintaan', verifyToken('mahasiswa'), async (req, res) => {
  const idPermintaan = req.params.idPermintaan;
  const permintaan = await Permintaan.findByPk(idPermintaan);
  

  const Status = await StatusPermintaan.findAll({
    where: { idPermintaan: idPermintaan}
  })

  const nimMahasiswa = permintaan.nim;
  const mahasiswa = await Mahasiswa.findOne({
    where: { nim: nimMahasiswa },
    include: {
        model: Users,
        attributes: ['email']
    }
});
  console.log(Status)

  if (permintaan) {
    res.render('user/riwayatDetail', { mahasiswa ,Status ,permintaan, page: 'riwayat' });
  } else {
    res.status(404).send('Permintaan not found');
  }
});

router.get('/preview', (req, res) => {
  const pdfUrl = `http://localhost:3000/data/surat/file.pdf`;
  const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent('http://www.pdf995.com/samples/pdf.pdf')}&embedded=true`;
  
  res.render('surat', { googleDocsUrl });
});



router.post('/change-profile', verifyToken('mahasiswa'), uploadProfilePicture);


router.post('/send-form', verifyToken('mahasiswa'), async (req, res) => {
  await sendForm(req, res);
})








module.exports = router;
