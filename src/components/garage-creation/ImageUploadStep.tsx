import React, { useRef } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploadStepProps {
  formData: {
    logo: File | null;
    coverImage: File | null;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const ImageUploadStep: React.FC<ImageUploadStepProps> = ({ formData, setFormData }) => {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'coverImage') => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev: any) => ({
        ...prev,
        [type]: file
      }));
    }
  };

  const removeImage = (type: 'logo' | 'coverImage') => {
    setFormData((prev: any) => ({
      ...prev,
      [type]: null
    }));
    if (type === 'logo' && logoInputRef.current) {
      logoInputRef.current.value = '';
    }
    if (type === 'coverImage' && coverInputRef.current) {
      coverInputRef.current.value = '';
    }
  };

  const renderImagePreview = (file: File | null) => {
    if (!file) return null;
    return (
      <div className="relative group">
        <img
          src={URL.createObjectURL(file)}
          alt="Preview"
          className="w-full h-32 object-cover rounded-lg"
        />
        <button
          onClick={() => removeImage(file === formData.logo ? 'logo' : 'coverImage')}
          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X size={16} />
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Upload Images</h2>
        <p className="text-secondary-600 mb-6">
          Upload your garage logo and cover image. These will be displayed on your garage profile.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Garage Logo
          </label>
          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center ${
                formData.logo ? 'border-primary-200 bg-primary-50' : 'border-secondary-200 hover:border-primary-300'
              }`}
            >
              {formData.logo ? (
                renderImagePreview(formData.logo)
              ) : (
                <div className="space-y-2">
                  <div className="mx-auto w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                    <ImageIcon size={24} className="text-secondary-400" />
                  </div>
                  <div className="text-sm text-secondary-600">
                    <p>Click to upload logo</p>
                    <p className="text-xs mt-1">PNG, JPG up to 2MB</p>
                  </div>
                </div>
              )}
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'logo')}
                className="hidden"
              />
              <button
                onClick={() => logoInputRef.current?.click()}
                className="mt-4 btn btn-secondary"
              >
                <Upload size={16} className="mr-2" />
                {formData.logo ? 'Change Logo' : 'Upload Logo'}
              </button>
            </div>
          </div>
        </div>

        {/* Cover Image Upload */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Cover Image
          </label>
          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center ${
                formData.coverImage ? 'border-primary-200 bg-primary-50' : 'border-secondary-200 hover:border-primary-300'
              }`}
            >
              {formData.coverImage ? (
                renderImagePreview(formData.coverImage)
              ) : (
                <div className="space-y-2">
                  <div className="mx-auto w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                    <ImageIcon size={24} className="text-secondary-400" />
                  </div>
                  <div className="text-sm text-secondary-600">
                    <p>Click to upload cover image</p>
                    <p className="text-xs mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              )}
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'coverImage')}
                className="hidden"
              />
              <button
                onClick={() => coverInputRef.current?.click()}
                className="mt-4 btn btn-secondary"
              >
                <Upload size={16} className="mr-2" />
                {formData.coverImage ? 'Change Cover' : 'Upload Cover'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadStep; 