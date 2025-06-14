import { useState } from 'react';
import { Edit, Save, X, Star, Award, Briefcase, Users } from 'lucide-react';

const EditableBasicInfo = ({ 
  name, 
  jobTitle, 
  experience, 
  mainSkill, 
  profile, 
  onSave 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState({});
  const [saving, setSaving] = useState(false);

  const startEditing = () => {
    setIsEditing(true);
    setEditingData({
      'Nombre completo': name,
      'Puesto actual': jobTitle,
      'Descripción profesional': experience,
      'Habilidad principal': mainSkill
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
            <h3 className="text-lg font-semibold text-white">Editando información básica</h3>
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
            value={editingData['Nombre completo'] || ''}
            onChange={(e) => updateEditingData('Nombre completo', e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            placeholder="Nombre completo"
          />
          
          <input
            type="text"
            value={editingData['Puesto actual'] || ''}
            onChange={(e) => updateEditingData('Puesto actual', e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            placeholder="Puesto actual"
          />
          
          <input
            type="text"
            value={editingData['Habilidad principal'] || ''}
            onChange={(e) => updateEditingData('Habilidad principal', e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            placeholder="Habilidad principal"
          />
          
          <textarea
            value={editingData['Descripción profesional'] || ''}
            onChange={(e) => updateEditingData('Descripción profesional', e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            rows="3"
            placeholder="Descripción profesional"
          />
        </div>
      ) : (
        <>
          <div>
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent animate-gradient">
                {name}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <p className="text-xl font-medium text-blue-400">{jobTitle}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-colors">
              <Star className="w-6 h-6 text-yellow-400 mb-2" />
              <p className="text-sm text-gray-400">{mainSkill}</p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-colors">
              <Award className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-sm text-gray-400">{profile['Años de experiencia total'] || 'N/A'} años exp.</p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-colors">
              <Briefcase className="w-6 h-6 text-cyan-400 mb-2" />
              <p className="text-sm text-gray-400">{profile['Cantidad de proyectos/trabajos'] || 'N/A'} Proyectos</p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-colors">
              <Users className="w-6 h-6 text-blue-400 mb-2" />
              <p className="text-sm text-gray-400">Top Performer</p>
            </div>
          </div>

          <p className="text-gray-300 text-lg leading-relaxed">
            {experience}
          </p>
        </>
      )}
    </div>
  );
};

export default EditableBasicInfo;