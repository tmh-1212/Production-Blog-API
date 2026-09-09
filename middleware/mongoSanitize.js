const sanitize = (req, res, next) => {

    const sanitizeObject = (obj) => {

        if (!obj || typeof obj !== "object") {
            return;
        }

        for (let key in obj) {

            if (Object.prototype.hasOwnProperty.call(obj, key)) {

                if (key.includes("$") || key.includes(".")) {

                    delete obj[key];

                } else if (obj[key] !== null && typeof obj[key] === "object") {

                    sanitizeObject(obj[key]);

                }

            }

        }

    };

    if (req.body) {
        sanitizeObject(req.body);
    }

    if (req.params) {
        sanitizeObject(req.params);
    }

    if (req.query) {
        sanitizeObject(req.query);
    }

    next();

};


module.exports = sanitize;