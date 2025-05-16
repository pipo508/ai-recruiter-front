
import { AVATAR_CONSTANTS } from '../../constants/constants';

/**
 * Componente para mostrar avatares estilizados con las iniciales de un nombre
 */
const InitialsAvatar = ({
  name,
  size = AVATAR_CONSTANTS.DEFAULTS.SIZE,
  colorScheme = AVATAR_CONSTANTS.DEFAULTS.COLOR_SCHEME,
  className = "",
  withBorder = AVATAR_CONSTANTS.DEFAULTS.WITH_BORDER,
  withHoverEffects = AVATAR_CONSTANTS.DEFAULTS.WITH_HOVER_EFFECTS,
}) => {
  // Función para extraer las iniciales del nombre
  const getInitials = (fullName) => {
    if (!fullName) return '';
    return fullName
      .split(' ')
      .map(part => part && part[0])
      .filter(Boolean)
      .join('')
      .toUpperCase();
  };

  const sizeClass = AVATAR_CONSTANTS.SIZE_CLASSES[size] || AVATAR_CONSTANTS.SIZE_CLASSES.medium;
  const colorClass = AVATAR_CONSTANTS.COLOR_SCHEMES[colorScheme] || AVATAR_CONSTANTS.COLOR_SCHEMES.blue;

  const hoverEffectsClass = withHoverEffects
    ? AVATAR_CONSTANTS.HOVER_EFFECTS.ENABLED
    : "";

  const initials = getInitials(name);

  return (
    <div className={`relative rounded-lg overflow-hidden group ${className}`}>
      {withBorder && (
        <div className={`absolute -inset-0.5 bg-gradient-to-r from-white/30 via-blue-500/70 to-white/30 rounded-lg blur opacity-30 ${withHoverEffects ? 'group-hover:opacity-80' : ''} transition-opacity duration-300`}></div>
      )}

      <div className={`relative flex items-center justify-center ${sizeClass} ${colorClass} transition-transform duration-300`}>
        <div className="absolute -top-6 -left-6 w-16 h-16 bg-white rounded-full opacity-10 blur-lg"></div>
        <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-cyan-300 rounded-full opacity-10 blur-lg"></div>

        {withBorder && (
          <div className="absolute inset-1.5 border border-white/30 rounded-md"></div>
        )}

        <span className={`font-bold text-white z-10 transform transition-transform duration-300 ${hoverEffectsClass}`}>
          {initials}
        </span>

        {withHoverEffects && (
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-500"
            style={{ transform: 'rotate(-45deg) translateX(-200%)', width: '200%' }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default InitialsAvatar;