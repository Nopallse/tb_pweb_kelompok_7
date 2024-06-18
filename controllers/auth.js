const jwt = require('jsonwebtoken');
const Users = require("../models/UserModel.js");
const bcrypt = require("bcryptjs");
const fs = require('fs/promises');
const multer = require('multer');
const Admin = require('../models/AdminModel.js');
const Mahasiswa = require('../models/MahasiswaModel.js');
const { where } = require('sequelize');



const Login = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Email tidak ditemukan, silahkan daftar terlebih dahulu" });
    }

    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Password salah" });
    }

    const userId = user.id;
    const name = user.name;
    const email = user.email;
    const role = user.role;
    const nim = user.nim;
    const hp = user.hp;
    const departemen = user.departemen;

    const token = jwt.sign({ userId, name, email, role, nim, hp, departemen }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign({ userId, name, email, role, nim, hp, departemen }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    await Users.update(
      { refresh_token: refreshToken },
      { where: { id: userId } }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 * 7,
      secure: process.env.NODE_ENV === 'production' // Hanya gunakan secure di produksi
    });

    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    console.log("Login berhasil");

    res.status(200).json({ message: 'Login berhasil', role: user.role });
  } catch (error) {
    console.log(error);
    res.status(401).json(error.message);
  }
};



const Logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) return res.sendStatus(204);

    const user = await Users.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });

    if (!user) {
      console.log('User tidak ditemukan dengan refresh token tersebut.');
      return res.sendStatus(204);
    }

    const userId = user.id;
    
    await Users.update({ refresh_token: null }, {
      where: {
        id: userId
      }
    });

    res.clearCookie('refreshToken');

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).send("Terjadi kesalahan server");
  }
};

function checkUserLoggedIn(req) {
    const refreshToken = req.cookies.refreshToken;
    
    let user = null;

    if (refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            user = {
                userId: decoded.userId,
                email: decoded.email,
                role: decoded.role,
            };
            
        } catch (error) {
            console.error('Token invalid or expired:', error.message);
            return { user: null };
        }
    }
    return { user };
}

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await Users.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password saat ini salah" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await user.update({ password: hashedNewPassword });

    res.redirect('/logout');
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

const editProfile = async (req, res) => {
  try {
    const { newName, newNim, newPhoneNumber } = req.body;
    console.log(req.body);
    const mahasiswa = await Mahasiswa.findOne({ where: { nim: newNim } });
    await mahasiswa.update({ 
      name: newName,
      nim: newNim,
      phone: newPhoneNumber
    });
    return res.redirect('/profile');
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

const getUser = async (req, res) => {
  const { user } = checkUserLoggedIn(req, res);
  if (!user) {
    return res.redirect('/login');
  }

  const newProfile = await Users.findByPk(user.userId);
  
  return newProfile; 
};

const getAdmin = async (req, res) => {
  const { user } = checkUserLoggedIn(req, res);

  try {
    const admin = await Admin.findOne({
      where: { id: user.userId },
      include: {
        model: Users,
        attributes: ['email']
      }
    });
    return admin;
  } catch (error) {
    console.error('Error while fetching admin:', error);
    return null;
  }
};

const getMahasiswa = async (req, res) => {
  const { user } = checkUserLoggedIn(req, res);

  try {
    const mahasiswa = await Mahasiswa.findOne({
      where: { id: user.userId },
      include: {
        model: Users,
        attributes: ['email']
      }
    });
    return mahasiswa;
  } catch (error) {
    console.error('Error while fetching mahasiswa:', error);
    return null;
  }
};

const uploadProfilePicture = async (req, res) => {
  const upload = multer({
    storage: multer.diskStorage({
      destination: async (req, file, cb) => {
        const user = await getUser(req, res);
        const userId = user.id;
        const dir = `public/data/user_${userId}`;
        await fs.mkdir(dir, { recursive: true });
        cb(null, dir);
      },
      filename: (req, file, cb) => {
        cb(null, 'profile.jpg');
      }
    })
  }).single('profile');

  await upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    await editProfile(req, res);
  });
};

module.exports = {
  Login,
  Logout,
  checkUserLoggedIn,
  changePassword,
  editProfile,
  getUser,
  getAdmin,
  getMahasiswa,
  uploadProfilePicture
};
