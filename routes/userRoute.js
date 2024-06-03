import express from "express";
import { verifyToken } from "../middleware/VerifyToken.js";
import { editProfile, getUser,getMahasiswa ,uploadProfilePicture  } from "../controllers/auth.js";
import { changePassword} from "../controllers/auth.js";
import { sendForm, getRiwayat} from "../controllers/Users.js";
import path from "path";
import multer from "multer";
import fs from 'fs/promises';


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








router.post('/change-profile', verifyToken('mahasiswa'), uploadProfilePicture);


router.post('/send-form', verifyToken('mahasiswa'), async (req, res) => {
  await sendForm(req, res);
})








  export default router;
