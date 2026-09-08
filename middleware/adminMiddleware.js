// const adminOnly =
// (req,res,next)=>{


//     if(
//         req.user.role !== "admin"
//     ){

//         return res.status(403)
//         .json({

//             success:false,

//             message:
//             "Admin access required"

//         });

//     }


//     next();


// };


// module.exports = adminOnly;

 
//updeted admin middleware

const adminMiddleware = (req,res,next)=>{


    if(!req.user){

        return res.status(401).json({

            success:false,

            message:"Unauthorized"

        });

    }


    if(req.user.role !== "admin"){

        return res.status(403).json({

            success:false,

            message:"Access denied. Admin only"

        });

    }


    next();


};


module.exports = adminMiddleware;