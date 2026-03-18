import { QueryError } from 'mysql2';
import db from '../config/database';

export interface TransparencyDocument {
  name?: string;
  url: string;
  filename?: string;
  type?: string;
  size?: number;
  uploadDate?: string;
}

export interface TransparencySection {
  id: number;
  title: string;
  content: string;
  section_type: string;
  category: string;
  documents: TransparencyDocument[];
  created_at?: Date;
  updated_at?: Date;
}

interface TransparencyRow {
  id: number;
  title: string;
  content: string;
  category: string;
  file_url: string | null;
  created_at?: Date;
  updated_at?: Date;
}

const DEFAULT_SECTIONS: Array<{ section_type: string; title: string }> = [
  { section_type: 'general-info', title: 'Загальна інформація' },
  { section_type: 'charter', title: 'Статут та установчі документи' },
  { section_type: 'budget', title: 'Бюджет та фінансова звітність' },
  { section_type: 'procurement', title: 'Публічні закупівлі' },
  { section_type: 'annual-report', title: 'Річний звіт керівника' },
  { section_type: 'vacancies', title: 'Вакантні посади' },
];

class TransparencyModel {
  private static parseDocuments(fileUrl: string | null): TransparencyDocument[] {
    if (!fileUrl) return [];

    try {
      const parsed = JSON.parse(fileUrl);
      if (Array.isArray(parsed)) {
        return parsed.filter((doc) => doc && typeof doc.url === 'string');
      }
    } catch {
      // Fallback for old single URL format.
    }

    return [{ name: 'Документ', url: fileUrl }];
  }

  private static toSection(row: TransparencyRow): TransparencySection {
    return {
      id: row.id,
      title: row.title,
      content: row.content || '',
      section_type: row.category,
      category: row.category,
      documents: this.parseDocuments(row.file_url),
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }

  static ensureDefaultSections(callback: (err: QueryError | null) => void): void {
    const query = `
      INSERT INTO transparency (title, content, category, file_url)
      SELECT ?, '', ?, NULL
      FROM DUAL
      WHERE NOT EXISTS (
        SELECT 1 FROM transparency WHERE category = ?
      )
    `;

    let completed = 0;
    let hasFailed = false;

    DEFAULT_SECTIONS.forEach((section) => {
      db.query(query, [section.title, section.section_type, section.section_type], (err) => {
        if (hasFailed) return;

        if (err) {
          hasFailed = true;
          callback(err as QueryError);
          return;
        }

        completed += 1;
        if (completed === DEFAULT_SECTIONS.length) {
          callback(null);
        }
      });
    });
  }

  static getAll(callback: (err: QueryError | null, rows: TransparencySection[] | null) => void): void {
    this.ensureDefaultSections((ensureErr) => {
      if (ensureErr) {
        callback(ensureErr, null);
        return;
      }

      const query = 'SELECT * FROM transparency ORDER BY id ASC';
      db.query(query, (err, results: any) => {
        if (err) {
          callback(err as QueryError, null);
          return;
        }

        const mapped = ((results || []) as TransparencyRow[]).map((row) => this.toSection(row));
        callback(null, mapped);
      });
    });
  }

  static getByType(
    sectionType: string,
    callback: (err: QueryError | null, section: TransparencySection | null) => void
  ): void {
    const query = 'SELECT * FROM transparency WHERE category = ? LIMIT 1';
    db.query(query, [sectionType], (err, results: any) => {
      if (err) {
        callback(err as QueryError, null);
        return;
      }

      const row = (results?.[0] || null) as TransparencyRow | null;
      callback(null, row ? this.toSection(row) : null);
    });
  }

  static upsertByType(
    sectionType: string,
    payload: { title?: string; content?: string; documents?: TransparencyDocument[] },
    callback: (err: QueryError | null, result: any) => void
  ): void {
    const title = payload.title?.trim() || 'Розділ прозорості';
    const content = typeof payload.content === 'string' ? payload.content : '';
    const documents = Array.isArray(payload.documents) ? payload.documents : [];
    const fileUrl = documents.length ? JSON.stringify(documents) : null;

    const selectQuery = 'SELECT id FROM transparency WHERE category = ? LIMIT 1';
    db.query(selectQuery, [sectionType], (selectErr, rows: any) => {
      if (selectErr) {
        callback(selectErr as QueryError, null);
        return;
      }

      if (rows?.length) {
        const updateQuery = 'UPDATE transparency SET title = ?, content = ?, file_url = ? WHERE category = ?';
        db.query(updateQuery, [title, content, fileUrl, sectionType], (updateErr, updateResult: any) => {
          callback(updateErr as QueryError | null, updateResult);
        });
        return;
      }

      const insertQuery = 'INSERT INTO transparency (title, content, category, file_url) VALUES (?, ?, ?, ?)';
      db.query(insertQuery, [title, content, sectionType, fileUrl], (insertErr, insertResult: any) => {
        callback(insertErr as QueryError | null, insertResult);
      });
    });
  }
}

export default TransparencyModel;
