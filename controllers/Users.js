import Users from "../models/UserModel.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"  
import Permintaan from "../models/PermintaanModel.js";

export const sendForm = async (req, res) => {
  try {
    const { inputName, inputNim, inputDepartemen, inputTarget, inputTujuan, inputOrtu, inputNip, inputPangkat, inputUnit, inputInstansi } = req.body;
    
    const user = await Users.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }


    // Memasukkan data form ke dalam basis data menggunakan model Permintaan
    const newForm = await Permintaan.create({ 
      target: inputTarget,
      tujuan: inputTujuan,
      namaMahasiswa: user.name,
      nim: user.nim,
      departemen: user.departemen,
      namaOrangtua: inputOrtu,
      nip: inputNip,
      pangkatGolongan: inputPangkat,
      unitKerja: inputUnit,
      instansiInduk: inputInstansi,
      status: "proses"
    });

    console.log('Form Data:', newForm); // Log data form yang baru dibuat

    return res.status(201).json(newForm); // Mengembalikan respons dengan data form yang baru dibuat
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
  

