import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Menggunakan spasi ' ' untuk membagi string
    if (!token) return res.sendStatus(401); // Menggunakan !token untuk memeriksa apakah token tidak ada
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403);
        req.email = decoded.email;
        req.userId = decoded.userId;
        req.nim = decoded.nim;
        req.hp = decoded.hp;
        req.departemen = decoded.departemen;

        next();
    });
};
