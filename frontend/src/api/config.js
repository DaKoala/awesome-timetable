const BASE_URL = process.env.NODE_ENV === 'production' ? 'http://linserv1.cims.nyu.edu:38499' : 'http://localhost:3000';

const apiPath = {
    checkExist: '/user/checkExist',
    register: '/user/register',
    login: '/user/login',
    logout: '/user/logout',
    auth: '/user/auth',
    newPlan: '/plan/new',
    getAllPlan: '/plan/getAll',
    getPlan: '/plan/get',
    deletePlan: '/plan/delete',
    editPlanName: '/plan/editName',
    newEvent: '/event/new',
    deleteEvent: '/event/delete',
    updateEvent: '/event/update',
};

export {
    BASE_URL,
    apiPath,
};
