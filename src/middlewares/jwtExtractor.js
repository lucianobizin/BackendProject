// import jwt from "jsonwebtoken";

// const validateJWT = (req, res, next) => {

//     const authHeaders = req.headers.authorization;

//     if(!authHeaders) return res.status(401).send({status:"error", message:"Not logged in"});

//     const token = authHeaders.split(" ")[1];

//     try{
        
//         const userInfo = jwt.verify(token, "secretCoderPassword");

//         req.user = userInfo;
        
//         next();

//     } catch(error){

//         res.status(401).send({status:"error", message:"Token error"});
//     }


// } 

// export default validateJWT