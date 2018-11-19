import axios from 'axios';
import jsonToForm from '../util/transformData';
import { BASE_URL, apiPath } from './config';

axios.defaults.withCredentials = true;

const checkExist = function(type, value) {
    const data = {};
    if (type === 'email') {
        data.email = value;
    } else {
        data.name = value;
    }
    return axios.get(`${BASE_URL}${apiPath.checkExist}`, {
        params: data,
    });
};

const register = function(userData) {
    return axios({
        method: 'post',
        url: `${BASE_URL}${apiPath.register}`,
        data: jsonToForm(userData),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
};

const login = function(userData) {
    return axios({
        method: 'post',
        url: `${BASE_URL}${apiPath.login}`,
        data: jsonToForm(userData),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
};

const auth = function() {
    return axios.get(`${BASE_URL}${apiPath.auth}`);
};

export {
    checkExist,
    register,
    auth,
    login,
};
