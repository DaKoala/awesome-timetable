<template>
    <div>
        <nav-bar></nav-bar>
        <aside class="sidebar" v-loading="eventLoading">
            <el-button type="primary" icon="el-icon-date" @click="toggleForm">New event</el-button>
            <event-card v-for="event in events" :event="event" :key="event.name"></event-card>
        </aside>

        <el-dialog title="New event" :visible.sync="eventFormVisible">
            <el-form :model="eventForm" label-width="80px">
                <el-form-item label="Plan">
                    <el-input v-model="eventForm.planName" disabled></el-input>
                </el-form-item>
                <el-form-item label="Event">
                    <el-input v-model="eventForm.name" prefix-icon="el-icon-edit-outline">
                    </el-input>
                </el-form-item>
                <el-form-item label="Date">
                    <el-checkbox-group v-model="eventForm.date" :min="1" :max="7">
                        <el-checkbox v-for="date in dateOptions" :label="date" :key="date">
                            {{date}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="Time">
                    <el-time-select placeholder="Start" v-model="eventForm.fromTime"
                                    :picker-options="{
                start: '07:00',
                step: '00:05',
                end: '21:00',
                maxTime: eventForm.toTime,
            }"></el-time-select>
                    <span> - </span>
                    <el-time-select placeholder="End" v-model="eventForm.toTime"
                                    :picker-options="{
                start: '07:00',
                step: '00:05',
                end: '21:00',
                minTime: eventForm.fromTime,
            }"></el-time-select>
                </el-form-item>
                <el-form-item label="Location">
                    <el-input v-model="eventForm.location" prefix-icon="el-icon-location">
                    </el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="toggleForm">Cancel</el-button>
                <el-button type="primary" @click="submitForm"
                           v-loading.fullscreen.lock="screenLoading">
                    Create
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import NavBar from '../components/NavBar.vue';
import EventCard from '../components/EventCard.vue';
import { getPlan, newEvent } from '../api/api';

export default {
    name: 'Schedule',
    components: { NavBar, EventCard },
    data() {
        return {
            name: '',
            creator: '',
            dateOptions: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            screenLoading: false,
            events: [],
            eventLoading: false,
            eventFormVisible: false,
            eventForm: {
                planName: this.$route.params.scheduleName,
                date: ['Mon'],
                name: '',
                fromTime: '',
                toTime: '',
                location: '',
            },
        };
    },
    async created() {
        try {
            const res = await getPlan(this, this.$route.params.scheduleName);
            const { plan } = res.data;
            this.events = res.data.events.reverse();
            this.name = plan.name;
            this.creator = plan.creator;
        } catch (e) {
            this.$router.push('/dashboard');
        }
    },
    methods: {
        toggleForm() {
            this.eventFormVisible = !this.eventFormVisible;
            this.eventForm.date = ['Mon'];
            this.eventForm.name = '';
            this.eventForm.fromTime = '';
            this.eventForm.toTime = '';
            this.eventForm.location = '';
        },
        async submitForm() {
            try {
                this.screenLoading = true;
                const res = await newEvent(this, this.eventForm);
                this.events.unshift(res.data);
                this.screenLoading = false;
                this.$message({
                    message: 'Event created',
                    type: 'success',
                });
                this.toggleForm();
            } catch (e) {
                this.$message({
                    message: 'Network error',
                    type: 'error',
                });
                this.eventLoading = false;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
    @import "../assets/scss/main.scss";

    .sidebar {
        position: fixed;
        top: 69px;
        bottom: 0;
        left: 0;
        width: 300px;
        box-sizing: border-box;
        border-right: 1px solid #e6e6e6;
        padding: 20px 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>
