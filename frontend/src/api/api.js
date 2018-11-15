import axios from 'axios';
import { BASE_URL, apiPath } from './config';

const checkEmail = function(email) {
    return axios.get(`${BASE_URL}${apiPath.checkEmail}`, {
        params: {
            email,
        },
    });
};

const checkName = function(name) {
    return axios.get(`${BASE_URL}${apiPath.checkName}`, {
        params: {
            name,
        },
    });
};

export {
    checkEmail,
    checkName,
};
