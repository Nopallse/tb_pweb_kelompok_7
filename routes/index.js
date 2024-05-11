import express from "express";
import session from "express-session";
import { getUsers, Register, Login, Logout } from "../controllers/auth.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { checkUserLoggedIn } from "../controllers/auth.js";

const router = express.Router();

router.use(session({
  secret: 'secret_key', 
  resave: false,
  saveUninitialized: true
}));

// Endpoint untuk mendapatkan data pengguna
router.get('/users', verifyToken, async (req, res) => {
  try {
    // Ambil data pengguna dari database
    const users = await getUsers(); 

    // Kirim data pengguna sebagai respons
    res.json(users);
  } catch (error) {

    console.error('Error fetching user data:', error);

    res.status(500).send('Internal Server Error');
  }
});

// Endpoint untuk registrasi pengguna baru
router.post('/users', Register);

// Endpoint untuk login
router.post('/login', Login);

// Endpoint untuk mendapatkan refresh token baru
router.get('/token', refreshToken);

// Endpoint untuk logout
router.delete('/logout', Logout);

router.get('/', (req, res) => {
  res.redirect('/home'); // Redirect ke halaman home
});
// Route untuk halaman home
router.get('/home', async (req, res) => {
  const { userLoggedIn, user } = checkUserLoggedIn(req);
  res.render('user/home', { userLoggedIn, user });
});



// Route untuk halaman login
router.get('/login', (req, res) => {
  res.render('login');
});

// Route untuk logout
router.get('/logout', (req, res) => {
  // Hapus cookie refreshToken
  res.clearCookie('refreshToken');

  // Redirect kembali ke halaman utama
  res.redirect('/home');
});

router.get('/account', verifyToken, async (req, res) => {
  res.send('Token valid, akses ke rute /account berhasil.');
});

export default router;
