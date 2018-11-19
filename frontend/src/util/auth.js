import { auth } from '../api/api';

export default function validateAuth(app) {
    auth()
        .then((res) => {
            const { user } = res.data;
            console.log(res);
            if (user) {
                app.$store.commit('updateUser', res.data.user);
                app.$router.replace('/dashboard');
            } else {
                app.$router.replace('/');
            }
        })
        .catch(() => {
            app.$router.replace('/');
        });
}
