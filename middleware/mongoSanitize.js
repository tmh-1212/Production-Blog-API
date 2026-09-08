const sanitize = (req, res, next) => {

    const sanitizeObject = (obj) => {

        for (let key in obj) {

            if (key.includes("$") || key.includes(".")) {

                delete obj[key];

            } 
            else if (typeof obj[key] === "object") {

                sanitizeObject(obj[key]);

            }

        }

    };


    sanitizeObject(req.body);

    sanitizeObject(req.params);

    next();

};


module.exports = sanitize;