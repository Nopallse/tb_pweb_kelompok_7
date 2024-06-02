import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import libre from "libreoffice-convert";
import Users from "../models/UserModel.js";
import Permintaan from "../models/PermintaanModel.js";
import StatusPermintaaan from "../models/StatusPermintaanModel.js";
import Surat from "../models/SuratModel.js";
import Mahasiswa from "../models/MahasiswaModel.js";
import { getAdmin, getMahasiswa, getUser } from "./auth.js";

export const generate = async (req, res) => {
  try {
    const {
      idPermintaan,
      inputName,
      inputNim,
      inputDepartemen,
      inputTarget,
      inputTujuan,
      inputOrtu,
      inputPangkat,
      inputUnit,
      inputInstansi,
    } = req.body;

    const permintaan = await Permintaan.findByPk(idPermintaan);

    if (!permintaan) {
      return res.status(404).json({ message: "Permintaan tidak ditemukan" });
    }

    let target = permintaan.target === "Pribadi" ? "pribadi" : "orangtua";

    let templatePath = path.resolve("public/template", `template_${target}.docx`);
    const content = fs.readFileSync(templatePath);
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });


    const admin = await getAdmin(req, res);
    await Surat.create({
      idPermintaan: idPermintaan,
      nip: admin.nip,
      qr: "qr",
      tanggal_terbit: new Date(),
      valid_until: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    });
  
    const surat = await Surat.findOne({
      where: { idPermintaan: idPermintaan }
    }); 
    

    console.log(surat);
    console.log(surat.nomorSurat); 


    doc.setData({
      nomor: surat.nomorSurat,
      nama: permintaan.namaMahasiswa,
      nim: permintaan.nim,
      departemen: permintaan.departemen,
      semester: "genap",
      tahunAkademik: "2023/2024",
      namaOrtu: permintaan.namaOrangtua,
      nip: permintaan.nip,
      pangkatGolongan: permintaan.pangkatGolongan,
      unitKerja: permintaan.unitKerja,
      instansiInduk: permintaan.instansiInduk,
      tujuan: permintaan.tujuan,
    });

    const mahasiswa = await Mahasiswa.findOne({ where: { nim: permintaan.nim } });


    doc.render();

    const buf = doc.getZip().generate({
      type: "nodebuffer",
      compression: "DEFLATE",
    });

    const fileName = `Surat Keterangan Aktif.docx`;
    const userDir = path.resolve("public", "data", `user_${mahasiswa.id}`);
    const outputPath = path.join(userDir, fileName);

    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, buf);

    const pdfDir = path.resolve(userDir, "surat");
    const pdfPath = path.join(pdfDir, `Surat Keterangan Aktif (${surat.nomorSurat}).pdf`);

    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }

    libre.convert(
      fs.readFileSync(outputPath),
      "pdf",
      undefined,
      async (err, result) => {
        if (err) {
          console.error("Error converting DOCX to PDF:", err);
          return res.status(500).send("Error converting DOCX to PDF");
        }

        fs.writeFileSync(pdfPath, result);
        console.log("File converted successfully");

        await fs.promises.unlink(outputPath);

        await permintaan.update({ status: "selesai" });

        

        await StatusPermintaaan.create({
          idPermintaan: idPermintaan,
          status: "selesai",
        });

        res.status(200).json({ message: 'Surat berhasil di proses' });
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};


export const getMahasiswaById = async (mahasiswaId) => {
  try {
      const mahasiswa = await Mahasiswa.findOne({
          where: { id: mahasiswaId },
          include: {
              model: Users,
              attributes: ['email']
          }
      });
      if (!mahasiswa) {
          return { message: 'Mahasiswa not found' };
      }
      console.log('Mahasiswa:', mahasiswa);
      return mahasiswa;
  } catch (error) {
      console.error(error);
      throw new Error('Error fetching mahasiswa');
  }
};

export const getPermintaan = async (req, res) => {
  try {
    const admin = await getUser(req, res); 
    const user = await getUser(req, res); 

    const perPage = 10; // Number of entries per page
    const page = req.query.page ? parseInt(req.query.page) : 1; // Current page, default to 1 if not specified

    const totalEntries = await Permintaan.count(); // Get total number of entries
    const totalPages = Math.ceil(totalEntries / perPage); // Calculate total number of pages

    // Fetch only the entries for the current page
    const permintaan = await Permintaan.findAll({
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

    res.render("admin/permintaan", {  
      admin,
      user,
      permintaan: permintaanWithMahasiswa,
      currentPage: page,
      totalPages: totalPages,
      totalEntries: totalEntries,
      page: 'permintaan'
    });
  } catch (error) {
    console.error("Error fetching permintaan:", error);
    res.status(500).send("Internal Server Error");
  }
};
