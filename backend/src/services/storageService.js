const fs = require('fs');
const path = require('path');
const multer = require('multer');

let getPublicUrl = (filename) => {
  const baseUrl = process.env.ASSET_BASE_URL || `${process.env.APP_URL}/uploads`;
  return `${baseUrl}/${filename}`;
};

const tryLoad = (moduleName) => {
  try {
    return require(moduleName);
  } catch (error) {
    return null;
  }
};

const multerS3 = tryLoad('multer-s3');
const AWS = tryLoad('aws-sdk');

let storage;

if (process.env.S3_BUCKET && multerS3 && AWS) {
  const s3 = new AWS.S3({
    endpoint: process.env.S3_ENDPOINT,
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: process.env.S3_REGION || 'us-east-1',
    s3ForcePathStyle: true,
    signatureVersion: 'v4'
  });

  storage = multerS3({
    s3,
    bucket: process.env.S3_BUCKET,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (_req, file, cb) => {
      const timestamp = Date.now();
      const sanitized = file.originalname.replace(/[^a-z0-9.\-]/gi, '_').toLowerCase();
      const key = `${timestamp}_${sanitized}`;
      cb(null, key);
    }
  });

  getPublicUrl = (key) => {
    if (process.env.S3_CDN_URL) {
      return `${process.env.S3_CDN_URL}/${key}`;
    }
    const endpoint = process.env.S3_PUBLIC_ENDPOINT || process.env.S3_ENDPOINT;
    return `${endpoint}/${process.env.S3_BUCKET}/${key}`;
  };
} else {
  const uploadsDir = path.join(__dirname, '../../uploads');

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
      const timestamp = Date.now();
      const sanitized = file.originalname.replace(/[^a-z0-9.\-]/gi, '_').toLowerCase();
      cb(null, `${timestamp}_${sanitized}`);
    }
  });
}

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024
  },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/', 'video/', 'audio/'];
    if (allowed.some((prefix) => file.mimetype.startsWith(prefix))) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'));
    }
  }
});

module.exports = {
  upload,
  getPublicUrl
};
