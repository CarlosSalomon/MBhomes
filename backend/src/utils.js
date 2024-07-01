import {dirname} from "path"
import { fileURLToPath } from "url"
import multer from "multer";
import Datauri from "datauri/parser.js";
import path from "path";


export const __dirname=dirname(fileURLToPath(import.meta.url))

//Multer

const storage = multer.memoryStorage();

const multerUploads = multer({
  storage,

  onError: function (err, next) {
    console.log(err);
    next();
  },
});
const dUri = new Datauri();
const dataUri = (files) => {
  return dUri.format(path.extname(files.originalname).toString(), files.buffer);
};

export { multerUploads, dataUri };
