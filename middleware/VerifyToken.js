import jwt from 'jsonwebtoken';

function verifyToken(role) {
  return function (req, res, next) {
    const accessToken = req.cookies.token;
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      console.log("No refresh token found, redirecting to login");
      return res.redirect('/login');
    }

    if (!accessToken) {
      console.log("No access token found, redirecting to login");
      return res.redirect('/login');
    }

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          console.log("Access token expired, verifying refresh token");

          jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decodedRefresh) => {
            if (err) {
              console.log("Refresh token verification failed:", err);
              return res.redirect('/login');
            }

            const newAccessToken = jwt.sign({ userId: decodedRefresh.userId, role: decodedRefresh.role }, process.env.ACCESS_TOKEN_SECRET, {
              expiresIn: '15m'
            });

            console.log("New access token generated:", newAccessToken);

            res.cookie('token', newAccessToken, { httpOnly: true, secure: true });

            req.userId = decodedRefresh.userId;
            req.userRole = decodedRefresh.role;

            if (role && req.userRole !== role) {
              if (req.userRole === "mahasiswa") {
                return res.redirect("/home");
              } else if (req.userRole === "admin") {
                return res.redirect("/admin/dashboard");
              }
            }
            return next();
          });
        } else {
          console.log("Access token verification failed:", err);
          return res.status(403).json({ message: "Token akses tidak valid" });
        }
      } else {
        req.userId = decoded.userId;
        req.userRole = decoded.role;

        if (role && req.userRole !== role) {
          if (req.userRole === "mahasiswa") {
            return res.redirect("/home");
          } else if (req.userRole === "admin") {
            return res.redirect("/admin/dashboard");
          }
        }

        next();
      }
    });
  };
}

export { verifyToken };