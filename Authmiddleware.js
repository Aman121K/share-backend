const jwt = require("jsonwebtoken");
// const config = require("./config");

module.exports = (credentials = []) => {
  return (req, res, next) => {
    console.log("Authorization middleware");
    
    const token = req.headers["authorization"];
  
    if (!token) {
      return res.status(401).send("Access denied");
    } else {
      
      const tokenBody = token.slice(7);
   

      jwt.verify(tokenBody, "secret", (err, decoded) => {
        if (err) {
          console.log(`JWT Error: ${err}`);
          return res.status(401).send("Error: Access Denied");
        }
        else{
            next()
        }})
  
    }
  };
};