import { Request, Response } from 'express';
import TransparencyModel from '../models/Transparency';
import { TransparencyDocument } from '../models/Transparency';

export const getAllTransparency = (_req: Request, res: Response): void => {
  TransparencyModel.getAll((err, sections) => {
    if (err) {
      console.error('Помилка завантаження transparency:', err);
      res.status(500).json({ error: 'Помилка сервера' });
      return;
    }

    res.json(sections || []);
  });
};

export const getTransparencyByType = (req: Request, res: Response): void => {
  const { sectionType } = req.params;

  if (!sectionType) {
    res.status(400).json({ error: 'sectionType is required' });
    return;
  }

  TransparencyModel.getByType(sectionType, (err, section) => {
    if (err) {
      console.error(`Помилка отримання transparency ${sectionType}:`, err);
      res.status(500).json({ error: 'Помилка сервера' });
      return;
    }

    if (!section) {
      res.status(404).json({ error: 'Розділ не знайдено' });
      return;
    }

    res.json(section);
  });
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

    res.json({ message: 'Розділ прозорості оновлено успішно' });
  });
};
