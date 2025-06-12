import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, Check } from 'lucide-react';

const ConfirmationAlert = ({ type, message, onConfirm }) => {
  const alertConfig = {
    success: {
      bgColor: 'bg-gradient-to-br from-green-500/25 via-green-400/20 to-green-500/25',
      borderColor: 'border-green-400/50',
      textColor: 'text-green-200',
      icon: CheckCircle,
      iconColor: 'text-green-400',
      btnColor: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800',
      btnShadow: 'hover:shadow-green-500/25'
    },
    error: {
      bgColor: 'bg-gradient-to-br from-red-500/25 via-red-400/20 to-red-500/25',
      borderColor: 'border-red-400/50',
      textColor: 'text-red-200',
      icon: XCircle,
      iconColor: 'text-red-400',
      btnColor: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800',
      btnShadow: 'hover:shadow-red-500/25'
    },
    info: {
      bgColor: 'bg-gradient-to-br from-blue-500/25 via-blue-400/20 to-blue-500/25',
      borderColor: 'border-blue-400/50',
      textColor: 'text-blue-200',
      icon: Info,
      iconColor: 'text-blue-400',
      btnColor: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
      btnShadow: 'hover:shadow-blue-500/25'
    },
    warning: {
      bgColor: 'bg-gradient-to-br from-yellow-500/25 via-yellow-400/20 to-yellow-500/25',
      borderColor: 'border-yellow-400/50',
      textColor: 'text-yellow-200',
      icon: AlertTriangle,
      iconColor: 'text-yellow-400',
      btnColor: 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800',
      btnShadow: 'hover:shadow-yellow-500/25'
    }
  };

  const config = alertConfig[type] || alertConfig.info;
  const IconComponent = config.icon;

  return (
    <div className={`
      ${config.bgColor} ${config.borderColor} 
      border backdrop-blur-sm rounded-2xl p-6 
      animate-in slide-in-from-top duration-300
      shadow-xl hover:shadow-2xl transition-all duration-300
    `}>
      <div className="flex items-start space-x-4 mb-4">
        <div className={`flex-shrink-0 p-2 rounded-xl ${config.bgColor}`}>
          <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
        </div>
        <div className="flex-1">
          <h4 className={`font-semibold ${config.textColor} mb-1`}>
            {type === 'success' && 'Operación Exitosa'}
            {type === 'error' && 'Error Detectado'}
            {type === 'info' && 'Información'}
            {type === 'warning' && 'Advertencia'}
          </h4>
          <p className={`text-sm ${config.textColor} opacity-90 leading-relaxed`}>
            {message}
          </p>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={onConfirm}
          className={`
            ${config.btnColor} ${config.btnShadow}
            text-white font-medium text-sm px-6 py-2.5 
            rounded-xl transition-all duration-200 
            flex items-center space-x-2
            hover:scale-105 hover:shadow-lg
            focus:outline-none focus:ring-2 focus:ring-white/20
          `}
        >
          <Check className="w-4 h-4" />
          <span>Entendido</span>
        </button>
      </div>
    </div>
  );
};

export default ConfirmationAlert;