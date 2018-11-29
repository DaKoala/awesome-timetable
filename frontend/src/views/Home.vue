<template>
    <div class="container">
        <header class="header">
            <h1 class="header__title">Awesome Timetable</h1>
            <p class="header__subtitle">An ideal timetable with backup plans.</p>
        </header>
        <main class="user">
            <h2 class="user__title">{{title}}</h2>
            <el-form :model="formAccount" ref="formAccount" :rules="rules" status-icon
                     label-width="100px" label-position="left">
                <!-- login form -->
                <el-form-item label="Email" v-if="isLogin">
                    <el-input v-model="formAccount.email"></el-input>
                </el-form-item>
                <el-form-item label="Password" v-if="isLogin">
                    <el-input v-model="formAccount.password" type="password"></el-input>
                </el-form-item>
                <!-- register form -->
                <el-form-item label="Email" prop="email" v-show="!isLogin">
                    <el-input v-model="formAccount.email" placeholder="Your email address">
                    </el-input>
                </el-form-item>
                <el-form-item label="Password" prop="password" v-show="!isLogin">
                    <el-input v-model="formAccount.password" type="password"
                              placeholder="8-16 characters"></el-input>
                </el-form-item>
                <el-form-item label="Confirm" prop="confirm" v-show="!isLogin">
                    <el-input v-model="formAccount.confirm" type="password"
                              placeholder="Confirm your password"></el-input>
                </el-form-item>
                <el-form-item label="Name" prop="name" v-show="!isLogin">
                    <el-input v-model="formAccount.name"
                              placeholder="4-16 characters, visible to other users"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('formAccount')">
                        {{btnPrimary}}
                    </el-button>
                    <el-button @click="changeForm('formAccount')">
                        {{btnSub}}
                    </el-button>
                </el-form-item>
            </el-form>
        </main>
    </div>
</template>

<script>
// @ is an alias to /src
import { checkExist, register, login } from '../api/api';
import validateAuth from '../util/auth';
import popupMessage from '../util/message';

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
                name: '',
            },
            validateEmail: (rule, value, cb) => {
                const regex = /^.+@.+\..+$/;
                if (!regex.test(value)) {
                    cb(new Error('Please enter correct email address'));
                }
                checkExist(this, 'email', value)
                    .then((res) => {
                        if (res.data.valid) {
                            cb();
                        } else {
                            cb(new Error('Existing email address'));
                        }
                    })
                    .catch(() => {
                        cb(new Error('Server error'));
                    });
            },
            validateName: (rule, value, cb) => {
                checkExist(this, 'name', value)
                    .then((res) => {
                        if (res.data.valid) {
                            cb();
                        } else {
                            cb(new Error('Existing name'));
                        }
                    })
                    .catch(() => {
                        cb(new Error('Server error'));
                    });
            },
            checkConfirm: (rule, value, cb) => {
                if (value === this.formAccount.password) {
                    cb();
                } else {
                    cb(new Error('This should be consistent to the password above'));
                }
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
        rules() {
            return {
                email: [
                    {
                        required: true,
                        message: 'Email is required',
                        trigger: 'blur',
                    },
                    {
                        validator: this.validateEmail,
                        trigger: 'blur',
                    },
                ],
                password: [
                    {
                        required: true,
                        message: 'Password is required',
                        trigger: 'blur',
                    },
                    {
                        min: 8,
                        max: 16,
                        message: 'Password should be 8-16 characters',
                        trigger: 'blur',
                    },
                ],
                confirm: [
                    {
                        required: true,
                        message: 'You should confirm your password',
                        trigger: 'blur',
                    },
                    {
                        validator: this.checkConfirm,
                        trigger: 'blur',
                    },
                ],
                name: [
                    {
                        required: true,
                        message: 'Name is required',
                        trigger: 'blur',
                    },
                    {
                        min: 4,
                        max: 16,
                        message: 'Name should be 4-16 characters',
                        trigger: 'blur',
                    },
                    {
                        validator: this.validateName,
                        trigger: 'blur',
                    },
                ],
            };
        },
    },
    methods: {
        async submitForm(formName) {
            if (!this.isLogin) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        register(this, {
                            email: this.formAccount.email,
                            password: this.formAccount.password,
                            name: this.formAccount.name,
                        })
                            .then((res) => {
                                if (res.status === 200) {
                                    this.$store.commit('updateUser', res.data.user);
                                    this.$router.replace('dashboard');
                                }
                            })
                            .catch((e) => {
                                popupMessage(this, e.response);
                            });
                    }
                });
            } else {
                login(this, {
                    email: this.formAccount.email,
                    password: this.formAccount.password,
                })
                    .then((res) => {
                        if (res.status === 200 && res.data.user) {
                            this.$store.commit('updateUser', res.data.user);
                            this.$router.replace('/dashboard');
                        }
                    })
                    .catch((e) => {
                        popupMessage(this, e.response);
                    });
            }
        },
        changeForm(formName) {
            this.$refs[formName].clearValidate();
            this.isLogin = !this.isLogin;
        },
    },
    created() {
        validateAuth(this);
    },
};
</script>

<style lang="scss" scoped>
    @import "../assets/scss/main";
    .container {
        display: flex;
        box-sizing: border-box;
        padding: 20vh 20%;
    }

    .header {
        min-width: 400px;
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
        min-width: 450px;
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
