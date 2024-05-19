import express from "express";
import { verifyToken } from "../middleware/VerifyToken.js";
import { editProfile, getUser } from "../controllers/auth.js";
import { changePassword} from "../controllers/auth.js";

const router = express.Router();


router.get('/', (req, res) => {
  res.redirect('/home'); 
});


router.get("/home", verifyToken('mahasiswa'), async function (req, res) {
    const user = await getUser(req, res); 
    res.render("user/home", { user });
});

router.get("/layanan", verifyToken('mahasiswa'), async function (req, res) {
  const user = await getUser(req, res); 
  res.render("user/layanan", { user });
});

router.get("/layanan/form", verifyToken('mahasiswa'), async function (req, res) {
  const user = await getUser(req, res); 
  res.render("user/form", { user });
});

router.get("/profile", verifyToken('mahasiswa'), async function (req, res) {
  const user = await getUser(req, res); 
  res.render("user/profile", { user });
});



router.get('/profile/change-password',verifyToken('mahasiswa'), async function (req, res) {
  const user = await getUser(req, res); 
  res.render('user/change-password', { user });
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
  res.render('user/change-profile', { user });
});

router.post('/change-profile', verifyToken('mahasiswa'), async (req, res) => {
  await editProfile(req, res);
});

  export default router;
