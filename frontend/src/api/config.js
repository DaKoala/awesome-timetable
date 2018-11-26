const BASE_URL = process.env.NODE_ENV === 'production' ? 'http://linserv1.cims.nyu.edu:38499' : 'http://localhost:3000';

const apiPath = {
    checkExist: '/user/checkExist',
    register: '/user/register',
    login: '/user/login',
    auth: '/user/auth',
    newPlan: '/plan/new',
    getAllPlan: '/plan/getAll',
    getPlan: '/plan/get',
    newEvent: '/event/new',
};

export {
    BASE_URL,
    apiPath,
};
