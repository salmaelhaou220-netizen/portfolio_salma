import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { eq, asc } from "drizzle-orm";
import { db, documentsTable, insertDocumentSchema } from "@workspace/db";

const router: IRouter = Router();

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if ((req.session as { isAdmin?: boolean }).isAdmin !== true) {
    res.status(401).json({ error: "Non autorisé" });
    return;
  }
  next();
}

router.get("/documents", async (req, res): Promise<void> => {
  const docs = await db
    .select()
    .from(documentsTable)
    .orderBy(asc(documentsTable.category), asc(documentsTable.createdAt));
  res.json(docs);
});

router.post("/documents", requireAdmin, async (req, res): Promise<void> => {
  const parsed = insertDocumentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [doc] = await db.insert(documentsTable).values(parsed.data).returning();
  req.log.info({ id: doc.id }, "Document created");
  res.status(201).json(doc);
});

router.patch("/documents/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "ID invalide" });
    return;
  }

  const partial = insertDocumentSchema.partial().safeParse(req.body);
  if (!partial.success) {
    res.status(400).json({ error: partial.error.message });
    return;
  }

  const [doc] = await db
    .update(documentsTable)
    .set(partial.data)
    .where(eq(documentsTable.id, id))
    .returning();

  if (!doc) {
    res.status(404).json({ error: "Document introuvable" });
    return;
  }

  res.json(doc);
});

router.delete("/documents/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "ID invalide" });
    return;
  }

  const [doc] = await db
    .delete(documentsTable)
    .where(eq(documentsTable.id, id))
    .returning();

  if (!doc) {
    res.status(404).json({ error: "Document introuvable" });
    return;
  }

  res.sendStatus(204);
});

export default router;
