const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Storage configuration
const storage = multer.diskStorage({
    destination(req, file, cb) {
        let dest = "uploads";

        // Route files to appropriate destination folder based on field name or route context
        if (file.fieldname === "avatar" || (req.baseUrl && req.baseUrl.includes("users"))) {
            dest = "uploads/avatars";
        } else if (file.fieldname === "image" || (req.baseUrl && req.baseUrl.includes("posts"))) {
            dest = "uploads/posts";
        }

        // Ensure target directory exists
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }

        cb(null, dest);
    },

    filename(req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});

// File filter for images
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/gif",
        "image/webp"
    ];

    if (file.mimetype && (file.mimetype.startsWith("image/") || allowedTypes.includes(file.mimetype))) {
        cb(null, true);
    } else {
        const error = new Error("Only images are allowed");
        error.statusCode = 400;
        cb(error, false);
    }
};

// File size limit (2MB)
const limits = {
    fileSize: process.env.MAX_FILE_SIZE
        ? parseInt(process.env.MAX_FILE_SIZE, 10)
        : 2 * 1024 * 1024
};

const upload = multer({
    storage,
    fileFilter,
    limits
});

module.exports = upload;