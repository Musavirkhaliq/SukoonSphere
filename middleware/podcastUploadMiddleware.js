import multer from 'multer';
import path from 'path';

// Configure storage for images and audio
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'image') {
      cb(null, 'public/podcasts/images');
    } else if (file.fieldname === 'audio') {
      cb(null, 'public/podcasts/episodes');
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'image') {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Please upload only image files.'), false);
    }
  } else if (file.fieldname === 'audio') {
    if (!file.mimetype.startsWith('audio/')) {
      return cb(new Error('Please upload only audio files.'), false);
    }
  }
  cb(null, true);
};

// Create multer upload instance
export const uploadPodcastFiles = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: file => {
      if (file.fieldname === 'image') return 5 * 1024 * 1024; // 5MB for images
      return 50 * 1024 * 1024; // 50MB for audio
    }
  }
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'audio', maxCount: 1 }
]);
