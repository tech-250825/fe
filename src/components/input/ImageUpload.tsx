import React from "react";

interface ImageUploadProps {
  imagePreview: string | null;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export function ImageUpload({
  imagePreview,
  onImageUpload,
  className = "",
}: ImageUploadProps) {
  return (
    <div
      className={`mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg ${className}`}
    >
      <input
        type="file"
        accept="image/*"
        onChange={onImageUpload}
        className="hidden"
        id="image-upload"
      />
      <label htmlFor="image-upload" className="cursor-pointer">
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-40 object-cover rounded"
          />
        ) : (
          <div className="text-center py-8">
            <p>Click to upload image</p>
          </div>
        )}
      </label>
    </div>
  );
}
