const express = require("express");
const { verifyToken } = require("../middleware/VerifyToken.js");
const { uploadProfilePicture, changePassword } = require("../controllers/auth.js");
const {
  generate,
  verifikasi,
  getDashboard,
  getAdminProfile,
  getAdminChangeProfile,
  getAdminChangePassword,
  getAdminMahasiswa,
  getDetailMahasiswa,
  getPermintaanVerify,
  getPermintaanUnverified,
  getDetailPermintaanVerify,
  getDetailPermintaanUnverified,
  getSurat,
} = require("../controllers/Admin.js");

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/admin/dashboard");
});

router.get("/dashboard", verifyToken("admin"), getDashboard);

router.get("/profile", verifyToken("admin"), getAdminProfile);

router.get("/profile/change-profile", verifyToken("admin"), getAdminChangeProfile);

router.post("/change-profile", verifyToken("admin"), uploadProfilePicture);

router.get("/change-password", verifyToken("admin"), getAdminChangePassword);

router.post("/change-password", verifyToken("admin"), changePassword);

router.get("/mahasiswa", verifyToken("admin"), getAdminMahasiswa);

router.get("/mahasiswa/:id", getDetailMahasiswa);

router.get("/permintaan-unverified", verifyToken("admin"), getPermintaanUnverified);

router.get("/permintaan-unverified/:idPermintaan", verifyToken("admin"), getDetailPermintaanUnverified);

router.get("/permintaan-verify", verifyToken("admin"), getPermintaanVerify);

router.get("/permintaan-verify/:idPermintaan", verifyToken("admin"), getDetailPermintaanVerify);

router.post("/verifikasi", verifyToken("admin"), verifikasi);

router.get("/surat", verifyToken("admin"), getSurat);

router.post("/process-form", verifyToken("admin"), generate);

module.exports = router;
