import express from "express";
import { verifyToken } from "../middleware/VerifyToken.js";
import { editProfile, getUser,uploadProfilePicture } from "../controllers/auth.js";
import Users from "../models/UserModel.js";
import Permintaan from "../models/PermintaanModel.js"
const router = express.Router();
import { changePassword } from "../controllers/auth.js";
import { generate } from "../controllers/Admin.js";

router.get('/', (req, res) => {
  res.redirect('/admin/dashboard');
});

router.get("/dashboard", verifyToken('admin'), async (req, res) => {
  const admin = await getUser(req, res); 
  const user = await getUser(req, res); 
  
  const permintaan = await Permintaan.findAll();

  res.render("admin/dashboard",{  admin , user,permintaan, page: 'Dashboard' });
});

router.get("/profile", verifyToken('admin'), async (req, res) => {
  const admin = await getUser(req, res); 
  res.render("admin/profile",{  admin, page: 'Profile' });
});

router.get('/change-password',verifyToken('admin'), async function (req, res) {
  const admin = await getUser(req, res); 
  res.render('admin/change-password', { admin , page:'change password'});
});

router.post('/change-password', verifyToken('admin'), async (req, res) => {
  await changePassword(req, res);
});

router.get('/profile/change-profile',verifyToken('admin'), async (req, res) => {
  const admin = await getUser(req, res); 
  res.render('admin/change-profile', { admin , page:'Profile'});
});


router.post('/change-profile', verifyToken('admin'), uploadProfilePicture);




router.get("/mahasiswa", verifyToken('admin'), async (req, res) => {
  const admin = await getUser(req, res); 
  const users = await Users.findAll();
  res.render("admin/mahasiswa",{  admin,users, page: 'Mahasiswa' });
});

router.get('/mahasiswa/:id', async (req, res) => {
      const userId = req.params.id;
      const user = await Users.findByPk(userId);
      const admin = await getUser(req, res); 
      
      if (!user) {
          res.status(404).send('User not found');
          return;
      }
      res.render('admin/mahasiswaDetail', { admin, user, page: 'permintaan'});

});

router.get("/permintaan", verifyToken('admin'), async (req, res) => {
  const admin = await getUser(req, res); 
  const user = await getUser(req, res); 
  
  const permintaan = await Permintaan.findAll();

  res.render("admin/permintaan",{  admin , user,permintaan, page: 'permintaan' });
});

router.get('/permintaan/:idPermintaan', verifyToken('admin'), async (req, res) => {
  const admin = await getUser(req, res); 
  const user = await getUser(req, res); 
  const idPermintaan = req.params.idPermintaan;

  // Fetch the specific permintaan detail by id
  const permintaan = await Permintaan.findByPk(idPermintaan);

  if (permintaan) {
    res.render('admin/permintaanDetail', { admin, user, permintaan, page: 'permintaan' });
  } else {
    res.status(404).send('Permintaan not found');
  }
});


router.post('/process-form', verifyToken('admin'), generate );




router.get("/arsip", verifyToken('admin'), async (req, res) => {
  const admin = await getUser(req, res); 
  const user = await getUser(req, res); 
  
  const permintaan = await Permintaan.findAll();

  res.render("admin/arsip",{  admin , user,permintaan, page: 'arsip' });
});

router.get('/arsip/:idPermintaan', verifyToken('admin'), async (req, res) => {
  const admin = await getUser(req, res); 
  const user = await getUser(req, res); 
  const idPermintaan = req.params.idPermintaan;

  // Fetch the specific permintaan detail by id
  const permintaan = await Permintaan.findByPk(idPermintaan);

  if (permintaan) {
    res.render('admin/arsipDetail', { admin, user, permintaan, page: 'arsip' });
  } else {
    res.status(404).send('Arsip not found');
  }
});




export default router;
