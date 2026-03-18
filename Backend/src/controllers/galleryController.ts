import { Request, Response } from 'express';
import GalleryModel from '../models/Gallery';
import { GalleryImage } from '../types';

export const getAllImages = async (_req: Request, res: Response): Promise<void> => {
  try {
    GalleryModel.getAll((err, results) => {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: err.message });
        return;
      }

      res.json({ images: results || [] });
    });
  } catch (error: any) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

export const getImageById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isFinite(id)) {
      res.status(400).json({ error: 'Invalid image id' });
      return;
    }

    GalleryModel.getById(id, (err, result) => {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: err.message });
        return;
      }

      if (!result) {
        res.status(404).json({ error: 'Image not found' });
        return;
      }

      res.json(result);
    });
  } catch (error: any) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

export const createImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, image_url, category } = req.body as Partial<GalleryImage>;

    if (!title || !image_url) {
      res.status(400).json({ error: 'Title and image_url are required' });
      return;
    }

    GalleryModel.create({ title, description, image_url, category }, (err, result: any) => {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: err.message });
        return;
      }

      res.status(201).json({
        message: 'Image added to gallery successfully',
        id: result?.insertId,
      });
    });
  } catch (error: any) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

export const updateImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isFinite(id)) {
      res.status(400).json({ error: 'Invalid image id' });
      return;
    }

    const { title, description, image_url, category, is_published } = req.body as Partial<GalleryImage>;

    GalleryModel.update(id, { title, description, image_url, category, is_published }, (err, result: any) => {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: err.message });
        return;
      }

      if (!result || result.affectedRows === 0) {
        res.status(404).json({ error: 'Image not found' });
        return;
      }

      res.json({ message: 'Image updated successfully' });
    });
  } catch (error: any) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

export const deleteImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isFinite(id)) {
      res.status(400).json({ error: 'Invalid image id' });
      return;
    }

    GalleryModel.delete(id, (err, result: any) => {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: err.message });
        return;
      }

      if (!result || result.affectedRows === 0) {
        res.status(404).json({ error: 'Image not found' });
        return;
      }

      res.json({ message: 'Image deleted successfully' });
    });
  } catch (error: any) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};
