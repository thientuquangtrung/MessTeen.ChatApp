const isAdmin = (req, res, next) => {
    if (req.user && req.user.usr_role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Forbidden. Admin access required.' });
};

module.exports = isAdmin;
