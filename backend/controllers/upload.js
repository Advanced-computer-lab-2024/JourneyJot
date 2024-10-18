/** @format */

const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '../images'));
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '-' + file.originalname);
	},
});
const upload = multer({ storage });
const uploadImages = async (req, res, next) => {
	try {
		return res.status(200).send( req.file );
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: 'Error uploading file' });
	}
};

module.exports = { upload, uploadImages };
