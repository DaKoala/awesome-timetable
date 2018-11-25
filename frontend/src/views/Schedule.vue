<template>
    <div>
        <nav-bar></nav-bar>
        <el-container>
            <el-aside width="200px"></el-aside>
            <el-main></el-main>
        </el-container>
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
        try {
            const res = await getPlan(this, this.$route.params.scheduleName);
            const { plan } = res.data;
            this.name = plan.name;
            this.creator = plan.creator;
        } catch (e) {
            this.$router.push('/dashboard');
        }
    },
};
</script>

<style scoped>

</style>
