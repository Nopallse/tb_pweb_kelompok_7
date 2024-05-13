import jwt from "jsonwebtoken";



const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  console.log(token)

  // Periksa apakah token tersedia
  if (!token) {
    return res.redirect('/login');
  }

  console.log(process.env.ACCESS_TOKEN_SECRET);

  // Verify token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
    if (err) {
      return res.status(403).json({ message: "Token akses tidak valid" });
    }

    // Set decoded user information to request object
    req.email = decoded.email;
    req.userId = decoded.userId;
    req.nim = decoded.nim;
    req.hp = decoded.hp;
    req.departemen = decoded.departemen;
    req.role = decoded.role;

    console.log("Email:", req.email);
    console.log("User ID:", req.userId);
    console.log("NIM:", req.nim);
    console.log("Nomor HP:", req.hp);
    console.log("Departemen:", req.departemen);
    next();
  });
};

export { verifyToken };