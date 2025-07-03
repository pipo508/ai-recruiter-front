import { useState } from 'react';
import { Edit, Save, X, Phone, Copy, Check, Github, Mail, MapPin } from 'lucide-react';

const EditableContactInfo = ({ 
  phoneNumber, 
  email, 
  github, 
  location, 
  candidate, 
  filename, 
  token, 
  onSave 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState({});
  const [saving, setSaving] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const startEditing = () => {
    setIsEditing(true);
    setEditingData({
      'Número de teléfono': phoneNumber,
      'Email': email,
      'GitHub': github,
      'Ubicación': location
    });
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditingData({});
  };

  const saveChanges = async () => {
    try {
      setSaving(true);
      await onSave(editingData);
      setIsEditing(false);
      setEditingData({});
    } catch (error) {
      alert('Error al guardar cambios: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const updateEditingData = (field, value) => {
    setEditingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="relative group">
      {!isEditing && (
        <button
          onClick={startEditing}
          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
        >
          <Edit className="w-4 h-4 text-white" />
        </button>
      )}
      
      {isEditing ? (
        <div className="space-y-4 p-4 bg-gray-800/50 rounded-lg border border-blue-500/50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Editando información de contacto</h3>
            <div className="flex gap-2">
              <button
                onClick={saveChanges}
                disabled={saving}
                className="p-2 bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={cancelEditing}
                className="p-2 bg-red-600 hover:bg-red-700 rounded-lg"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
          
          <input
            type="text"
            value={editingData['Número de teléfono'] || ''}
            onChange={(e) => updateEditingData('Número de teléfono', e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            placeholder="Número de teléfono"
          />
          
          <input
            type="email"
            value={editingData['Email'] || ''}
            onChange={(e) => updateEditingData('Email', e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            placeholder="Email"
          />
          
          <input
            type="text"
            value={editingData['GitHub'] || ''}
            onChange={(e) => updateEditingData('GitHub', e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            placeholder="GitHub"
          />
          
          <input
            type="text"
            value={editingData['Ubicación'] || ''}
            onChange={(e) => updateEditingData('Ubicación', e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            placeholder="Ubicación"
          />
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-4">
            {phoneNumber && (
              <button
                onClick={() => handleCopy(phoneNumber)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95 hover:-translate-y-1 flex items-center gap-3"
              >
                <Phone className="w-5 h-5" />
                <span>{phoneNumber}</span>
                {isCopied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-gray-300" />}
              </button>
            )}
            <button 
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg active:scale-95 hover:-translate-y-1"
              onClick={async () => {
                try {
                  const response = await fetch(`http://127.0.0.1:5000/api/document/get-pdf?user_id=${candidate.user_id}&filename=${filename}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                  });
                  const data = await response.json();
                  if (data.success && data.file_url) {
                    window.open(data.file_url, '_blank');
                  } else {
                    alert('No se pudo obtener la URL del portafolio');
                  }
                } catch (err) {
                  alert('Error al obtener el portafolio: ' + err.message);
                }
              }}
            >
              Ver Portafolio
            </button>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4">
            {github && (
              <a
                href={github.startsWith('http') ? github : `https://${github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors duration-300"
              >
                <Github className="w-5 h-5" />
                <span className="font-medium">GitHub</span>
              </a>
            )}
            {email && (
              <a 
                href={`mailto:${email}`}
                className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors duration-300"
              >
                <Mail className="w-5 h-5" />
                <span className="font-medium">{email}</span>
              </a>
            )}
            {location && (
              <div className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors duration-300 cursor-default">
                <MapPin className="w-5 h-5 text-red-500" />
                <span className="font-medium">{location}</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default EditableContactInfo;