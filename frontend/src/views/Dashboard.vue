<template>
    <div>
        <el-menu mode="horizontal">
            <el-button type="primary">New Schedule</el-button>
            <el-dropdown>
                <span class="el-dropdown-link">
                    {{user.name}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>Sign out</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-menu>
    </div>
</template>

<script>
import validateAuth from '../util/auth';

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
    created() {
        validateAuth(this);
    },
};
</script>

<style scoped>

</style>
