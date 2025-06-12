import { FileText, Download, XCircle } from 'lucide-react';

const FileList = ({ files, onRemove, onDownload }) => {
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-300">
          Archivos seleccionados ({files.length})
        </h3>
        <div className="text-xs text-gray-500">
          Total: {formatFileSize(files.reduce((acc, file) => acc + file.size, 0))}
        </div>
      </div>
      
      <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
        {files.map((file, index) => (
          <FileItem
            key={`${file.name}-${index}`}
            file={file}
            index={index}
            onRemove={onRemove}
            onDownload={onDownload}
            formatFileSize={formatFileSize}
          />
        ))}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }
      `}</style>
    </div>
  );
};

const FileItem = ({ file, index, onRemove, onDownload, formatFileSize }) => {
  return (
    <div className="group bg-gradient-to-r from-gray-800/60 via-gray-800/40 to-gray-800/60 border border-gray-700/30 rounded-xl p-4 transition-all duration-300 hover:border-gray-600/50 hover:shadow-lg hover:shadow-black/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          {/* File Icon */}
          <div className="flex-shrink-0">
            <div className="relative">
              <FileText className="w-8 h-8 text-blue-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </div>
          </div>

          {/* File Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate group-hover:text-white transition-colors">
              {file.name}
            </p>
            <div className="flex items-center space-x-3 mt-1">
              <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span className="text-xs text-green-400">Listo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={() => onDownload(file.name)}
            className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-all duration-200"
            title="Descargar archivo"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-200"
            title="Remover archivo"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar (decorative) */}
      <div className="mt-3 bg-gray-700/50 rounded-full h-1 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 w-full"></div>
      </div>
    </div>
  );
};

export default FileList;