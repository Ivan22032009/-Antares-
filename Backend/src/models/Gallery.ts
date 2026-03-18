import db from '../config/database';
import { GalleryImage } from '../types';
import { QueryError } from 'mysql2';

class GalleryModel {
  static getAll(callback: (err: QueryError | null, results: GalleryImage[] | null) => void): void {
    const query = `
      SELECT
        id,
        title,
        description,
        image_url,
        category,
        1 AS is_published,
        created_at
      FROM gallery
      ORDER BY created_at DESC
    `;
    db.query(query, (err, results: any) => {
      if (err) {
        console.error('❌ Database error in getAll:', err);
        return callback(err, null);
      }
      callback(null, results as GalleryImage[]);
    });
  }

  static getById(id: number, callback: (err: QueryError | null, result: GalleryImage | undefined) => void): void {
    const query = `
      SELECT
        id,
        title,
        description,
        image_url,
        category,
        1 AS is_published,
        created_at
      FROM gallery
      WHERE id = ?
      LIMIT 1
    `;
    db.query(query, [id], (err, results: any) => {
      if (err) {
        console.error('❌ Database error in getById:', err);
        return callback(err, undefined);
      }
      callback(null, results?.[0] as GalleryImage | undefined);
    });
  }

  static create(
    data: {
      title: string;
      description?: string;
      image_url: string;
      category?: string;
    },
    callback: (err: QueryError | null, result: any) => void
  ): void {
    const { title, description, image_url, category } = data;
    const query = 'INSERT INTO gallery (title, description, image_url, category) VALUES (?, ?, ?, ?)';
    db.query(
      query,
      [title, description || '', image_url, category || 'general'],
      (err, result: any) => {
        if (err) {
          console.error('❌ Database error in create:', err);
          return callback(err, null);
        }
        callback(null, result);
      }
    );
  }

  static update(
    id: number,
    data: {
      title?: string;
      description?: string;
      image_url?: string;
      category?: string;
      is_published?: boolean;
    },
    callback: (err: QueryError | null, result: any) => void
  ): void {
    const { title, description, image_url, category } = data;
    const query = 'UPDATE gallery SET title = ?, description = ?, image_url = ?, category = ? WHERE id = ?';
    db.query(query, [title, description, image_url, category, id], (err, result: any) => {
      if (err) {
        console.error('❌ Database error in update:', err);
        return callback(err, null);
      }
      callback(null, result);
    });
  }

  static delete(id: number, callback: (err: QueryError | null, result: any) => void): void {
    const query = 'DELETE FROM gallery WHERE id = ?';
    db.query(query, [id], (err, result: any) => {
      if (err) {
        console.error('❌ Database error in delete:', err);
        return callback(err, null);
      }
      callback(null, result);
    });
  }

  static getAllForAdmin(callback: (err: QueryError | null, results: GalleryImage[] | null) => void): void {
    const query = 'SELECT * FROM gallery ORDER BY created_at DESC';
    db.query(query, (err, results: any) => {
      if (err) {
        console.error('❌ Database error in getAllForAdmin:', err);
        return callback(err, null);
      }
      callback(null, results as GalleryImage[]);
    });
  }
}

export default GalleryModel;
