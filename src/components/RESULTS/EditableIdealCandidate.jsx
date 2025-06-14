import { useState } from 'react';
import { Edit, Save, X, Star } from 'lucide-react';

const EditableIdealCandidate = ({ whyPerfect, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState({});
  const [saving, setSaving] = useState(false);

  const startEditing = () => {
    setIsEditing(true);
    setEditingData({
      'Candidato ideal': whyPerfect
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
        <Star className="w-5 h-5 text-yellow-400" />
        ¿Por qué es el candidato ideal?
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
          
          <textarea
            value={editingData['Candidato ideal'] || ''}
            onChange={(e) => updateEditingData('Candidato ideal', e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            rows="4"
            placeholder="¿Por qué es el candidato ideal?"
          />
        </div>
      ) : (
        <p className="text-gray-300">
          {whyPerfect}
        </p>
      )}
    </div>
  );
};

export default EditableIdealCandidate;