const jwt = require('jsonwebtoken');

const verifyToken = (role) => async (req, res, next) => {
  const accessToken = req.cookies.token;
  const refreshToken = req.cookies.refreshToken;

  
  if (!refreshToken) {
    console.log("No refresh token found, redirecting to login");
    return res.redirect('/login');
  }

  try {
    
    if (!accessToken) {
      throw new Error("No access token found");
    }

    
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
  } catch (err) {
    if (err.name === 'TokenExpiredError' || err.message === "No access token found") {
      console.log("Access token expired or not found, verifying refresh token");
      try {
        const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const newAccessToken = jwt.sign(
          { userId: decodedRefresh.userId, role: decodedRefresh.role },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '15m' }
        );

        console.log("New access token generated:", newAccessToken);
        res.cookie('token', newAccessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        req.userId = decodedRefresh.userId;
        req.userRole = decodedRefresh.role;
      } catch (err) {
        console.log("Refresh token verification failed:", err);
        return res.redirect('/login');
      }
    } else {
      console.log("Access token verification failed:", err);
      return res.redirect('/login');
    }
  }

  
  if (role && req.userRole !== role) {
    if (req.userRole === "mahasiswa") {
      return res.redirect("/home");
    } else if (req.userRole === "admin") {
      return res.redirect("/admin/dashboard");
    }
  }

  next();
};

module.exports = { verifyToken };
