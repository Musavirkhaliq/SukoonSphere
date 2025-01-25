import multer from "multer";
import path from "path";

const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/articles"); // Save PDFs in /pdfs
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const uploadPDF = multer({
  storage: pdfStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed!"));
    }
  },
});

export default uploadPDF;
