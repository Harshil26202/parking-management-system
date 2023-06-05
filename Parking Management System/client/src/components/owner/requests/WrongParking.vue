<template>
  <v-card height="570px">
    <v-card-title><b>Wrong Parking</b></v-card-title>
    <v-container>
      <v-row>
        <v-col>
          <v-img
            :src="require('../../../assets/no-parking-and-stop-vector.jpg')"
            height="300px"
          ></v-img>
        </v-col>
        <v-col>
          <v-text-field
            variant="outlined"
            v-model="vehicle_number"
            clearable
            label="Vehicle Number"
            placeholder="GJ01HK1000"
          ></v-text-field>
          <v-btn
            :disabled="vehicle_number === null"
            :loading="loading"
            type="submit"
            color="#395B64"
            block
            @click="
              wrongVehicle();
              snackbar = true;
            "
            class="mt-2 text-white"
            ><b>Submit</b></v-btn
          >
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ text }}

      <template v-slot:actions>
        <v-btn color="blue" variant="text" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      vehicle_number: null,
      text: null,
      snackbar: false,
      timeout: 2000,
    };
  },
  methods: {
    async wrongVehicle() {
      await axios
        .post("http://localhost:8001/owner/complain-for-wrong-parking", {
          vehicle_no: this.vehicle_number,
          owner_id: this.$store.state.owner.data.owner_id,
        })
        .then((response) => {
          if (response.status === 200) {
            this.text = "Request sent Successfully!";
            this.loading = false;
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status === 404) {
            this.text = "Vehicle Not Found";
          } else {
            this.text = "Internal Server Error";
          }
        });
    },
  },
};
</script>
