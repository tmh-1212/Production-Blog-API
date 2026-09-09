// const jwt = require("jsonwebtoken");

// const User = require("../models/User");


// const protect = async (req,res,next)=>{

//     let token;


//     if(
//         req.headers.authorization &&
//         req.headers.authorization.startsWith("Bearer")
//     ){

//         try{


//             token =
//             req.headers.authorization.split(" ")[1];


//             const decoded =
//             jwt.verify(
//                 token,
//                 process.env.JWT_SECRET
//             );


//             req.user =
//             await User.findById(
//                 decoded.id
//             )
//             .select("-password");



//             if(!req.user){

//                 return res.status(401)
//                 .json({

//                     success:false,

//                     message:"User not found"

//                 });

//             }


//             next();


//         }
//        catch (error) {
//     console.log(error);

//     return res.status(401).json({
//         success: false,
//         message: error.message
//     });
// }


//     }
//     else{


//         return res.status(401)
//         .json({

//             success:false,

//             message:"No token provided"

//         });


//     }


// };



// module.exports = protect;



//updeted part 10:
const jwt = require("jsonwebtoken");
const User = require("../models/User");


const authMiddleware = async(req,res,next)=>{

    try {


        const authHeader = req.headers.authorization;


        if(!authHeader){

            return res.status(401).json({
                success:false,
                message:"No token provided"
            });

        }


        const token = authHeader.split(" ")[1];


        if(!token){

            return res.status(401).json({
                success:false,
                message:"Invalid token"
            });

        }



        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );



        const user = await User.findById(decoded.id);



        if(!user){

            return res.status(401).json({
                success:false,
                message:"User not found"
            });

        }

        if(user.status === "blocked"){

            return res.status(403).json({
                success: false,
                message: "Account is blocked"
            });

        }

        req.user = user;

        next();



    }catch(error){


        console.log(error);


        if(error.name === "TokenExpiredError"){

            return res.status(401).json({

                success:false,
                message:"Token expired"

            });

        }



        if(error.name === "JsonWebTokenError"){

            return res.status(401).json({

                success:false,
                message:"Invalid token"

            });

        }



        return res.status(500).json({

            success:false,
            message:"Authentication failed"

        });


    }

};


module.exports = authMiddleware;