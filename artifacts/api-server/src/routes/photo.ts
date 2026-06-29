import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router: IRouter = Router();

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if ((req.session as { isAdmin?: boolean }).isAdmin !== true) {
    res.status(401).json({ error: "Non autorisé" });
    return;
  }
  next();
}

const photoStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dest = path.join(process.cwd(), "..", "portfolio-salma", "public");
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (_req, _file, cb) => {
    cb(null, "photo-salma.jpg");
  },
});

const photoUpload = multer({
  storage: photoStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Seules les images sont acceptées"));
    }
  },
});

router.post(
  "/photo",
  requireAdmin,
  photoUpload.single("photo"),
  (req: Request, res: Response): void => {
    if (!req.file) {
      res.status(400).json({ error: "Aucun fichier reçu" });
      return;
    }
    res.json({ ok: true, message: "Photo mise à jour avec succès" });
  },
);

export default router;
