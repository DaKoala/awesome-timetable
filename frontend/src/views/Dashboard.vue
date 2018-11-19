<template>
    <div>
        Hello, {{user.name}}
    </div>
</template>

<script>
import validateAuth from '../util/auth';

export default {
    name: 'dashboard',
    data() {
        return {

        };
    },
    computed: {
        user() {
            return this.$store.state.user;
        },
    },
    created() {
        validateAuth(this);
    },
};
</script>

<style scoped>

</style>
