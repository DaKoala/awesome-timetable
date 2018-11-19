const BASE_URL = process.env.NODE_ENV === 'production' ? 'http://linserv1.cims.nyu.edu:38499' : 'http://localhost:3000';

const apiPath = {
    checkExist: '/user/checkExist',
    register: '/user/register',
};

export {
    BASE_URL,
    apiPath,
};
