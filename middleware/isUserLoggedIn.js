const jwt = require('jsonwebtoken');

// Middleware untuk memeriksa apakah pengguna sudah login
const isUserLoggedIn = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      if (decoded) {
        // Jika token valid, arahkan pengguna ke beranda atau dashboard
        return res.redirect('/');
      }
    } catch (error) {
      console.error('Error verifying token:', error.message);
      // Jika token tidak valid, hapus token dari cookie
      res.clearCookie('refreshToken');
    }
  }

  // Jika tidak ada token, lanjutkan ke halaman login
  next();
};

// Middleware untuk memeriksa dan memperbarui token


module.exports = { isUserLoggedIn };
