<template>
    <el-menu mode="horizontal" :default-active="activeIndex" class="nav">
        <el-menu-item index="plan" @click="navPlan">Dashboard</el-menu-item>
        <el-menu-item index="schedule" :disabled="disableSchedule">Plan</el-menu-item>
        <div class="nav__user">
            <el-dropdown>
                <span class="el-dropdown-link">
                    {{this.$store.state.user.name}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="signOut">Sign out</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </el-menu>
</template>

<script>
import popupMessage from '../util/message';
import { logout } from '../api/api';

export default {
    name: 'NavBar',
    data() {
        return {};
    },
    computed: {
        activeIndex() {
            if (this.$route.path.indexOf('schedule') > -1) {
                return 'schedule';
            }
            if (this.$route.path.indexOf('dashboard') > -1) {
                return 'plan';
            }
            return undefined;
        },
        disableSchedule() {
            return !(this.$route.path.indexOf('schedule') > -1);
        },
    },
    methods: {
        navPlan() {
            this.$router.push('/dashboard');
        },
        async signOut() {
            try {
                await logout(this);
                this.$store.commit('removeUser');
                this.$router.replace('/');
            } catch (e) {
                console.log(e);
                popupMessage(this, e.response);
            }
        },
    },
};
</script>

<style scoped>
    .nav {
        display: flex;
        box-sizing: border-box;
        padding: 0 50px;
    }

    .nav__user {
        position: absolute;
        right: 50px;
        height: 61px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }
</style>
