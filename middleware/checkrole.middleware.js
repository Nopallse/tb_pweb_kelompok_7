export default function checkRole(role) {
  return function(req, res, next) {
    console.log(req.role)
      if (req.role === role) {
          next(); // Proceed to the next route if the role matches
      } else {
          res.redirect('/notfound');
      }
  };
}