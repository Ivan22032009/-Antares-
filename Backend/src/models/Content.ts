import db from '../config/database';
import { Content } from '../types';
import { QueryError } from 'mysql2';

class ContentModel {
  static getContent(
    page_name: string,
    callback: (err: QueryError | null, result: Content | undefined) => void
  ): void {
    console.log('DB Query: Getting content for', page_name);
    const query = 'SELECT id, title, slug, body AS content, author_id, published, created_at, updated_at FROM content WHERE slug = ?';
    db.query(query, [page_name], (err, results: any) => {
      if (err) {
        console.error('❌ Database error in getContent:', err);
        return callback(err, undefined);
      }
      callback(null, results?.[0] as Content | undefined);
    });
  }

  static saveContent(
    page_name: string,
    content: string,
    callback: (err: QueryError | null, result: any) => void
  ): void {
    console.log('DB Query: Saving content for', page_name);
    const query = 'INSERT INTO content (title, slug, body) VALUES (?, ?, ?)';
    db.query(query, [page_name, page_name, content], (err, result: any) => {
      if (err) {
        console.error('❌ Database error in saveContent:', err);
        return callback(err, null);
      }
      callback(null, result);
    });
  }

  static updateContent(
    page_name: string,
    content: string,
    callback: (err: QueryError | null, result: any) => void
  ): void {
    console.log('DB Query: Updating content for', page_name);
    const query = 'UPDATE content SET body = ? WHERE slug = ?';
    db.query(query, [content, page_name], (err, result: any) => {
      if (err) {
        console.error('❌ Database error in updateContent:', err);
        return callback(err, null);
      }
      callback(null, result);
    });
  }
}

export default ContentModel;
