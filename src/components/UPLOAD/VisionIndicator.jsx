import React from 'react';
import { Eye, AlertTriangle } from 'lucide-react';
import { useUpload } from '../../context/UploadContext';

const VisionIndicator = ({ className = "" }) => {
  const { visionDocuments, hasVisionDocuments } = useUpload();

  if (!hasVisionDocuments) return null;

  return (
    <div className={`flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg ${className}`}>
      <div className="flex items-center space-x-1">
        <AlertTriangle className="w-4 h-4 text-yellow-400 animate-pulse" />
        <Eye className="w-4 h-4 text-yellow-400" />
      </div>
      <span className="text-sm text-yellow-300 font-medium">
        {visionDocuments.length} documento{visionDocuments.length !== 1 ? 's' : ''} esperando Vision
      </span>
    </div>
  );
};

export default VisionIndicator;