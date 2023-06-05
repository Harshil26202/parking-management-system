<template>
  <div style="background-color: #e7f6f2">
    <div class="d-flex align-center justify-center">
      <v-sheet width="400" color="#E7F6F2" class="mx-auto text-center">
        <h1 class="pb-10">Reset Password</h1>
        <v-form>
          <v-text-field
            variant="outlined"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :disabled="isMatch"
            v-model="oldPassword"
            :type="show1 ? 'text' : 'password'"
            :rules="[rules.required, rules.min]"
            label="Old Password"
            clearable
            hint="At least 8 characters"
            class="input-group--focused"
            @click:append="show1 = !show1"
            placeholder="Enter your old password"
          ></v-text-field>
          <v-btn
            :loading="loading"
            type="submit"
            :disabled="isMatch"
            color="#395B64"
            block
            class="mt-2 mb-6 text-white"
            @click="isMatching();snackbar = true;"
          >
            Check
          </v-btn>
          <v-text-field
            variant="outlined"
            :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
            v-model="newPassword"
            :type="show2 ? 'text' : 'password'"
            :rules="[rules.required, rules.min, rules.oldmatch]"
            label="new password"
            :disabled="!isMatch"
            clearable
            class="input-group--focused"
            @click:append="show2 = !show2"
            placeholder="Enter New password"
          ></v-text-field>
          <v-text-field
            variant="outlined"
            :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
            v-model="confirmNewPassword"
            :type="show3 ? 'text' : 'password'"
            :rules="[rules.required, rules.min, rules.match]"
            label="confirm new password"
            clearable
            :disabled="!isMatch"
            class="input-group--focused"
            @click:append="show3 = !show3"
            placeholder="Confirm New Password"
          ></v-text-field>
          <v-btn
            :disabled="!isMatch"
            :loading="loading"
            type="submit"
            color="#395B64"
            block
            @click="updatePassword();snackbar = true;"
            class="mt-2 text-white"
            ><b>Update</b></v-btn
          >
        </v-form>

        <v-snackbar v-model="snackbar" :timeout="timeout">
          {{ text }}
          <template v-slot:actions>
            <v-btn color="blue" variant="text" @click="snackbar = false">
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </v-sheet>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      snackbar: false,
      text: "",
      timeout: 2000,
      oldPassword: null,
      newPassword: null,
      confirmNewPassword: null,
      loading: false,
      show1: false,
      show2: false,
      show3: false,
      isMatch: false,
      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => v.length >= 8 || "Min 8 characters",
        oldmatch: (v) => v !== this.oldPassword || "Choose Different Password",
        match: (v) => v === this.newPassword || "Not Matching",
      },
    };
  },
  methods: {
    async isMatching() {
      this.loading = true;
      await axios
        .post("http://localhost:8001/check-password", {
          email: this.$store.state.owner.data.email_id,
          password: this.oldPassword,
        })
        .then((response) => {
          if (response.status === 200) {
            this.isMatch = true;
            this.text = "password matched!";
            this.loading = false;
          }
        })
        .catch((error) => {
          if (error.response.status === 500) {
            this.text = "Internal server error";
          } else if (error.response.status === 401) {
            this.text = "Password is invalid";
          }
          this.loading = false;
        });
    },
    async updatePassword() {
      this.loading = true;
      await axios
        .post("http://localhost:8001/update-password", {
          email: this.$store.state.owner.data.email_id,
          password: this.newPassword,
        })
        .then((response) => {
          if (response.status === 200) {
            console.log("changed");
            this.text = "password changed successfully!";
            this.loading = false;
          }
        })
        .catch((error) => {
          if (error) {
            this.text = "Internal server error";
          }
          this.loading = false;
        });
    },
  },
};
</script>
