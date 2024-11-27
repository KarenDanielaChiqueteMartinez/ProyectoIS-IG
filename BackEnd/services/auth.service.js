const jwt = require("jsonwebtoken"); 



function generateAuthToken(email){
    const token = jwt.sign({email}, process.env.SECRET_KEY || "random1234", {
        expiresIn: "1d"
    }); 

    return token; 
}

exports.module = generateAuthToken;  