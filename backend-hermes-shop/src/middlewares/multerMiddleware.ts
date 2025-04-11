import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { StatusCodes } from '~/configs/statusCode';
import { ALLOW_COMMON_FILE_TYPES, ALLOW_COMMON_FILE_TYPES_MESSAGE, LIMIT_COMMON_FILE_SIZE } from '~/configs/validates';
import NextError from '~/helpers/nextError';

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (typeof req.body === 'object' && Object.values(req.body).length === 0) req.body = undefined;

  if (ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) return cb(null, true);
  return cb(new NextError(StatusCodes.UNPROCESSABLE_ENTITY, ALLOW_COMMON_FILE_TYPES_MESSAGE));
};
const upload = multer({
  limits: { fileSize: LIMIT_COMMON_FILE_SIZE },
  fileFilter,
});

export const multerMiddleware = { upload };
