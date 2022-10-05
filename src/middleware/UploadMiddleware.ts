import { Request } from "express";
import multer from "multer";
import { MessageEnum } from "../enum/MessageEnum";

const excelFilter = (_req: Request, file: any, cb: any) => {
  if (
    file.mimetype.includes("excel") ||
    file.mimetype.includes("spreadsheetml")
  ) {
    cb(null, true);
  } else {
    cb({ reason: MessageEnum.UPLOAD_VALID_FILE, status: 400 }, false);
  }
};

var storage = multer.diskStorage({
  destination: (_req: Request, _file: any, cb: any) => {
    cb(null, "./src/resources/uploads/");
  },
  filename: (_req: Request, file: any, cb: any) => {
    cb(null, file.originalname);
  },
});

const UploadMiddleware = multer({ storage: storage, fileFilter: excelFilter });
export default UploadMiddleware;
