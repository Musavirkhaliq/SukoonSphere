// import multer from "multer"
// import DataParser from "datauri/parser.js"
// import path from "path"
// const storage =multer.memoryStorage()
// const upload = multer({storage})
// const parser = new DataParser()
// export default upload

import multer from "multer";
import path from "path";
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
