const Users = require("../models/UserModel.js");
const jwt = require("jsonwebtoken");

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    console.log('Received refresh token:', refreshToken);

    const user = await Users.findOne({
      where: { refresh_token: refreshToken },
    });

    if (!user) {
      console.log('User tidak ditemukan dengan refresh token tersebut');
      return res.sendStatus(403);
    }

    console.log('User ditemukan:', user);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        console.log('Verifikasi refresh token gagal:', err);
        return res.sendStatus(403);
      }

      const { userId, email, role } = decoded;
      const newAccessToken = jwt.sign({ userId, email, role }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
      });

      console.log('New access token generated:', newAccessToken);

      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.redirect('/login');
  }
};

module.exports = { refreshToken };
