const express = require("express");
const { verifyToken } = require("../middleware/VerifyToken.js");
const { editProfile, getUser, getMahasiswa, uploadProfilePicture } = require("../controllers/auth.js");
const { changePassword } = require("../controllers/auth.js");
const { sendForm, getRiwayat,upload,validateForm,validationResult} = require("../controllers/Users.js");
const { decrypt, encrypt } = require("../controllers/encryptionController.js");
const {fs} = require('fs');
const path = require('path');
const Permintaan = require("../models/PermintaanModel.js");
const Mahasiswa = require("../models/MahasiswaModel.js");
const Users = require("../models/UserModel.js");
const StatusPermintaan = require("../models/StatusPermintaanModel.js");
const Surat = require("../models/SuratModel.js");
const Notification = require("../models/NotificationModel.js");
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

router.get("/layanan/form", verifyToken('mahasiswa'), async (req, res) => {
  const user = await getUser(req, res); 
  const mahasiswa = await getMahasiswa(req, res); 

  res.render("user/form", { mahasiswa, user, page:'layanan', errors: [] });
});
router.post('/send-form', verifyToken('mahasiswa'), upload.single('berkas'), validateForm, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const user = await getUser(req, res); 
    const mahasiswa = await getMahasiswa(req, res);
    return res.render("user/form", { mahasiswa, user, page: 'home', errors: errors.array() });
  }

  await sendForm(req, res);
  console.log(req.body);
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
  try {

  const encryptedIdPermintaan = req.params.idPermintaan;
  const idPermintaan = decrypt(encryptedIdPermintaan);
  
  const permintaan = await Permintaan.findOne({
    where: { idPermintaan: idPermintaan },
    include: {
        model: Surat,
        attributes: ['nomorSurat']
    }
});


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

  if (permintaan && permintaan.surat && permintaan.surat.nomorSurat) {
    const downloadURL = encrypt(`/data/surat/Surat Keterangan Aktif (${permintaan.surat.nomorSurat}).pdf`);
    res.render('user/riwayatDetail', { mahasiswa, Status, permintaan, downloadURL, page: 'riwayat' });

  } else {
    const downloadURL ="kosong"
    res.render('user/riwayatDetail', { mahasiswa, Status, permintaan, downloadURL, page: 'riwayat' });

  }

} catch (error) {
  console.error("Error decrypting parameter:", error);
  res.status(500).send("Internal Server Error");
}
});


router.get('/download/:namaSurat', async (req, res) => {
  try {
    const encryptednamaSurat = req.params.namaSurat;
    const namaSurat = decrypt(encryptednamaSurat);
    console.log(namaSurat);


      const downloadURL = `/data/surat/${namaSurat}`;
      const filePath = path.join(__dirname, '..', 'public', `${namaSurat}`);

      console.log(filePath);
      console.log(filePath);
      console.log(filePath);
      console.log(filePath);
      
      res.download(filePath, (err) => {
        if (err) {
          console.error("File download error:", err);
          res.status(500).send("Error downloading file");
        }
      });

  } catch (error) {
    console.error("Error decrypting parameter:", error);
    res.status(500).send("Internal Server Error");
  }
});


router.get('/data/surat/:namaSurat', async (req, res) => {
  try {
    const encryptednamaSurat = req.params.namaSurat;
    const namaSurat = decrypt(encryptednamaSurat);
    console.log(namaSurat);

    const filePath = path.join(__dirname, '..', 'public', 'data', 'surat', `${namaSurat}`);
    const fileUrl = `http://8.215.33.203:3001/data/surat/${namaSurat}`;

    console.log(filePath);

    const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;

    res.render('preview', { googleDocsUrl });

  } catch (error) {
    console.error("Error decrypting parameter:", error);
    res.status(500).send("Internal Server Error");
  }
});



router.post('/change-profile', verifyToken('mahasiswa'), uploadProfilePicture);





router.get('/notification',verifyToken('mahasiswa'), async (req, res) => {
  const mahasiswa = await getMahasiswa(req, res); 

  const user = await getUser(req, res); 
  console.log(user);
  const notification = await Notification.findAll({
    where: { userId: mahasiswa.nim },
    order: [['id', 'DESC']],
  
});
  console.log(notification);

// Render the notifications page and pass the notifications data
  console.log(mahasiswa);
  res.render('user/notification', { mahasiswa, user ,notification, page:'home'});
});







module.exports = router;
