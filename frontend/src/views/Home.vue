<template>
    <div class="container">
        <header class="header">
            <h1 class="header__title">Awesome Timetable</h1>
            <p class="header__subtitle">An ideal timetable with backup plans.</p>
        </header>
        <main class="user">
            <h2 class="user__title">{{title}}</h2>
            <el-form :model="formAccount" label-width="100px" label-position="left">
                <el-form-item label="Email">
                    <el-input v-model="formAccount.email"></el-input>
                </el-form-item>
                <el-form-item label="Password">
                    <el-input v-model="formAccount.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="Confirm" v-if="!isLogin">
                    <el-input v-model="formAccount.confirm" type="password"></el-input>
                </el-form-item>
                <el-form-item label="Name" v-if="!isLogin">
                    <el-input v-model="formAccount.name"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary">{{btnPrimary}}</el-button>
                    <el-button @click="changeForm">{{btnSub}}</el-button>
                </el-form-item>
            </el-form>
        </main>
    </div>
</template>

<script>
// @ is an alias to /src
export default {
    name: 'home',
    components: {},
    data() {
        return {
            isLogin: true,
            formAccount: {
                email: '',
                password: '',
                confirm: '',
            },
        };
    },
    computed: {
        title() {
            return this.isLogin ? 'Log in' : 'Register';
        },
        btnPrimary() {
            return this.isLogin ? 'Log in' : 'Create Account';
        },
        btnSub() {
            return this.isLogin ? 'Sign up >>>' : 'Log in >>>';
        },
    },
    methods: {
        changeForm() {
            this.isLogin = !this.isLogin;
        },
    },
};
</script>

<style lang="scss" scoped>
    @import "../assets/scss/main";
    .container {
        display: flex;
        box-sizing: border-box;
        padding: 30vh 20%;
    }

    .header {
        box-sizing: border-box;
        width: 50%;

    }
    .header__title {
        font-size: 2.5 * $main-title;
        color: $blue;
    }
    .header__subtitle {
        font-size: $main-title;
        color: $main-text;
    }

    .user {
        box-sizing: border-box;
        width: 50%;
        padding: 0 5%;
        border: 1px solid $first-border;
        border-radius: 10px;
        box-shadow: 8px 8px 4px $fourth-border;
    }
    .user__title {
        font-size: 1.5 * $main-title;
        text-align: center;
        color: $main-text;
    }
</style>
