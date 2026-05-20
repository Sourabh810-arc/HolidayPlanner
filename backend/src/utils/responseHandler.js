export const sendSuccess = (res, message, data = null, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    ...(data && { data }),
  });
};

export const sendError = (res, message, statusCode = 400, additionalInfo = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    ...(additionalInfo && { ...additionalInfo }),
  });
};

export const validateEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};
