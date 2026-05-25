export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};

export const validateName = (name) => {
  return name.trim().length >= 2 && name.trim().length <= 100;
};

export const validateDate = (dateStr) => {
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date);
};

export const validateTime = (timeStr) => {
  const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(timeStr);
};
export const validators = {
  validateEmail,
  validatePassword,
  validateName,
  validateDate,
  validateTime
};


export default validators;