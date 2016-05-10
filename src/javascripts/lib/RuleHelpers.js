export const createResult = (priority, label, message, type = 'info') => {
  return {
    priority,
    label,
    message,
    type,
  };
};
