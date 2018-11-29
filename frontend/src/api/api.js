import axios from 'axios';
import jsonToForm from '../util/transformData';
import { BASE_URL, apiPath } from './config';

axios.defaults.withCredentials = true;

function postForm(app, url, data) {
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
}

function fetchGet(app, url, data) {
    const authObj = {};
    if (app.$store.state.user) {
        authObj.author = app.$store.state.user.name;
    }
    return axios.get(url, {
        params: Object.assign(data || {}, authObj),
    });
}

function checkExist(app, type, value) {
    const data = {};
    if (type === 'email') {
        data.email = value;
    } else {
        data.name = value;
    }
    return fetchGet(app, `${BASE_URL}${apiPath.checkExist}`, data);
}

function register(app, userData) {
    return postForm(app, `${BASE_URL}${apiPath.register}`, userData);
}

function login(app, userData) {
    return postForm(app, `${BASE_URL}${apiPath.login}`, userData);
}

function logout(app) {
    return fetchGet(app, `${BASE_URL}${apiPath.logout}`);
}

function auth() {
    return axios.get(`${BASE_URL}${apiPath.auth}`);
}

function newPlan(app, planName) {
    return postForm(app, `${BASE_URL}${apiPath.newPlan}`, {
        name: planName,
    });
}

function getAllPlan(app) {
    return fetchGet(app, `${BASE_URL}${apiPath.getAllPlan}`);
}

function getPlan(app, planName) {
    return fetchGet(app, `${BASE_URL}${apiPath.getPlan}`, {
        planName,
    });
}

function newEvent(app, event) {
    return postForm(app, `${BASE_URL}${apiPath.newEvent}`, event);
}

function deletePlan(app, planName) {
    return fetchGet(app, `${BASE_URL}${apiPath.deletePlan}`, {
        planName,
    });
}

export {
    checkExist,
    register,
    auth,
    login,
    logout,
    newPlan,
    getAllPlan,
    getPlan,
    newEvent,
    deletePlan,
};
