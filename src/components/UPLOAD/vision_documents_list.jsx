import React from 'react';
import { FileText, Eye, X, AlertTriangle } from 'lucide-react';
import { Spinner } from '../Spinner';

const VisionDocumentsList = ({ documents, processingDocs, onProcessVision, onSkipVision }) => {
  return (
    <div className="backdrop-blur-xl bg-gradient-to-br from-yellow-900/20 via-orange-900/15 to-yellow-900/20 border border-yellow-600/30 rounded-2xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-yellow-500/20 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-yellow-300">
            Procesamiento con Vision Requerido
          </h3>
          <p className="text-sm text-yellow-400/80">
            Los siguientes documentos necesitan análisis adicional
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {documents.map((doc, index) => (
          <VisionDocumentItem
            key={`${doc.filename}-${index}`}
            document={doc}
            isProcessing={processingDocs[doc.temp_path_id]}
            onProcessVision={onProcessVision}
            onSkipVision={onSkipVision}
          />
        ))}
      </div>
    </div>
  );
};

const VisionDocumentItem = ({ document, isProcessing, onProcessVision, onSkipVision }) => {
  return (
    <div className="group bg-gradient-to-r from-gray-800/40 via-gray-700/30 to-gray-800/40 border border-gray-600/30 rounded-xl p-4 transition-all duration-300 hover:border-yellow-500/40 hover:shadow-lg hover:shadow-yellow-500/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          {/* Document Icon */}
          <div className="flex-shrink-0 relative">
            <FileText className="w-8 h-8 text-yellow-400" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full flex items-center justify-center">
              <Eye className="w-2 h-2 text-white" />
            </div>
          </div>

          {/* Document Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate group-hover:text-white transition-colors">
              {document.filename}
            </p>
            <p className="text-xs text-yellow-400/80 mt-1">
              {document.reason}
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-yellow-400">Esperando procesamiento</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {isProcessing ? (
            <div className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 rounded-lg">
              <Spinner size={16} color="#60a5fa" />
              <span className="text-sm text-blue-400">Procesando...</span>
            </div>
          ) : (
            <>
              <button
                onClick={() => onProcessVision(document)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 group/btn"
              >
                <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                <span>Procesar con Vision</span>
              </button>
              <button
                onClick={() => onSkipVision(document)}
                className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-gray-300 text-sm font-medium rounded-lg hover:from-red-600 hover:to-red-700 hover:text-white transition-all duration-200 flex items-center space-x-2 group/btn"
              >
                <X className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                <span>Descartar</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Progress indicator */}
      {isProcessing && (
        <div className="mt-3 bg-gray-700/50 rounded-full h-1 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse w-3/4"></div>
        </div>
      )}
    </div>
  );
};

export default VisionDocumentsList