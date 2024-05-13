import express from "express";
import { verifyToken } from "../middleware/VerifyToken.js";
import { checkUserLoggedIn, editProfile, view_profile } from "../controllers/auth.js";
import { changePassword} from "../controllers/auth.js";

const router = express.Router();


router.get('/', (req, res) => {
  res.redirect('/home'); // Redirect ke halaman home
});
// Route untuk halaman home




router.get('/home', async (req, res) => {
  const {  user } = checkUserLoggedIn(req);
  res.render('home', {  user });
});







router.get('/profile',verifyToken, view_profile );



router.get('/profile/change-password',verifyToken, async (req, res) => {
  const { user } = checkUserLoggedIn(req);
  res.render('user/change-password', { user });
});

// Route untuk mengganti password pengguna
router.post('/change-password', verifyToken, async (req, res) => {
  try {
    await changePassword(req, res);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});






// Route untuk mengganti password pengguna
router.post('/change-password', verifyToken, async (req, res) => {
  try {
    await changePassword(req, res);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});


router.get('/profile/change-profile',verifyToken, async (req, res) => {
  const { userLoggedIn, user } = checkUserLoggedIn(req);
  res.render('user/change-profile', { user });
});




// Route untuk mengganti password pengguna
router.post('/change-profile', verifyToken, async (req, res) => {
  try {
    await editProfile(req, res);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

  export default router;
