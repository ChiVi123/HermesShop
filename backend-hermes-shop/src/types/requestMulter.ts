export type MulterFile = Express.Multer.File;
export type MulterManyFile = Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
