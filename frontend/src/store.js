import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: null,
    },
    mutations: {
        removeUser(state) {
            state.user = null;
        },
        updateUser(state, user) {
            state.user = {
                email: user.email,
                name: user.name,
            };
        },
    },
    actions: {},
});
