import express from "express";
import { verifyToken } from "../middleware/VerifyToken.js";
import { editProfile,getMahasiswa,getAdmin ,getUser,uploadProfilePicture } from "../controllers/auth.js";
import Users from "../models/UserModel.js";
import Permintaan from "../models/PermintaanModel.js"
const router = express.Router();
import { changePassword } from "../controllers/auth.js";
import { generate ,getMahasiswaById, getPermintaan} from "../controllers/Admin.js";
import Mahasiswa from "../models/MahasiswaModel.js";

router.get('/', (req, res) => {
  res.redirect('/admin/dashboard');
});

router.get("/dashboard", verifyToken('admin'), async (req, res) => {
  const admin = await getAdmin(req, res); 
  const permintaan = await Permintaan.findAll();


  res.render("admin/dashboard",{  admin ,permintaan, page: 'Dashboard' });
});

router.get("/profile", verifyToken('admin'), async (req, res) => {
  const admin = await getAdmin(req, res); 
  res.render("admin/profile",{  admin  ,page: 'Profile' });
});


router.get('/profile/change-profile',verifyToken('admin'), async (req, res) => {
  const admin = await getAdmin(req, res); 
  res.render('admin/change-profile', { admin , page:'Profile'});
});

router.post('/change-profile', verifyToken('admin'), uploadProfilePicture);


router.get('/change-password',verifyToken('admin'), async function (req, res) {
  const admin = await getUser(req, res); 
  res.render('admin/change-password', { admin , page:'change password'});
});

router.post('/change-password', verifyToken('admin'), async (req, res) => {
  await changePassword(req, res);
});







router.get("/mahasiswa", verifyToken('admin'), async (req, res) => {
  const admin = await getAdmin(req, res); 
  const mahasiswa = await Mahasiswa.findAll({ order: [['id', 'ASC']] });
  res.render("admin/mahasiswa",{  admin, mahasiswa , page: 'Mahasiswa' });
});

router.get('/mahasiswa/:id', async (req, res) => {
      const userId = req.params.id;
      const admin = await getAdmin(req, res); 
      const mahasiswa = await getMahasiswaById(userId);
      console.log(mahasiswa);
      res.render('admin/mahasiswaDetail', { admin, mahasiswa , page: 'permintaan'});

});

router.get("/permintaan", verifyToken('admin'), getPermintaan);


router.get('/permintaan/:idPermintaan', verifyToken('admin'), async (req, res) => {
  const admin = await getAdmin(req, res); 
  const idPermintaan = req.params.idPermintaan;
  const permintaan = await Permintaan.findByPk(idPermintaan);
  const nimMahasiswa = permintaan.nim;
  const mahasiswa = await Mahasiswa.findOne({
    where: { nim: nimMahasiswa },
    include: {
        model: Users,
        attributes: ['email']
    }
});

  // Fetch the specific permintaan detail by id

  if (permintaan) {
    res.render('admin/permintaanDetail', { admin,mahasiswa ,permintaan, page: 'permintaan' });
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
