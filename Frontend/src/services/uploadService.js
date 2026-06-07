import api from './api';

const uploadService = {
  presign: async (filename, contentType) => {
    const res = await api.post('/upload/presign', { filename, contentType });
    return res.data;
  },

  uploadToUrl: async (url, file, contentType) => {
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': contentType },
      body: file,
    });
    if (!res.ok) throw new Error('Direct upload failed');
    return res;
  },

  notifyComplete: async (filename, originalName) => {
    const res = await api.post('/upload/complete', { filename, originalName });
    return res.data;
  }
};

export default uploadService;
