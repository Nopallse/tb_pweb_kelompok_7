const jwt = require('jsonwebtoken');


const isUserLoggedIn = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      if (decoded) {
        
        return res.redirect('/');
      }
    } catch (error) {
      console.error('Error verifying token:', error.message);
      
      res.clearCookie('refreshToken');
    }
  }

  
  next();
};




module.exports = { isUserLoggedIn };
