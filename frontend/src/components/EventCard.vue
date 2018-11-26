<template>
    <el-card class="card">
        <div class="card__header">{{event.name}}</div>
        <div class="card__item">
            <i class="el-icon-time"></i>
            {{formatDate(event.date)}}  {{formatTime(event.fromTime, event.toTime)}}
        </div>
        <div class="card__item">
            <i class="el-icon-location-outline"></i>
            {{event.location}}
        </div>
        <div class="card__button-wrapper">
            <el-button type="primary" size="small">Edit</el-button>
            <el-button type="danger" size="small">Delete</el-button>
        </div>
    </el-card>
</template>

<script>
export default {
    name: 'EventCard',
    props: {
        event: Object,
    },
    methods: {
        formatDate(dateArr) {
            const dateOptions = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const resultArr = [];
            let low = dateOptions.indexOf(dateArr[0]);
            let high = low;
            dateArr.forEach((date) => {
                const curr = dateOptions.indexOf(date);
                if (curr - high > 1) {
                    resultArr.push(low === high ? dateOptions[low] : `${dateOptions[low]}-${dateOptions[high]}`);
                    low = curr;
                    high = curr;
                } else {
                    high = curr;
                }
            });
            resultArr.push(low === high ? dateOptions[low] : `${dateOptions[low]}-${dateOptions[high]}`);
            return resultArr.join(',');
        },
        formatTime(start, end) {
            const formatTimeHelper = time => (String(time).length > 1 ? String(time) : `0${time}`);
            const result = [];
            start.forEach(time => result.push(formatTimeHelper(time)));
            end.forEach(time => result.push(formatTimeHelper(time)));
            return `${result[0]}:${result[1]} - ${result[2]}:${result[3]}`;
        },
    },
};
</script>

<style lang="scss" scoped>
    @import '../assets/scss/main';

    .card {
        width: 100%;
        box-sizing: border-box;
        margin-top: 20px;
    }

    .card__header {
        font-size: $title;
        color: $main-text;
    }

    .card__item {
        margin-top: 5px;
        font-size: $paragraph;
        color: $sub-text;
    }

    .card__button-wrapper {
        margin-top: 8px;
    }
</style>
