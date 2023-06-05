<template>
  <div style="background-color: #e7f6f2">
    <div class="d-flex align-center justify-center">
      <v-sheet width="400" color="#E7F6F2" class="mx-auto text-center">
        <h1 class="pb-10">Edit Profile</h1>
        <v-form fast-fail v-model="isFormChanged" @submit.prevent="updateOwner">
          <v-text-field
            variant="outlined"
            v-model="owner_name"
            :rules="[rules.required]"
            label="Owner Name"
            :model-value="owner_name"
          ></v-text-field>
          <v-text-field
            variant="outlined"
            v-model="contact_number"
            :rules="[rules.required, rules.contact, rules.isNumber]"
            :model-value="contact_number"
            label="Contact Number"
          ></v-text-field>
          <v-text-field
            variant="outlined"
            v-model="block_no"
            label="Block No"
            :rules="[rules.required, rules.block]"
            :model-value="block_no"
            type="number"
          ></v-text-field>
          <v-text-field
            variant="outlined"
            v-model="email_id"
            :rules="[rules.required, rules.email]"
            label="Email Id"
            :model-value="email_id"
            type="email"
          ></v-text-field>
          <v-btn
            :disabled="!isFormChanged"
            :loading="loading"
            type="submit"
            color="#395B64"
            block
            @click="snackbar = true"
            class="mt-2 text-white"
            ><b>Update</b></v-btn
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
      owner_name: this.$store.state.owner.data.owner_name,
      contact_number: this.$store.state.owner.data.contact_no,
      block_no: this.$store.state.owner.data.block_no,
      email_id: this.$store.state.owner.data.email_id,
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
  computed: {
  isFormChanged() {
    return (
      this.owner_name !== this.$store.state.owner.data.owner_name ||
      this.contact_number !== this.$store.state.owner.data.contact_no ||
      this.block_no !== this.$store.state.owner.data.block_no ||
      this.email_id !== this.$store.state.owner.email_id
    );
  },
},
  methods: {
    async updateOwner() {

      if (!this.isFormChanged) return;

      await axios
        .post("http://localhost:8001/update-profile", {
          owner_name: this.owner_name,
          contact_no: this.contact_number,
          block_no: this.block_no,
          email_id: this.email_id,
          password: this.password,
          owner_id: this.$store.state.owner.data.owner_id,
        })
        .then((response) => {
          if (response.status === 200) {
            this.text = "Data Change Successfully!";
            this.loading = false;
            this.timeout = 2000;
            this.$store.state.owner.data.owner_name = this.owner_name
            this.$store.state.owner.data.contact_no = this.contact_number
            this.$store.state.owner.data.block_no = this.block_no
            this.$store.state.owner.data.email_id = this.email_id
            console.log(this.$store.state.owner.data)
            setTimeout(() => {
               const redirectPath =  this.$store.state.isAdmin ? "/admin" : "/owner"
              this.$router.push({ path: redirectPath });
            }, 2000);
          }
        })
        .catch((error) => {
          console.log(error);
          this.text = "Internal server error";
          this.loading = false;
        });
    },
  },
};
</script>
