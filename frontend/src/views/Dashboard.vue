<template>
    <div>
        Hello, {{user.name}}
    </div>
</template>

<script>
export default {
    name: 'Dashboard',
    data() {
        return {

        };
    },
    computed: {
        user() {
            return this.$store.state.user;
        },
    },
};
</script>

<style scoped>

</style>
