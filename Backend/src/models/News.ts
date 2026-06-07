import db from '../config/database';
import { News, NewsCreateData } from '../types';
import { QueryError } from 'mysql2';

class NewsModel {
  static getAll(callback: (err: QueryError | null, results: News[] | null) => void): void {
    // Default to first page with large limit for backward compatibility
    this.getPaginated(1, 1000, callback);
  }

  static getPaginated(
    page: number,
    limit: number,
    callback: (err: QueryError | null, results: News[] | null) => void
  ): void {
    const offset = Math.max(0, (page - 1) * limit);
    const query = `
      SELECT
        n.id,
        n.title,
        SUBSTRING(n.content, 1, 220) AS shortDescription,
        n.content AS fullContent,
        n.image_url AS image,
        COALESCE(u.username, 'Адміністрація') AS author,
        (n.status = 'published') AS isPublished,
        n.created_at AS publishDate,
        0 AS views
      FROM news n
      LEFT JOIN users u ON u.id = n.author_id
      WHERE n.status = 'published'
      ORDER BY n.created_at DESC
      LIMIT ? OFFSET ?
    `;
    console.log('Executing SQL (paginated):', query, 'params:', [limit, offset]);
    db.query(query, [limit, offset], (err, results: any) => {
      if (err) {
        console.error('SQL Error:', err);
        return callback(err, null);
      }
      callback(null, results as News[]);
    });
  }

  static getById(id: number, callback: (err: QueryError | null, result: News | undefined) => void): void {
    const query = `
      SELECT
        n.id,
        n.title,
        SUBSTRING(n.content, 1, 220) AS shortDescription,
        n.content AS fullContent,
        n.image_url AS image,
        COALESCE(u.username, 'Адміністрація') AS author,
        (n.status = 'published') AS isPublished,
        n.created_at AS publishDate,
        0 AS views
      FROM news n
      LEFT JOIN users u ON u.id = n.author_id
      WHERE n.id = ?
      LIMIT 1
    `;
    console.log('Executing SQL:', query, 'with id:', id);
    db.query(query, [id], (err, results: any) => {
      if (err) {
        console.error('SQL Error:', err);
        return callback(err, undefined);
      }
      console.log('SQL Results:', results);
      callback(null, results?.[0] as News | undefined);
    });
  }

  static create(
    newsData: NewsCreateData & { isPublished?: boolean; authorId?: number },
    callback: (err: QueryError | null, result: any) => void
  ): void {
    const { title, shortDescription, fullContent, image, isPublished, authorId } = newsData;
    const query = `
      INSERT INTO news (title, content, author_id, status, image_url)
      VALUES (?, ?, ?, ?, ?)
    `;
    const content = fullContent || shortDescription;
    const status = isPublished === false ? 'draft' : 'published';
    console.log('Executing SQL:', query, 'with data:', [title, content, authorId || 1, status, image || null]);

    db.query(
      query,
      [title, content, authorId || 1, status, image || null],
      (err, result: any) => {
        if (err) {
          console.error('SQL Error:', err);
          return callback(err, null);
        }
        console.log('SQL Results - Insert ID:', result.insertId);
        callback(null, result);
      }
    );
  }

  static update(
    id: number,
    newsData: Partial<News> & { authorId?: number },
    callback: (err: QueryError | null, result: any) => void
  ): void {
    const { title, shortDescription, fullContent, image, isPublished, authorId } = newsData;
    const content = fullContent || shortDescription;
    const status = isPublished === false ? 'draft' : 'published';
    const query = `
      UPDATE news 
      SET title = ?, content = ?, image_url = ?, status = ?, author_id = IFNULL(?, author_id)
      WHERE id = ?
    `;
    console.log('Executing SQL:', query);

    db.query(
      query,
      [title, content, image || null, status, authorId ?? null, id],
      (err, result: any) => {
        if (err) {
          console.error('SQL Error:', err);
          return callback(err, null);
        }
        console.log('SQL Results - Affected rows:', result.affectedRows);
        callback(null, result);
      }
    );
  }

  static delete(id: number, callback: (err: QueryError | null, result: any) => void): void {
    const query = 'DELETE FROM news WHERE id = ?';
    console.log('Executing SQL:', query, 'with id:', id);

    db.query(query, [id], (err, result: any) => {
      if (err) {
        console.error('SQL Error:', err);
        return callback(err, null);
      }
      console.log('SQL Results - Affected rows:', result.affectedRows);
      callback(null, result);
    });
  }

  static incrementViews(_id: number, callback: (err: QueryError | null, result: any) => void): void {
    // Legacy schema has no views column. Keep method for API compatibility.
    callback(null, { affectedRows: 0 });
  }

  static getAllForAdmin(callback: (err: QueryError | null, results: News[] | null) => void): void {
    const query = `
      SELECT
        n.id,
        n.title,
        SUBSTRING(n.content, 1, 220) AS shortDescription,
        n.content AS fullContent,
        n.image_url AS image,
        COALESCE(u.username, 'Адміністрація') AS author,
        (n.status = 'published') AS isPublished,
        n.created_at AS publishDate,
        0 AS views
      FROM news n
      LEFT JOIN users u ON u.id = n.author_id
      ORDER BY n.created_at DESC
    `;
    db.query(query, (err, results: any) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results as News[]);
    });
  }
}

export default NewsModel;
