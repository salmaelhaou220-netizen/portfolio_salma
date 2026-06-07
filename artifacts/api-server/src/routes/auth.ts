import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.post("/auth/login", async (req, res): Promise<void> => {
  const { password } = req.body as { password?: string };
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    req.log.error("ADMIN_PASSWORD env var not set");
    res.status(500).json({ error: "Server misconfiguration" });
    return;
  }

  if (!password || password !== adminPassword) {
    res.status(401).json({ error: "Mot de passe incorrect" });
    return;
  }

  (req.session as { isAdmin?: boolean }).isAdmin = true;
  res.json({ ok: true });
});

router.post("/auth/logout", async (req, res): Promise<void> => {
  req.session.destroy(() => {
    res.clearCookie("portfolio.sid");
    res.json({ ok: true });
  });
});

router.get("/auth/me", async (req, res): Promise<void> => {
  const isAdmin = (req.session as { isAdmin?: boolean }).isAdmin === true;
  res.json({ isAdmin });
});

export default router;
