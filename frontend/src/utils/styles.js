// Reusable Tailwind CSS class patterns
// Centralizes common styling to maintain consistency

/**
 * Primary button styles (black background)
 */
export const btnPrimary = "bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors";

/**
 * Secondary button styles (white with border)
 */
export const btnSecondary = "bg-white border-2 border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 transition-colors";

/**
 * Form input styles
 */
export const inputField = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";

/**
 * Form label styles
 */
export const label = "block text-sm font-medium text-gray-700";

/**
 * Get badge color classes based on role
 * Returns Tailwind classes for different user roles
 */
export const getRoleBadgeColor = (role) => {
  const colors = {
    owner: 'bg-black text-white border-black',
    developer: 'bg-gray-700 text-white border-gray-700',
    viewer: 'bg-gray-300 text-gray-800 border-gray-300'
  };
  return colors[role] || 'bg-gray-100 text-gray-800 border-gray-200';
};

/**
 * Role badge component styles
 */
export const roleBadge = (role) => 
  `text-xs px-2 py-1 rounded-full border font-medium ${getRoleBadgeColor(role)}`;

