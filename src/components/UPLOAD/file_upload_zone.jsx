import React from 'react';
import { UploadCloud, FileIcon } from 'lucide-react';

const FileUploadZone = ({ dragActive, onDrag, onDrop, onClick }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300 mb-3">
        Documentos PDF
      </label>
      <div
        className={`
          relative border-2 border-dashed rounded-2xl h-48 
          flex flex-col justify-center items-center cursor-pointer 
          transition-all duration-500 ease-out group
          ${dragActive 
            ? 'border-blue-400 bg-gradient-to-br from-blue-500/20 via-purple-500/15 to-blue-500/20 scale-[1.02] shadow-xl shadow-blue-500/20' 
            : 'border-gray-600/60 bg-gradient-to-br from-gray-800/40 via-gray-700/30 to-gray-800/40 hover:border-blue-500/60 hover:bg-gradient-to-br hover:from-blue-900/20 hover:via-purple-900/15 hover:to-blue-900/20 hover:scale-[1.01]'
          }
        `}
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        onDragOver={onDrag}
        onDrop={onDrop}
        onClick={onClick}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center space-y-4">
          <div className={`
            p-4 rounded-full transition-all duration-300
            ${dragActive 
              ? 'bg-blue-500/20 scale-110' 
              : 'bg-gray-700/50 group-hover:bg-blue-500/20 group-hover:scale-110'
            }
          `}>
            <UploadCloud className={`
              w-12 h-12 transition-all duration-300
              ${dragActive 
                ? 'text-blue-400 animate-bounce' 
                : 'text-gray-400 group-hover:text-blue-400'
              }
            `} />
          </div>
          
          <div className="text-center space-y-2">
            <p className={`
              text-base font-medium transition-colors duration-300
              ${dragActive 
                ? 'text-blue-300' 
                : 'text-gray-300 group-hover:text-blue-300'
              }
            `}>
              {dragActive ? 'Suelta aquí tus archivos' : 'Arrastra tus PDFs aquí'}
            </p>
            <p className="text-sm text-gray-400">
              o <span className="text-blue-400 font-medium">haz clic para seleccionar</span>
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <FileIcon className="w-4 h-4" />
            <span>Solo archivos PDF • Máximo 10MB por archivo</span>
          </div>
        </div>

        {/* Animated border effect */}
        <div className={`
          absolute inset-0 rounded-2xl transition-opacity duration-300
          ${dragActive ? 'opacity-100' : 'opacity-0'}
        `}>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadZone;