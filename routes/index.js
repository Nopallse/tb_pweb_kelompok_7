const express = require("express");
const { Login, Logout } = require("../controllers/auth.js");
const { refreshToken } = require("../controllers/RefreshToken.js");
const { verifyToken } = require("../middleware/VerifyToken.js")


const router = express.Router();

router.post('/login', Login);
router.get('/login', verifyToken({redirectToHome: true}), (req,res) => {
  res.render('login');
});
router.delete('/logout', Logout);
router.get('/logout', (req, res) => {
  res.clearCookie('refreshToken');
  res.redirect('/login');
});

module.exports = router;
