import axios from 'axios';
import jsonToForm from '../util/transformData';
import { BASE_URL, apiPath } from './config';

axios.defaults.withCredentials = true;

const postForm = function(app, url, data) {
    const authObj = {};
    if (app.$store.state.user) {
        authObj.author = app.$store.state.user.name;
    }
    return axios({
        url,
        method: 'post',
        data: jsonToForm(Object.assign(data || {}, authObj)),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
};

const fetchGet = function(app, url, data) {
    const authObj = {};
    if (app.$store.state.user) {
        authObj.author = app.$store.state.user.name;
    }
    return axios.get(url, {
        params: Object.assign(data || {}, authObj),
    });
};

const checkExist = function(app, type, value) {
    const data = {};
    if (type === 'email') {
        data.email = value;
    } else {
        data.name = value;
    }
    return fetchGet(app, `${BASE_URL}${apiPath.checkExist}`, data);
};

const register = function(app, userData) {
    return postForm(app, `${BASE_URL}${apiPath.register}`, userData);
};

const login = function(app, userData) {
    return postForm(app, `${BASE_URL}${apiPath.login}`, userData);
};

const auth = function() {
    return axios.get(`${BASE_URL}${apiPath.auth}`);
};

const newPlan = function(app, planName) {
    return postForm(app, `${BASE_URL}${apiPath.newPlan}`, {
        name: planName,
    });
};

const getPlan = function(app) {
    return fetchGet(app, `${BASE_URL}${apiPath.getPlan}`);
};

export {
    checkExist,
    register,
    auth,
    login,
    newPlan,
    getPlan,
};
