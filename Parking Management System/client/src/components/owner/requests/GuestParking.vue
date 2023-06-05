<template>
  <v-card>
    <v-card-title><b>Guest Parking</b></v-card-title>
    <v-container>
      <v-row>
        <v-col>
          <v-img
            :src="require('../../../assets/car.gif')"
            height="300px"
          ></v-img>
        </v-col>
        <v-col>
          <v-form fast-fail v-model="form" @submit.prevent="submitForm">
            <v-text-field
              v-model="from_time"
              type="datetime-local"
              :rules="[rules.required, rules.isvalidDate]"
              label="From"
              clearable
              required
              variant="outlined"
            ></v-text-field>
            <v-text-field
              v-model="to_time"
              type="datetime-local"
              label="To"
              :disabled="from_time === null"
              :rules="[rules.required, rules.datecheck, rules.isvalidDate]"
              clearable
              required
              variant="outlined"
            ></v-text-field>
            <v-select
              label="Request Slot"
              v-model="selectedSlot"
              :items="slots"
              variant="outlined"
            ></v-select>
            <v-btn
              :disabled="!form"
              :loading="loading"
              type="submit"
              color="#395B64"
              block
              @click="
                snackbar = true;
              "
              class="mt-2 text-white"
              ><b>Submit</b></v-btn
            >
          </v-form>
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
      selectedSlot: "any",
      from_time: null,
      to_time: null,
      slots: [],
      text: null,
      snackbar: false,
      timeout: 2000,
      form: false,
      rules: {
        required: (value) => !!value || "Required.",
        datecheck: (value) =>
          value > this.from_time || "Please select valid Input.",
        isvalidDate: (value) =>
          this.validateDatetime(value) || "Please enter a valid datetime.",
      },
    };
  },
  methods: {
    validateDatetime(datetimeString) {
      const regex = /^\d{4}-\d{2}-\d{2}T([01][0-9]|2[0-3]):[0-5][0-9]$/;
      if (!regex.test(datetimeString)) {
        return false;
      }

      const datetimeParts = datetimeString.split("T");
      const date = datetimeParts[0];
      const time = datetimeParts[1];
      const dateParts = date.split("-");
      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1;
      const day = parseInt(dateParts[2]);
      const timeParts = time.split(":");
      const hours = parseInt(timeParts[0]);
      const minutes = parseInt(timeParts[1]);
      const isValidDate = !isNaN(new Date(year, month, day).getTime());
      const isValidTime =
        hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
      return isValidDate && isValidTime;
    },

    async getSlots() {
      const data = await axios.get("http://localhost:8001/get-slots");
      this.slots.push("any");
      for (let i = 0; i < data.data.length; i++) {
        this.slots.push(data.data[i].slot_id.toString());
      }
    },
    async submitForm() {
      axios
        .post("http://localhost:8001/owner/guest-parking-request", {
          owner_id: this.$store.state.owner.data.owner_id,
          from_time: this.from_time,
          to_time: this.to_time,
          requested_slot: this.selectedSlot,
        })
        .then((response) => {
          if (response.status === 200) {
            this.text = "Guest Request Sent Successfully!";
            this.loading = false;
            this.timeout = 3000;
            this.emptyValue()
          }
        })
        .catch((error) => {
          if (error.response.status === 500) {
            this.text = "Internal server error";
          }
          this.loading = false;
        });
    },
    emptyValue(){
      this.from_time = null,
      this.to_time = null,
      this.selectedSlot = "any"
    }
  },
  beforeMount() {
    this.getSlots();
  },
};
</script>
