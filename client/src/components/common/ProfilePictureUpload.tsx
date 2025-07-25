import React, { useState, useRef } from 'react';
import { Upload, User, Camera, X } from 'lucide-react';
import { apiRequest } from '../../lib/queryClient';
import { useAuth } from '../../contexts/AuthContext';

interface ProfilePictureUploadProps {
  currentPicture?: string;
  onUploadComplete: (newPictureUrl: string) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentPicture,
  onUploadComplete,
  size = 'md',
  className = ''
}) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24', 
    lg: 'w-32 h-32'
  };

  const iconSizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be smaller than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    uploadProfilePicture(file);
  };

  const uploadProfilePicture = async (file: File) => {
    setIsUploading(true);
    
    try {
      // For now, we'll convert to base64 and store in the database
      // In production, you'd upload to a cloud storage service
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        
        try {
          const response = await apiRequest('/profile/picture', {
            method: 'PUT',
            body: JSON.stringify({ 
              profilePicture: base64Data 
            })
          });

          onUploadComplete(base64Data);
          setPreviewUrl(null);
        } catch (error) {
          console.error('Error uploading profile picture:', error);
          alert('Failed to upload profile picture. Please try again.');
          setPreviewUrl(null);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image. Please try again.');
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePicture = async () => {
    try {
      await apiRequest('/profile/picture', {
        method: 'DELETE'
      });
      onUploadComplete('');
    } catch (error) {
      console.error('Error removing profile picture:', error);
      alert('Failed to remove profile picture. Please try again.');
    }
  };

  const displayPicture = previewUrl || currentPicture;

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 group cursor-pointer`}>
        {displayPicture ? (
          <img
            src={displayPicture}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <User className={`${iconSizes[size]} text-gray-400`} />
          </div>
        )}
        
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          ) : (
            <Camera className="h-5 w-5 text-white" />
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute -bottom-2 -right-2 flex space-x-1">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 shadow-sm"
          title="Upload new picture"
        >
          <Upload className="h-3 w-3" />
        </button>
        
        {currentPicture && (
          <button
            onClick={handleRemovePicture}
            className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-sm"
            title="Remove picture"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfilePictureUpload;