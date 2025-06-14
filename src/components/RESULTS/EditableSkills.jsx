import { useState } from 'react';
import { Edit, Save, X, Plus, Trash2, Award } from 'lucide-react';

const EditableSkills = ({ skills, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState({});
  const [saving, setSaving] = useState(false);

  const startEditing = () => {
    setIsEditing(true);
    setEditingData({
      'Habilidades clave': [...skills]
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
    <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700 rounded-xl p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 relative group">
      {!isEditing && (
        <button
          onClick={startEditing}
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
        >
          <Edit className="w-4 h-4 text-white" />
        </button>
      )}
      
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Award className="w-5 h-5 text-blue-400" />
        Habilidades Clave
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
          
          <div className="space-y-2">
            {(editingData['Habilidades clave'] || []).map((skill, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => updateArrayItem('Habilidades clave', index, e.target.value)}
                  className="flex-1 p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
                <button
                  onClick={() => removeArrayItem('Habilidades clave', index)}
                  className="p-2 bg-red-600 hover:bg-red-700 rounded"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
            <button
              onClick={() => addArrayItem('Habilidades clave', '')}
              className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Agregar habilidad
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span key={index} className="bg-blue-500/20 text-blue-400 border border-blue-500/50 px-4 py-2 text-sm rounded-full hover:bg-blue-500/30 hover:-translate-y-1 transition-all duration-300">
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditableSkills;