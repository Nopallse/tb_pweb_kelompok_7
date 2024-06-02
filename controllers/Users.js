import Users from "../models/UserModel.js";
import Mahasiswa from "../models/MahasiswaModel.js";
import StatusPermintaan from "../models/StatusPermintaanModel.js";
import Permintaan from "../models/PermintaanModel.js";

export const sendForm = async (req, res) => {
  try {
    const { inputName, inputNim, inputDepartemen, inputTarget, inputTujuan, inputOrtu, inputNip, inputPangkat, inputUnit, inputInstansi } = req.body;
    


    // Extract nim from associated Mahasiswa model

    // Memasukkan data form ke dalam basis data menggunakan model Permintaan
    const permintaanBaru = await Permintaan.create({ 
      target: inputTarget,
      tujuan: inputTujuan,
      nim: inputNim,
      namaOrangtua: inputOrtu,
      nip: inputNip,
      pangkatGolongan: inputPangkat,
      unitKerja: inputUnit,
      instansiInduk: inputInstansi,
      status: "proses"
    });
    
    const idPermintaan = permintaanBaru.idPermintaan; // Asumsikan kolom ID di model Permintaan adalah 'id'
    console.log(idPermintaan);
    await StatusPermintaan.create({
      idPermintaan: idPermintaan,
      status: "proses",
    });

    return res.redirect('/home');

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
