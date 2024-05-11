import express from "express";
import { verifyToken } from "../middleware/VerifyToken.js";
import { checkUserLoggedIn } from "../controllers/auth.js";


const router = express.Router();


router.get('/', (req, res) => {
  res.redirect('/home'); // Redirect ke halaman home
});
// Route untuk halaman home
router.get('/home', async (req, res) => {
  const { userLoggedIn, user } = checkUserLoggedIn(req);
  res.render('home', { userLoggedIn, user });
});

router.get('/profil', async (req, res) => {
  const { userLoggedIn, user } = checkUserLoggedIn(req);
  res.render('user/profil', { userLoggedIn, user });
});




export default router;
