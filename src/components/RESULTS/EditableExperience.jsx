import { useState } from 'react';
import { Edit, Save, X, Plus, Trash2, Briefcase, Calendar } from 'lucide-react';

const EditableExperience = ({ experiences, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState({});
  const [saving, setSaving] = useState(false);

  const startEditing = () => {
    setIsEditing(true);
    setEditingData({
      'Experiencia Profesional': [...experiences]
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

  const addArrayItem = (field, newItem) => {
    setEditingData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), newItem]
    }));
  };

  const removeArrayItem = (field, index) => {
    setEditingData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (field, index, newValue) => {
    setEditingData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? newValue : item)
    }));
  };

  return (
    <div className="mt-8 bg-gray-800/30 backdrop-blur-xl border border-gray-700 rounded-xl p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 mx-8 relative group">
      {!isEditing && (
        <button
          onClick={startEditing}
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
        >
          <Edit className="w-4 h-4 text-white" />
        </button>
      )}
      
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-purple-400" />
        Experiencia Profesional
      </h2>
      
      {isEditing ? (
        <div className="space-y-4">
          <div className="flex justify-end gap-2 mb-4">
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
          
          <div className="space-y-4">
            {(editingData['Experiencia Profesional'] || []).map((exp, index) => (
              <div key={index} className="p-4 bg-gray-700/50 rounded-lg border border-gray-600 space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="text-white font-medium">Experiencia {index + 1}</h4>
                  <button
                    onClick={() => removeArrayItem('Experiencia Profesional', index)}
                    className="p-1 bg-red-600 hover:bg-red-700 rounded"
                  >
                    <Trash2 className="w-3 h-3 text-white" />
                  </button>
                </div>
                
                <input
                  type="text"
                  value={exp['Puesto'] || ''}
                  onChange={(e) => updateArrayItem('Experiencia Profesional', index, {...exp, 'Puesto': e.target.value})}
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Puesto"
                />
                
                <input
                  type="text"
                  value={exp['Empresa'] || ''}
                  onChange={(e) => updateArrayItem('Experiencia Profesional', index, {...exp, 'Empresa': e.target.value})}
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Empresa"
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={exp['Año inicio'] || ''}
                    onChange={(e) => updateArrayItem('Experiencia Profesional', index, {...exp, 'Año inicio': e.target.value})}
                    className="p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                    placeholder="Año inicio"
                  />
                  <input
                    type="text"
                    value={exp['Año fin'] || ''}
                    onChange={(e) => updateArrayItem('Experiencia Profesional', index, {...exp, 'Año fin': e.target.value})}
                    className="p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                    placeholder="Año fin"
                  />
                </div>
                
                <textarea
                  value={exp['Descripción breve del rol'] || ''}
                  onChange={(e) => updateArrayItem('Experiencia Profesional', index, {...exp, 'Descripción breve del rol': e.target.value})}
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  rows="2"
                  placeholder="Descripción breve del rol"
                />
              </div>
            ))}
            
            <button
              onClick={() => addArrayItem('Experiencia Profesional', {
                'Puesto': '',
                'Empresa': '',
                'Año inicio': '',
                'Año fin': '',
                'Descripción breve del rol': ''
              })}
              className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center gap-2 text-white"
            >
              <Plus className="w-4 h-4" />
              Agregar experiencia
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {experiences.map((experience, index) => (
            <div key={index} className="relative pl-8 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-gradient-to-r before:from-blue-500 before:to-purple-500 before:rounded-full hover:before:scale-150 before:transition-transform">
              <h3 className="text-white font-medium">{experience['Puesto']}</h3>
              <p className="text-blue-400">{experience['Empresa']}</p>
              <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                <Calendar className="w-4 h-4" />
                <span>{`${experience['Año inicio']} - ${experience['Año fin']}`}</span>
              </div>
              <p className="text-gray-400 mt-2 text-sm">{experience['Descripción breve del rol']}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditableExperience;