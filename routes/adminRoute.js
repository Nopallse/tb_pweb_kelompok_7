import express from "express";
import { verifyToken } from "../middleware/VerifyToken.js";
import { editProfile, getUser } from "../controllers/auth.js";

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/admin/dashboard');
});

router.get("/dashboard", verifyToken('admin'), async (req, res) => {
  const user = await getUser(req, res); 
  res.render("admin/dashboard",{  user });
});

router.get("/profile", verifyToken('admin'), async (req, res) => {
  const user = await getUser(req, res); 
  res.render("admin/profile",{  user });
});





export default router;
