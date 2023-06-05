<template>
    <div style="background-color: #E7F6F2;">
        <div class="d-flex align-center justify-center" style="height: 100vh">
            <v-sheet width="400" color="#E7F6F2" class="mx-auto text-center">
                <img src="../../assets/logo.png" class="mb-4 rounded-shaped">
                <v-form fast-fail v-model="form"  @submit.prevent="signin">
                    <!-- <v-text-field variant="outlined" v-model="username" label="Email Id" required></v-text-field> -->

                    <v-text-field
                        v-model="email"
                        :readonly="loading"
                        :rules="[rules.required, rules.email]"
                        clearable
                        label="Email"
                        placeholder="Enter your Email"
                    ></v-text-field>

                    <!-- <v-text-field variant="outlined" v-model="password" label="password" required></v-text-field> -->

                    <v-text-field
                        :append-icon ="show ? 'mdi-eye' : 'mdi-eye-off'"
                        v-model="password"
                        :readonly="loading"
                        :rules="[rules.required, rules.min]"
                        :type="show ? 'text' : 'password'"
                        clearable
                        label="Password"
                        hint="At least 8 characters"
                        class="input-group--focused"
                        @click:append="show = !show"
                        placeholder="Enter your password"
                    ></v-text-field>
                    <!-- <a href="#" class="text-body-2 font-weight-regular">Forgot Password?</a> -->

                    <v-btn 
                        :disabled="!form"
                        :loading="loading"
                        type="submit" 
                        color="#395B64" 
                        block 
                        class="mt-2 text-white"
                        variant="elevated"                    
                        @click="snackbar = true"
                    ><b>Sign in</b></v-btn>
                    <v-snackbar
                        v-model="snackbar"
                        :timeout="timeout"
                        >
                        {{ text }}

                        <template v-slot:actions>
                            <v-btn
                            color="blue"
                            variant="text"
                            @click="snackbar = false"
                            >
                            Close
                            </v-btn>
                        </template>
                    </v-snackbar>
                </v-form>
                <div class="mt-2">
                    <p class="text-body-2">Don't have an account? <a href="/signup" style="color: #2C3333;"><b>Sign Up</b></a></p>
                </div>
            </v-sheet>
        </div>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    data() {
        return {

            snackbar: false,
            text: '',
            timeout: 2000,
            form: false,
            email: null,
            password: null,
            loading: false,
            show: false,
            rules: {
                required: value => !!value || 'Required.',
                min: v => v.length >= 8 || 'Min 8 characters',
                email: value => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(value) || 'Invalid e-mail.'
                },
                emailMatch: () => (`The email and password you entered don't match`),
            },
        };
    },
    methods: {  
        async signin() {

            if (!this.form) return

            this.loading = true
            
            await axios.post('http://localhost:8001/signin',{ email: this.email, password: this.password }).then(response => {
                this.$store.state.owner = response
                this.$store.dispatch("checkIsAdmin", {isAdmin: response.data.isAdmin});
                        
                localStorage.setItem("token", this.$store.state.owner.data.token);

                if(this.$store.getters['isAdmin']){
                    this.$router.push({ path: '/admin/home' })
                }
                else{
                    this.$router.push({ path: '/owner/home' })    
                }
            })
            .catch(error => {
                if(error.response.status === 404){
                    this.text = 'User not found'
                }
                else if(error.response.status === 500){
                    this.text = 'Internal server error'
                }
                else if(error.response.status === 401){
                    this.text = 'Password is invalid'
                }
                this.loading = false
            });
        }
    },
}
</script>
