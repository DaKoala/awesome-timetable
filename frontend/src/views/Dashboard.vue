<template>
    <div>
        <nav-bar></nav-bar>
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
                    <el-table-column label="Operation" width="200">
                        <template slot-scope="scope">
                            <el-button size="mini" type="success"
                                       @click="goToSchedule(scope.row.name)">
                                View
                            </el-button>
                            <el-button size="mini" type="danger">Delete</el-button>
                        </template>
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
import NavBar from '../components/NavBar.vue';
import validateAuth from '../util/auth';
import formatTime from '../util/timeFormat';
import { newPlan, getPlan } from '../api/api';

export default {
    name: 'Dashboard',
    components: {
        NavBar,
    },
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
        goToSchedule(name) {
            this.$router.push({
                path: `/schedule/${name}`,
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
        this.plans.push(...cleanedPlans.reverse());
    },
};
</script>

<style lang="scss" scoped>
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
