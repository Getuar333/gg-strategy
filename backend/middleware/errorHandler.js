export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }
  if (err.code && err.code.startsWith('ER_')) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'This record already exists' });
    }
    return res.status(400).json({ message: 'Database error' });
  }
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
};
export default errorHandler;