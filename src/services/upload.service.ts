import api from './api';

/**
 * Upload a single image file to the server
 * @param file The file to upload
 * @param type The type of file (for metadata purposes)
 * @returns Promise resolving to the URL of the uploaded file
 */
export const uploadFile = async (file: File, type: string): Promise<string> => {
  // Create a FormData object to send the file
  const formData = new FormData();
  formData.append('image', file);
  formData.append('type', type);
  
  // Use multipart/form-data for file uploads
  const response = await api.post<{file: {url: string}}>('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data.file.url;
};

/**
 * Upload multiple image files to the server (max 5)
 * @param files Array of files to upload
 * @param type The type of files (for metadata purposes)
 * @returns Promise resolving to an array of URLs of the uploaded files
 */
export const uploadMultipleFiles = async (files: File[], type: string): Promise<string[]> => {
  // Create a FormData object to send multiple files
  const formData = new FormData();
  
  // Append each file with the same field name 'images'
  files.forEach((file) => {
    formData.append('images', file);
  });
  
  formData.append('type', type);
  
  // Use multipart/form-data for file uploads
  const response = await api.post<{files: {url: string}[]}>('/upload/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data.files.map(file => file.url);
};

const uploadService = {
  uploadFile,
  uploadMultipleFiles
};

export default uploadService; 