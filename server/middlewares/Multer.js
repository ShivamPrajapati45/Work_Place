import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/temp')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const storageGigs = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

export const upload = multer({ storage })
export const uploadGigs = multer({ storage: storageGigs });