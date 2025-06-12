import React from 'react';
import { XCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

const Alert = ({ type, message, onClose }) => {
  const alertConfig = {
    success: {
      bgColor: 'bg-gradient-to-r from-green-500/20 via-green-400/15 to-green-500/20',
      borderColor: 'border-green-400/40',
      textColor: 'text-green-300',
      icon: CheckCircle,
      iconColor: 'text-green-400'
    },
    error: {
      bgColor: 'bg-gradient-to-r from-red-500/20 via-red-400/15 to-red-500/20',
      borderColor: 'border-red-400/40',
      textColor: 'text-red-300',
      icon: XCircle,
      iconColor: 'text-red-400'
    },
    info: {
      bgColor: 'bg-gradient-to-r from-blue-500/20 via-blue-400/15 to-blue-500/20',
      borderColor: 'border-blue-400/40',
      textColor: 'text-blue-300',
      icon: Info,
      iconColor: 'text-blue-400'
    },
    warning: {
      bgColor: 'bg-gradient-to-r from-yellow-500/20 via-yellow-400/15 to-yellow-500/20',
      borderColor: 'border-yellow-400/40',
      textColor: 'text-yellow-300',
      icon: AlertTriangle,
      iconColor: 'text-yellow-400'
    }
  };

  const config = alertConfig[type] || alertConfig.info;
  const IconComponent = config.icon;

  return (
    <div className={`
      ${config.bgColor} ${config.borderColor} 
      border backdrop-blur-sm rounded-xl p-4 
      flex items-start justify-between space-x-3
      animate-in slide-in-from-top duration-300
      shadow-lg hover:shadow-xl transition-all duration-200
    `}>
      <div className="flex items-start space-x-3 flex-1">
        <div className={`flex-shrink-0 p-1 rounded-lg ${config.bgColor}`}>
          <IconComponent className={`w-5 h-5 ${config.iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${config.textColor} leading-relaxed`}>
            {message}
          </p>
        </div>
      </div>
      
      <button
        onClick={onClose}
        className={`
          flex-shrink-0 p-1 rounded-lg transition-all duration-200
          ${config.textColor} hover:bg-white/10 hover:scale-110
        `}
        aria-label="Cerrar alerta"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Alert;