const getUniversityFromEmail = (email = '') => {
    if (!email || !email.includes('@')) return null;
    const parts = email.split('@');
    const domain = parts[1];
    const university = domain.split('.')[0];
    return university;
};

module.exports = { getUniversityFromEmail };

