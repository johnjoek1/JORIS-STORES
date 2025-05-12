module.exports = (req, res, next) => {
    if (!req.user) {
      return res.status(401).send({ error: 'Authentication required' });
    }
    if (req.user.role !== 'admin') {
      return res.status(403).send({ error: 'Admin access required' });
    }
    next();
  };