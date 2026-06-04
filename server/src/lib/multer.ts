import multer from "multer";
import path from "path";
import fs from "fs";

const DEFAULT_MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const RESUME_MIME_TYPES = ["application/pdf"];
const RESUME_MAX_FILE_SIZE = 10 * 1024 * 1024;

const upload = (location: string, mimetypes: string[] = ALLOWED_MIME_TYPES, maxFileSize: number = DEFAULT_MAX_FILE_SIZE) => {
    const baseDir = "uploads";
    const targetDir = path.join(baseDir, location);

    if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir);
    }

    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    return multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, targetDir);
            },
            filename: (req, file, cb) => {
                const ext = path.extname(file.originalname);
                const uniqueName =
                    Date.now() + "-" + Math.random().toString(36).substring(2);

                cb(null, uniqueName + ext);
            }
        }),
        limits: { fileSize: maxFileSize },
        fileFilter: (req, file, cb) => {
            if (mimetypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error(`File type "${file.mimetype}" is not allowed. Allowed types: ${mimetypes.join(", ")}`));
            }
        },
    });
};

export const uploadResume = upload("resumes", RESUME_MIME_TYPES, RESUME_MAX_FILE_SIZE);
export const uploadAvatar = upload("avatars");

export default upload;