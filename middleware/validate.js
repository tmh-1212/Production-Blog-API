// const validate =
// (schema)=>{


// return(req,res,next)=>{


// const result =
// schema.validate(
// req.body
// );



// if(result.error){

// return res.status(400)
// .json({

// success:false,

// message:
// result.error.details[0].message

// });

// }


// next();


// };


// };


// module.exports =
// validate;



//practice for each part
    //part 8:
const validate = (schema) => {
    return (req, res, next) => {

        // console.log("Validation middleware running...");
        // console.log(req.body);

        const { error } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            console.log(error.details);

            return res.status(400).json({
                success: false,
                errors: error.details.map(err => ({
                    field: err.path[0],
                    message: err.message
                }))
            });
        }

        next();
    };
};

module.exports = validate;