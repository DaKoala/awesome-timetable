<template>
    <div>
        <el-menu mode="horizontal" :default-active="activateIndex" class="nav">
            <el-menu-item index="1">My Plan</el-menu-item>
            <el-menu-item index="2" disabled>My Schedule</el-menu-item>
            <div class="nav__user">
                <el-dropdown>
                <span class="el-dropdown-link">
                    {{user.name}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>Sign out</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </el-menu>
        <div class="menu">
            <el-button type="primary" icon="el-icon-plus" @click="toggleDialog">
                Start a plan
            </el-button>
        </div>
        <div class="plan">
            <div class="plan__wrapper">
                <el-table :data="plans" stripe style="width: 100%">
                    <el-table-column prop="name" width="180" label="Name"></el-table-column>
                    <el-table-column prop="createdAt" width="250" label="Created at (YYYY-MM-DD)"
                    :formatter="dateFormatter">
                    </el-table-column>
                    <el-table-column prop="scheduleCount" width="100" label="Schedules">
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <el-dialog title="New Plan" :visible.sync="dialogVisible">
            <el-form :model="newPlan">
                <el-form-item label="Plan name" label-width="100">
                    <el-input v-model="newPlan.name"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="toggleDialog">Cancel</el-button>
                <el-button type="primary" @click="createPlan">Create</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import validateAuth from '../util/auth';
import formatTime from '../util/timeFormat';
import { newPlan, getPlan } from '../api/api';

export default {
    name: 'Dashboard',
    data() {
        return {
            dialogVisible: false,
            activateIndex: '1',
            newPlan: {
                name: '',
            },
            plans: [],
        };
    },
    computed: {
        user() {
            return this.$store.state.user;
        },
    },
    methods: {
        toggleDialog() {
            this.dialogVisible = !this.dialogVisible;
            this.newPlan.name = '';
        },
        dateFormatter(row) {
            return formatTime(row.createdAt);
        },
        createPlan() {
            this.dialogVisible = false;
            newPlan(this, this.newPlan.name)
                .then((res) => {
                    if (res.status === 200) {
                        this.plans.unshift(res.data.plan);
                    }
                });
        },
    },
    async created() {
        await validateAuth(this);
        const res = await getPlan(this);
        const plans = res.data;
        const cleanedPlans = plans.map(item => ({
            name: item.name,
            creator: item.creator,
            createdAt: item.createdAt,
            scheduleCount: item.schedules.length,
        }));
        this.plans.push(...cleanedPlans);
    },
};
</script>

<style lang="scss" scoped>
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

    .menu {
        width: 100%;
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .plan {
        width: 100%;
        padding: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
