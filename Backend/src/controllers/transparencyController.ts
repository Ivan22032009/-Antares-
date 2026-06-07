import { Request, Response } from 'express';
import TransparencyModel from '../models/Transparency';
import { cacheGet, cacheSet, cacheDel } from '../utils/cache';
import { TransparencyDocument } from '../models/Transparency';

export const getAllTransparency = (_req: Request, res: Response): void => {
  TransparencyModel.getAll(async (err, sections) => {
    if (err) {
      console.error('Помилка завантаження transparency:', err);
      res.status(500).json({ error: 'Помилка сервера' });
      return;
    }

    await cacheSet('transparency:all', sections || [], 120);
    res.json(sections || []);
  });
};

export const getTransparencyByType = (req: Request, res: Response): void => {
  const { sectionType } = req.params;

  if (!sectionType) {
    res.status(400).json({ error: 'sectionType is required' });
    return;
  }

  (async () => {
    const cacheKey = `transparency:type:${sectionType}`;
    const cached = await cacheGet(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    TransparencyModel.getByType(sectionType, async (err, section) => {
      if (err) {
        console.error(`Помилка отримання transparency ${sectionType}:`, err);
        res.status(500).json({ error: 'Помилка сервера' });
        return;
      }

      if (!section) {
        res.status(404).json({ error: 'Розділ не знайдено' });
        return;
      }

      await cacheSet(cacheKey, section, 300);
      res.json(section);
    });
  })();
};

export const updateTransparencyByType = (req: Request, res: Response): void => {
  const { sectionType } = req.params;
  const { title, content, documents } = req.body as {
    title?: string;
    content?: string;
    documents?: Array<Record<string, any>>;
  };
  const safeDocuments: TransparencyDocument[] | undefined = Array.isArray(documents)
    ? documents
        .filter((doc) => doc && typeof doc.url === 'string')
        .map((doc) => ({
          name: typeof doc.name === 'string' ? doc.name : undefined,
          url: String(doc.url),
          filename: typeof doc.filename === 'string' ? doc.filename : undefined,
          type: typeof doc.type === 'string' ? doc.type : undefined,
          size: typeof doc.size === 'number' ? doc.size : undefined,
          uploadDate: typeof doc.uploadDate === 'string' ? doc.uploadDate : undefined,
        }))
    : undefined;

  if (!sectionType) {
    res.status(400).json({ error: 'sectionType is required' });
    return;
  }

  TransparencyModel.upsertByType(sectionType, { title, content, documents: safeDocuments }, (err) => {
    if (err) {
      console.error(`Помилка оновлення transparency ${sectionType}:`, err);
      res.status(500).json({ error: 'Помилка сервера' });
      return;
    }
    cacheDel(`transparency:type:${sectionType}`)
      .catch(() => {})
      .finally(() => {
        res.json({ message: 'Розділ прозорості оновлено успішно' });
      });
  });
};
