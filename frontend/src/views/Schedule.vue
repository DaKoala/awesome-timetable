<template>
    <div>
        <nav-bar></nav-bar>
        <div>
            {{name}} by {{creator}}
        </div>
    </div>
</template>

<script>
import NavBar from '../components/NavBar.vue';
import { getPlan } from '../api/api';

export default {
    name: 'Schedule',
    components: { NavBar },
    data() {
        return {
            name: '',
            creator: '',
        };
    },
    async created() {
        const res = await getPlan(this, this.$route.params.scheduleName);
        const { plan } = res.data;
        this.name = plan.name;
        this.creator = plan.creator;
    },
};
</script>

<style scoped>

</style>
