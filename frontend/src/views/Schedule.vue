<template>
    <div>
        <nav-bar></nav-bar>
        <aside class="sidebar" v-loading="eventLoading">
            <el-button type="primary" icon="el-icon-date" @click="toggleForm">New event</el-button>
            <event-card v-for="event in events" :event="event" :key="event.name"
                        @deletecard="handleDeleteCard" @editcard="handleEditCard"></event-card>
        </aside>
        <main class="calendar">
            <div class="calendar__empty"></div>
            <div class="calendar__date-wrapper">
                <div class="calendar__date" v-for="date in dateOptions" :key="date">{{date}}</div>
            </div>
            <div class="calendar__time-wrapper">
                <div></div>
                <div class="calendar__time" v-for="(item, index) in Array(13)" :key="index">
                    {{appendTime(index)}}
                </div>
                <div></div>
            </div>
            <div class="calendar__main">
                <div class="calendar__cell" v-for="(item, index) in Array(98)"
                     :key="index"></div>
                <template v-for="event in events">
                    <div class="calendar__event" v-for="day in event.date" :key="event.name+day"
                         :style="positionEvent(day, event.fromTime, event.toTime)">
                        <p class="event__name">{{event.name}}</p>
                        <p class="event__support">
                            <i class="el-icon-time"></i>
                            {{formatTime(event.fromTime, event.toTime)}}
                        </p>
                        <p class="event__support" v-if="event.location">
                            <i class="el-icon-location-outline">
                                {{event.location}}
                            </i>
                        </p>
                    </div>
                </template>
            </div>
        </main>

        <el-dialog :title="isNewForm ? 'New event' : 'Edit event'" :visible.sync="eventFormVisible">
            <el-form :model="eventForm" label-width="80px">
                <el-form-item label="Plan">
                    <el-input v-model="eventForm.planName" disabled v-if="isNewForm"></el-input>
                    <el-input v-model="eventToBeEdited.planName" disabled v-else></el-input>
                </el-form-item>
                <el-form-item label="Event">
                    <el-input v-model="eventForm.name" prefix-icon="el-icon-edit-outline"
                              v-if="isNewForm"></el-input>
                    <el-input v-model="eventToBeEdited.newName" prefix-icon="el-icon-edit-outline"
                              v-else></el-input>
                </el-form-item>
                <el-form-item label="Date">
                    <el-checkbox-group v-model="eventForm.date" :min="1" :max="7" v-if="isNewForm">
                        <el-checkbox v-for="date in dateOptions" :label="date" :key="date">
                            {{date}}
                        </el-checkbox>
                    </el-checkbox-group>
                    <el-checkbox-group v-model="eventToBeEdited.date" :min="1" :max="7" v-else>
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
            }" v-if="isNewForm"></el-time-select>
                    <el-time-select placeholder="Start" v-model="eventToBeEdited.fromTime"
                                    :picker-options="{
                start: '07:00',
                step: '00:05',
                end: '21:00',
                maxTime: eventToBeEdited.toTime,
            }" v-else></el-time-select>
                    <span> - </span>
                    <el-time-select placeholder="End" v-model="eventForm.toTime"
                                    :picker-options="{
                start: '07:00',
                step: '00:05',
                end: '21:00',
                minTime: eventForm.fromTime,
            }" v-if="isNewForm"></el-time-select>
                    <el-time-select placeholder="End" v-model="eventToBeEdited.toTime"
                                    :picker-options="{
                start: '07:00',
                step: '00:05',
                end: '21:00',
                minTime: eventToBeEdited.fromTime,
            }" v-else></el-time-select>
                </el-form-item>
                <el-form-item label="Location">
                    <el-input v-model="eventForm.location" prefix-icon="el-icon-location"
                              v-if="isNewForm"></el-input>
                    <el-input v-model="eventToBeEdited.location" prefix-icon="el-icon-location"
                              v-else></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="toggleForm">Cancel</el-button>
                <el-button type="primary" @click="submitForm"
                           v-loading.fullscreen.lock="screenLoading">
                    {{isNewForm ? 'Create' : 'Edit'}}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import NavBar from '../components/NavBar.vue';
import EventCard from '../components/EventCard.vue';
import {
    getPlan,
    newEvent,
    deleteEvent,
    updateEvent,
} from '../api/api';
import popupMessage from '../util/message';
import { arrayTimeToString } from '../util/timeFormat';
import { deleteObjFromArr, deleteObjFromArrayAndInsert } from '../util/arrayHelper';

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
            isNewForm: true,
            eventFormVisible: false,
            eventToBeEdited: null,
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
        async handleDeleteCard(event) {
            await this.$confirm('The event will be deleted permanently, continue?', 'Warning', {
                confirmButtonText: 'Confirm',
                cancelButtonText: 'Cancel',
                type: 'warning',
            });
            try {
                const res = await deleteEvent(this, event.name);
                popupMessage(this, res, 'success');
                deleteObjFromArr(this.events, { name: event.name });
            } catch (e) {
                popupMessage(this, e.response);
            }
        },
        async handleEditCard(event) {
            this.toggleForm();
            this.isNewForm = false;
            this.eventToBeEdited = {
                oldName: event.name,
                newName: event.name,
                fromTime: arrayTimeToString(event.fromTime),
                toTime: arrayTimeToString(event.toTime),
                date: event.date.concat(),
                location: event.location,
                planName: this.eventForm.planName,
            };
        },
        formatTime(start, end) {
            const formatTimeHelper = time => (String(time).length > 1 ? String(time) : `0${time}`);
            const result = [];
            start.forEach(time => result.push(formatTimeHelper(time)));
            end.forEach(time => result.push(formatTimeHelper(time)));
            return `${result[0]}:${result[1]} - ${result[2]}:${result[3]}`;
        },
        appendTime(index) {
            const hour = index + 8;
            return (String(hour).length > 1 ? `${hour}:00` : `0${hour}:00`);
        },
        positionEvent(day, [startHour, startMin], [endHour, endMin]) {
            const ONE_FOURTEENTH = (100 / 14).toFixed(6);
            const left = this.dateOptions.indexOf(day) * ONE_FOURTEENTH * 2;
            const top = (startHour - 7 + startMin / 60) * ONE_FOURTEENTH;
            const width = ONE_FOURTEENTH * 2;
            const height = (endHour - startHour + (endMin - startMin) / 60) * ONE_FOURTEENTH;
            return {
                left: `${left}%`,
                top: `${top}%`,
                width: `${width}%`,
                height: `${height}%`,
            };
        },
        toggleForm() {
            this.eventFormVisible = !this.eventFormVisible;
            if (this.isNewForm) {
                this.eventForm.date = ['Mon'];
                this.eventForm.name = '';
                this.eventForm.fromTime = '';
                this.eventForm.toTime = '';
                this.eventForm.location = '';
            } else {
                this.eventToBeEdited = null;
            }
            this.isNewForm = true;
        },
        async submitForm() {
            try {
                this.screenLoading = true;
                if (this.isNewForm) {
                    const res = await newEvent(this, this.eventForm);
                    this.events.unshift(res.data);
                    this.$message({
                        message: 'Event created',
                        type: 'success',
                    });
                } else {
                    const res = await updateEvent(this, this.eventToBeEdited);
                    deleteObjFromArrayAndInsert(this.events,
                        {
                            name: this.eventToBeEdited.oldName,
                        },
                        res.data);
                    this.$message({
                        message: 'Event updated',
                        type: 'success',
                    });
                }
                this.screenLoading = false;
                this.toggleForm();
            } catch (e) {
                popupMessage(this, e.response);
                this.eventLoading = false;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
    @import "../assets/scss/main.scss";

    .sidebar {
        position: absolute;
        top: 69px;
        bottom: 0;
        left: 0;
        width: 300px;
        min-height: 600px;
        box-sizing: border-box;
        border-right: 1px solid #e6e6e6;
        padding: 20px 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow-x: scroll;
        & > * {
            flex-shrink: 0;
        }
    }

    .calendar {
        min-width: 800px;
        min-height: 600px;
        position: absolute;
        top: 69px;
        bottom: 0;
        left: 300px;
        right: 0;
        background: #e6e6e6;
        display: grid;
        grid-gap: 1px;
        grid-template-columns: 1fr 21fr;
        grid-template-rows: 1fr 14fr;
        grid-template-areas: "empty date"
                             "time main";
    }
    .calendar__empty {
        background: #fff;
        grid-area: empty;
    }
    .calendar__date-wrapper {
        background: #e6e6e6;
        grid-area: date;
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        grid-template-rows: 1fr;
        grid-gap: 1px;
    }
    .calendar__date {
        background: #fff;
        color: $main-text;
        font-size: $main-title;
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .calendar__time-wrapper {
        box-sizing: border-box;
        background: #fff;
        grid-area: time;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr repeat(13, 2fr) 1fr;
    }
    .calendar__time {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: $subtitle;
        color: $regular-text;
    }
    .calendar__main {
        position: relative;
        background: #e6e6e6;
        grid-area: main;
        display: grid;
        grid-gap: 1px;
        grid-template-columns: repeat(7, 1fr);
        grid-template-rows: repeat(14, 1fr);
    }
    .calendar__cell {
        background: #fff;
    }
    .calendar__event {
        position: absolute;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        color: $blue;
        border: 1px solid $blue;
        background: #ecf5ff;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .event__name {
        color: $blue;
        font-size: $subtitle;
        font-weight: bold;
        margin: 0;
    }
    .event__support {
        color: $blue;
        font-size: $support;
        margin: 0;
    }
</style>
