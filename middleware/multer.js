import multer from "multer";
import path from "path";
import DataParser from "datauri/parser.js";

const parser = new DataParser();

export const formatImage = (file) => {
  const fileExtention = path.extname(file.originalname).toString();
  return parser.format(fileExtention, file.buffer).content;
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads"); // Save files to public/uploads
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`; // Unique file name
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });
export default upload;
