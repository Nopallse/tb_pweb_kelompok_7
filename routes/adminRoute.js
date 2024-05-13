import express from "express";
import { verifyToken } from "../middleware/VerifyToken.js";
import { checkUserLoggedIn } from "../controllers/auth.js";
import checkRole from "../middleware/checkrole.middleware.js";
const router = express.Router();


router.get('/admin', (req, res) => {
  res.redirect('/dashboard'); // Redirect ke halaman home
});


// // Route untuk halaman home
// router.get('/dashboard', async (req, res) => {
//   const { userLoggedIn, user } = checkUserLoggedIn(req);
//   res.render('admin/dashboard', { userLoggedIn, user });
// });



router.get("/dashboard", verifyToken, checkRole("admin"), function (req, res, next) {
  const {  user } = checkUserLoggedIn(req);
  res.render("admin/dashboard",{  user });
});





router.get('/profile', async (req, res) => {
  const { userLoggedIn, user } = checkUserLoggedIn(req);
  res.render('admin/profile', { userLoggedIn, user });
});




export default router;
