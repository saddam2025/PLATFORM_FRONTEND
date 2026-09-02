import api from './api';

const reelService = {
  list: (instructorId, page = 1, limit = 10) => (
    api.get(`/instructors/${instructorId}/reels`, { params: { page, limit } })
  ),

  upload: (instructorId, { video, caption, stage }, onProgress) => {
    const formData = new FormData();
    formData.append('video', video);
    if (caption) formData.append('caption', caption);
    if (stage) formData.append('stage', stage);

    return api.post(`/instructors/${instructorId}/reels`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      // Axios receives these values from the browser's actual XHR upload events.
      onUploadProgress: (event) => {
        if (event.total && onProgress) {
          onProgress(Math.round((event.loaded * 100) / event.total));
        }
      },
    });
  },

  trackView: (reelId) => api.patch(`/reels/${reelId}/view`),
  remove: (reelId) => api.delete(`/reels/${reelId}`),
};

export default reelService;
