export const createResult = (priority, label, message, type = 'info') => {
  return {
    priority,
    label,
    message,
    type,
  };
};




export const htmlEntitiesEncode = (str) => {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};
