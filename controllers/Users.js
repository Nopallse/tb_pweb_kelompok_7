import Users from "../models/UserModel.js";
import Mahasiswa from "../models/MahasiswaModel.js";
import StatusPermintaan from "../models/StatusPermintaanModel.js";
import Permintaan from "../models/PermintaanModel.js";
import { getMahasiswa, getUser } from "./auth.js";

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
      status: "Diajukan"
    });
    
    const idPermintaan = permintaanBaru.idPermintaan; // Asumsikan kolom ID di model Permintaan adalah 'id'
    console.log(idPermintaan);
    await StatusPermintaan.create({
      idStatus: "1",
      idPermintaan: idPermintaan,
      status: "Selesai",
    });

    await StatusPermintaan.create({
      idStatus: "2",
      idPermintaan: idPermintaan,
      status: "Sedang Berlangsung",
    });

    await StatusPermintaan.create({
      idStatus: "3",
      idPermintaan: idPermintaan,
      status: "Belum Diproses",
    });

    return res.redirect('/home');

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};


export const getRiwayat = async (req, res) => {
  try {
    const mahasiswa = await getMahasiswa(req, res); 
    const user = await getUser(req, res); 

    const perPage = 10; // Number of entries per page
    const page = req.query.page ? parseInt(req.query.page) : 1; // Current page, default to 1 if not specified

    const totalEntries = await Permintaan.count(); // Get total number of entries
    const totalPages = Math.ceil(totalEntries / perPage); // Calculate total number of pages

    // Fetch only the entries for the current page and with nim equal to mahasiswa.nim
    const permintaan = await Permintaan.findAll({
      where: { nim: mahasiswa.nim }, // Add condition to select only permintaan with nim equal to mahasiswa.nim
      offset: (page - 1) * perPage,
      limit: perPage
    });

    // Iterate over permintaan to fetch additional mahasiswa details
    const permintaanWithMahasiswa = await Promise.all(permintaan.map(async (entry) => {
      const mahasiswa = await Mahasiswa.findOne({
        where: { nim: entry.nim },
        include: {
          model: Users,
          attributes: ['email']
        }
      });
      return {
        ...entry.toJSON(), // Convert Sequelize instance to plain object
        mahasiswa
      };
    }));

    res.render('user/riwayat', {
      user,
      permintaan: permintaanWithMahasiswa,
      currentPage: page,
      totalPages: totalPages,
      totalEntries: totalEntries,
      mahasiswa,
      page: 'riwayat'
    });
  } catch (error) {
    console.error("Error fetching permintaan:", error);
    res.status(500).send("Internal Server Error");
  }
};
