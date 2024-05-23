import express from "express";
import { verifyToken } from "../middleware/VerifyToken.js";
import { editProfile, getUser, uploadProfilePicture  } from "../controllers/auth.js";
import { changePassword} from "../controllers/auth.js";
import { sendForm } from "../controllers/Users.js";
import path from "path";
import multer from "multer";
import fs from 'fs/promises';


const router = express.Router();


router.get('/', (req, res) => {
  res.redirect('/home'); 
});


router.get("/home", verifyToken('mahasiswa'), async function (req, res) {
    const user = await getUser(req, res); 
    res.render("user/home", { user , page:'home' });
});

router.get("/layanan", verifyToken('mahasiswa'), async function (req, res) {
  const user = await getUser(req, res); 
  res.render("user/layanan", { user , page:'home'});
});

router.get("/layanan/form", verifyToken('mahasiswa'), async function (req, res) {
  const user = await getUser(req, res); 
  res.render("user/form", { user , page:'home'});
});

router.get("/profile", verifyToken('mahasiswa'), async function (req, res) {
  const user = await getUser(req, res); 
  res.render("user/profile", { user , page:'home'});
});



router.get('/profile/change-password',verifyToken('mahasiswa'), async function (req, res) {
  const user = await getUser(req, res); 
  res.render('user/change-password', { user , page:'home'});
});

router.post('/change-password', verifyToken('mahasiswa'), async (req, res) => {
  await changePassword(req, res);
});


router.get('/logout', (req, res) => {
  res.clearCookie('refreshToken');
  res.redirect('/login');
});

router.post('/change-password', verifyToken, async (req, res) => {
  await changePassword(req, res);
});

router.get('/profile/change-profile',verifyToken('mahasiswa'), async (req, res) => {
  const user = await getUser(req, res); 
  res.render('user/change-profile', { user , page:'home'});
});










router.post('/change-profile', verifyToken('mahasiswa'), uploadProfilePicture);


router.post('/send-form', verifyToken('mahasiswa'), async (req, res) => {
  await sendForm(req, res);
})








  export default router;
