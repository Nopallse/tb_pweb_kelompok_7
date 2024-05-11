import jwt from 'jsonwebtoken';
import Users from "../models/UserModel.js";
import bcrypt from "bcrypt"

export const getUsers = async (req,res)=> {
    try {
        const users = await Users.findAll({
            attributes:['id','name','email','role','nim','hp','departemen']
        })
        res.json(users)
    } catch (error) {
        console.log(error)
    }
}


export const Register = async(req, res)=>{
    const {name, email, password,nim,hp,departemen }= req.body;
    const salt = await bcrypt.genSalt();
    const hashPassord = await bcrypt.hash(password, salt)
    try{
        await Users.create({
            name: name,
            email: email,
            password: hashPassord
        });
        res.json({msg: "Register berhasil"})
    } catch(error) {
        console.log(error)
    }
}


export const Login = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      throw new Error("Email tidak ditemukan");
    }

    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) {
      throw new Error("Password salah");
    }

    const userId = user.id;
    const name = user.name;
    const email = user.email;
    const role = user.role;
    const nim = user.nim;
    const hp = user.hp;
    const departemen = user.departemen;





    const accessToken = jwt.sign({ userId, name, email,role,nim,hp,departemen }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "10s",
    });
    const refreshToken = jwt.sign({ userId, name, email,role,nim,hp,departemen }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "15m",
    });

    await Users.update(
      {
        refresh_token: refreshToken,
      },
      {
        where: {
          id: userId,
        },
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      // secure:true
    });

    if (req.session) {
      req.session.user = {
        userId: userId,
        name: name,
        email: email,
        role: role,
        nim: nim,
        hp: hp,
        departemen:departemen        
      };
    } else {
      console.error('Sesi belum diinisialisasi');
    }

    if (user.role === "mahasiswa") {
      return res.redirect("/home");
    } else if (user.role === "admin") {
      return res.redirect("/admin/dashboard");
    }

    res.redirect("/admin/dashboard");
    console.log(user.role)
    
  } catch (error) {
    console.log(error);
    res.status(401).send(error.message);
  }
};










export const Logout = async(req,res)=>{
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);
    console.log('Refresh Token:', refreshToken);

    const user = await Users.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!user[0]) { 
        console.log('User tidak ditemukan dengan refresh token tersebut.'); 
        return res.sendStatus(204);
    }

    const userId = user[0].id;
    await Users.update({refresh_token:null},{
        where: {
            id: userId
        }
    })
    res.clearCookie('refreshToken')
    return res.sendStatus(200)
}



export function checkUserLoggedIn(req) {
    const refreshToken = req.cookies.refreshToken;
    let user = null;
    let userLoggedIn = false;

    if (refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            userLoggedIn = true;
            user = {
                userId: decoded.userId,
                name: decoded.name,
                email: decoded.email,
                role: decoded.role,
                nim: decoded.nim,
                hp: decoded.hp,
                departemen:decoded.departemen

            };
        } catch (error) {
            console.error('Token invalid or expired:', error.message);
        }
    }

    return { userLoggedIn, user };
}

