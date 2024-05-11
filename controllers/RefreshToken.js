import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    console.log('Refresh Token:', refreshToken); // Tambahkan ini

    const user = await Users.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!user[0]) { 
        console.log('User tidak ditemukan dengan refresh token tersebut'); // Tambahkan ini
        return res.sendStatus(403);
    }
    
    console.log('User ditemukan:', user[0]); // Tambahkan ini

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err){ 
            console.log('Verifikasi refresh token gagal:', err); // Tambahkan ini
            return res.sendStatus(403);
        }
        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const accessToken = jwt.sign(
          { userId, name, email },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "20s",
          }
        );
        res.json({ accessToken });
      }
    );
  } catch (error) {
    console.log(error);
  }
};