<template>
  <div style="background-color: #e7f6f2">
    <div class="d-flex align-center justify-center" style="height: 100vh">
      <v-sheet width="400" color="#E7F6F2" class="mx-auto text-center">
        <img src="../../assets/logo.png" class="mb-4 rounded-shaped" />
        <v-form fast-fail v-model="form" @submit.prevent="signup">
          <v-text-field
            variant="outlined"
            v-model="owner_name"
            :rules="[rules.required]"
            label="Owner Name"
          ></v-text-field>
          <v-text-field
            variant="outlined"
            v-model="contact_number"
            :rules="[rules.required, rules.contact, rules.isNumber]"
            label="Contact Number"
          ></v-text-field>
          <v-text-field
            variant="outlined"
            v-model="block_no"
            label="Block No"
            :rules="[rules.required, rules.block]"
            type="number"
          ></v-text-field>
          <v-text-field
            variant="outlined"
            v-model="email_id"
            :rules="[rules.required, rules.email]"
            label="Email Id"
            type="email"
          ></v-text-field>

          <v-text-field
            variant="outlined"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            v-model="password"
            :type="show ? 'text' : 'password'"
            :rules="[rules.required, rules.min]"
            label="password"
            clearable
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
            @click="snackbar = true"
            class="mt-2 text-white"
            ><b>Sign Up</b></v-btn
          >

          <v-snackbar v-model="snackbar" :timeout="timeout">
            {{ text }}

            <template v-slot:actions>
              <v-btn color="blue" variant="text" @click="snackbar = false">
                Close
              </v-btn>
            </template>
          </v-snackbar>
        </v-form>
        <div class="mt-2">
          <p class="text-body-2">
            Already have an account?
            <a href="/signin" style="color: #2c3333"><b>Sign In</b></a>
          </p>
        </div>
      </v-sheet>
    </div>
    <!-- <v-fade-transition hide-on-leave v-if="showModel" class="justify-center">
      <v-card
        v-if="dialog"
        append-icon="$close"
        class="mx-auto"
        elevation="16"
        max-width="500"
        title="Send a receipt"
      >
        <template v-slot:append>
          <v-btn icon="$close" variant="text" @click="dialog = false"></v-btn>
        </template>

        <v-divider></v-divider>

        <div class="py-12 text-center">
          <v-icon
            class="mb-6"
            color="success"
            icon="mdi-check-circle-outline"
            size="128"
          ></v-icon>

          <div class="text-h4 font-weight-bold">This receipt was sent</div>
        </div>

        <v-divider></v-divider>

        <div class="pa-4 text-end">
          <v-btn
            class="text-none"
            color="medium-emphasis"
            min-width="92"
            rounded
            variant="outlined"
            @click="dialog = false"
          >
            Close
          </v-btn>
        </div>
      </v-card>
    </v-fade-transition> -->
  </div>
</template>
<!-- 
<script setup>
import { ref } from "vue";

const dialog = ref(true);
</script> -->
<script>
import axios from "axios";
export default {
  data() {
    return {
    //   showModel: false,
      snackbar: false,
      text: "",
      timeout: 2000,
      form: false,
      owner_name: null,
      contact_number: null,
      block_no: null,
      email_id: null,
      password: null,
      loading: false,
      show: false,
      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => v.length >= 8 || "Min 8 characters",
        contact: (v) => v.length == 10 || "Enter 10 digit contact number",
        block: (v) => v > 0 || "Enter valid block number",
        isNumber: (v) => {
          const pattern = /^\d{10}$/;
          return pattern.test(v) || "Invalid Number";
        },
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        },
      },
    };
  },
  methods: {
    signup() {
      // Your login logic here

      if (!this.form) return;

      this.loading = true;

      axios
        .post("http://localhost:8001/signup", {
          owner_name: this.owner_name,
          contact_no: this.contact_number,
          block_no: this.block_no,
          email_id: this.email_id,
          password: this.password,
        })
        .then((response) => {
          this.$store.state.owner = response;
          if (response.status === 200) {
            this.text = "Request sent Successfully!";
            this.loading = false;
            this.timeout = 3000;
            // console.log(this.$store.state.owner.data.token);
            localStorage.setItem("token", this.$store.state.owner.data.token);
            setTimeout(() => {
              this.$router.push({ path: "/" });
            }, 3000);
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status === 400) {
            this.text = "Email already in use!";
          } else if (error.response.status === 500) {
            this.text = "Internal server error";
          }
          this.loading = false;
        });
    },
  },
};
</script>
