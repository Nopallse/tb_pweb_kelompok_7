import express from "express";

import { checkUserLoggedIn } from "../controllers/auth.js";

const router = express.Router();


router.get('/admin', (req, res) => {
  res.redirect('/admin/login'); // Redirect ke halaman home
});
// Route untuk halaman home
router.get('/dashboard', async (req, res) => {
  const { userLoggedIn, user } = checkUserLoggedIn(req);
  res.render('admin/dashboard', { userLoggedIn, user });
});

router.get('/profil', async (req, res) => {
  const { userLoggedIn, user } = checkUserLoggedIn(req);
  res.render('admin/profil', { userLoggedIn, user });
});




export default router;
