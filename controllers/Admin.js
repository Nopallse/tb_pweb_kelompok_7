import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import libre from "libreoffice-convert";
import Users from "../models/UserModel.js";
import Permintaan from "../models/PermintaanModel.js";
import StatusPermintaaan from "../models/StatusModel.js";

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
      inputNip,
      inputPangkat,
      inputUnit,
      inputInstansi,
    } = req.body;

    const user = await Users.findOne(req.inputNim);
    const id = user.id;
    const permintaan = await Permintaan.findByPk(idPermintaan);

    console.log(idPermintaan);
    console.log(permintaan.nim);
    console.log(permintaan.departemen);
    console.log(permintaan.tujuan);
    console.log(id);

    if (!user) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }
    let target = permintaan.target === "Pribadi" ? "pribadi" : "orangtua";
    console.log(permintaan.target)
    console.log(target)

    let templatePath = path.resolve("public/template", `template_${target}.docx`);

    console.log(templatePath)
    // Baca template.docx
    const content = fs.readFileSync(templatePath);
    const zip = new PizZip(content);

    // Buat objek Docxtemplater dengan template
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    doc.setData({
      nomor: idPermintaan,
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

    console.log("nomor: " + idPermintaan);
    console.log("nama: " + permintaan.namaMahasiswa);
    console.log("nim: " + permintaan.nim);
    console.log("departemen: " + permintaan.departemen);
    console.log("semester: " + "genap");
    console.log("tahunAkademik: " + "2023/2024");
    console.log("namaOrtu: " + permintaan.namaOrangtua);
    console.log("nip: " + permintaan.nip);
    console.log("pangkatGolongan: " + permintaan.pangkatGolongan);
    console.log("unitKerja: " + permintaan.unitKerja);
    console.log("instansiInduk: " + permintaan.instansiInduk);
    console.log("tujuan: " + permintaan.departemen);

    doc.render();

    // Generate dokumen sebagai node buffer
    const buf = doc.getZip().generate({
      type: "nodebuffer",
      compression: "DEFLATE",
    });

    // Mendefinisikan nama file output
    const fileName = `Surat Keterangan Aktif.docx`;

    // Menyimpan file output di dalam folder proyek
    const outputPath = path.resolve("public", "data", `user_${id}`, fileName);
    fs.writeFileSync(outputPath, buf);

    // Convert dari docx ke pdf
    const pdfPath = path.resolve(
      "public",
      "data",
      `user_${id}`,
      `Surat Keterangan Aktif.pdf`
    );

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

        // Hapus file DOCX setelah konversi berhasil
        await fs.promises.unlink(outputPath);

        await permintaan.update({ status: "selesai" });

        await StatusPermintaaan.create({
          idPermintaan: idPermintaan,
          status: "selesai",
        });

        // Kirim respons ke klien setelah konversi selesai
        res.status(200).json({ message: 'Surat berhasil di proses'});
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
