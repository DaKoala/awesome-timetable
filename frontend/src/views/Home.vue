<template>
    <div>
        <el-form :model="formAccount" label-width="80px">
            <el-form-item label="Email">
                <el-input v-model="formAccount.email"></el-input>
            </el-form-item>
            <el-form-item label="Password">
                <el-input v-model="formAccount.password" type="password"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
// @ is an alias to /src
export default {
    name: 'home',
    components: {},
    data() {
        return {
            formAccount: {
                email: '',
                password: '',
            },
        };
    },
};
</script>
