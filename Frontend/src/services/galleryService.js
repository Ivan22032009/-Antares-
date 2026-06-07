import api from './api';

const galleryService = {
  // Отримати всі фото галереї
  getGalleryImages: async () => {
    try {
      console.log('🔧 Making GET request to /gallery');
      const response = await api.get('/gallery');
      console.log('🔧 GET /gallery response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Помилка отримання фото:', error);
      return { images: [] };
    }
  },

  // Завантажити нове фото в R2
  uploadGalleryImage: async (formData) => {
    try {
      console.log('🔧 Starting backend upload process...');
      const file = formData.get('file') || formData.get('image');
      if (!file) throw new Error('No file provided');

      const originalName = file.name || 'upload';
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);
      uploadFormData.append('category', formData.get('category') || 'general');

      const uploadResponse = await api.post('/upload', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const imageData = {
        title: formData.get('title'),
        description: formData.get('description'),
        image_url: uploadResponse.data.url,
        category: formData.get('category'),
        filename: uploadResponse.data.filename,
      };

      const galleryResponse = await api.post('/gallery', imageData);
      return galleryResponse.data;
    } catch (error) {
      console.error('❌ Помилка завантаження через backend:', error);
      throw error;
    }
  },

  // Створити фото через посилання
  createGalleryImage: async (imageData) => {
    try {
      console.log('🔧 Creating gallery image from URL:', imageData);
      const response = await api.post('/gallery', imageData);
      console.log('🔧 Gallery creation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Помилка створення фото з посилання:', error);
      throw error;
    }
  },

  // Видалити фото (з R2 та з бази)
  deleteGalleryImage: async (imageId, filename = null) => {
    try {
      // Спочатку видаляємо з бази
      const response = await api.delete(`/gallery/${imageId}`);
      
      // Якщо є filename, видаляємо файл з R2
      if (filename) {
        try {
          await api.delete(`/upload/${filename}`);
          console.log('✅ File deleted from R2:', filename);
        } catch (r2Error) {
          console.error('❌ Error deleting from R2:', r2Error);
          // Продовжуємо, навіть якщо не вдалося видалити з R2
        }
      }
      
      return response.data;
    } catch (error) {
      console.error('Помилка видалення фото:', error);
      throw error;
    }
  }
};

export default galleryService;