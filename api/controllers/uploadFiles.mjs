import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = 'uploads/others'; 

    // Check fieldname to determine folder
    if (file.fieldname === 'licenseFile') {
      folder = 'uploads/licenses';
    } else if (file.fieldname === 'rc_file') {
      folder = 'uploads/rcs';
    }

    // Ensure the folder exists
    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Handler function for file upload
const handleFileUpload = (req, res) => {
  try {
    console.log('Received file upload request');
    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).send({ message: 'Please upload a file.' });
    }
    console.log('File uploaded successfully', req.file);
    res.status(200).send({
      message: 'File uploaded successfully',
      file: req.file
    });
  } catch (error) {
    console.error('Error occurred during file upload:', error);
    res.status(500).send({
      message: 'An error occurred while uploading the file',
      error: error.message
    });
  }
};

export { upload, handleFileUpload };
