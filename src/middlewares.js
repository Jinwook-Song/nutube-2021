import multer from 'multer';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';

const s3Client = new S3Client({
  region: 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const createS3Storage = (type) => {
  const folder = type === 'avatar' ? 'avatars' : 'videos';
  return multerS3({
    s3: s3Client,
    bucket: process.env.AWS_BUCKET,
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const ext = file.originalname.split('.').reverse()[0];
      cb(null, `${folder}/${req.session.user._id}/${Date.now().toString()}`);
    },
  });
};

const awsStorages = {
  avatar: createS3Storage('avatar'),
  video: createS3Storage('video'),
};

export const localsMiddleware = (req, res, next) => {
  // pug can access to locals object
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = 'Wetube';
  res.locals.loggedInUser = req.session.user || {};
  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    req.flash('error', 'Log in first.');
    return res.redirect('/login');
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash('error', 'Not authorized');
    return res.redirect('/');
  }
};

export const avatarUpload = multer({
  limits: {
    fileSize: 3000000, // 3MB
  },
  storage: awsStorages.avatar,
});

export const videoUpload = multer({
  limits: {
    fileSize: 15000000, // 15MB
  },
  storage: awsStorages.video,
});
