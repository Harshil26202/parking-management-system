<template>
  <div
    style="
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      flex-wrap: wrap;
    "
  >
    <v-card max-width="300">
      <v-card-item title="Total Users"></v-card-item>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col cols="6">
            <v-icon
              color="#2C3333"
              icon="mdi-account-multiple"
              size="60"
            ></v-icon>
          </v-col>
          <v-col class="text-h3" cols="6"> {{ totalOwners }}</v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card max-width="300">
      <v-card-item title="Total Vehicles"> </v-card-item>

      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col cols="6">
            <v-icon color="#2C3333" icon="mdi-motorbike" size="60"></v-icon>
          </v-col>
          <v-col class="text-h3" cols="6"> {{ totalVehicles }} </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card max-width="300">
      <v-card-item title="Available Slots"> </v-card-item>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col cols="6">
            <v-icon color="#2C3333" icon="mdi-microsoft" size="60"></v-icon>
          </v-col>
          <v-col class="text-h3" cols="6"> {{ availableSlots }} </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-container class="mt-7">
      <v-row>
      <v-col>
        <Line :data="chartData.data1" :options="chartData.options" />
      </v-col>
      <v-col>
        <Line :data="chartData.data2" :options="chartData.options" />
      </v-col>
    </v-row>
    </v-container>
    </div>
</template>

<script>
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "vue-chartjs";
import * as chartData from "./chart1.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default {
  // eslint-disable-next-line
  components: { Line }, 
  data(){
    return {
    totalOwners: 0,
    totalVehicles: 0,
    availableSlots: 0,
    chartData
  }},
  methods: {
    async getData() {
      const data = await axios.get("http://localhost:8001/admin/home");
      // console.log(data.data);
      this.totalOwners = data.data.totalOwners;
      this.totalVehicles = data.data.totalVehicles;
      this.availableSlots = data.data.slotsAvailable;
    },
  },
  beforeMount() {
    this.getData();
  },
};
</script>

<style scoped>
.text-h3 {
    line-height: 3.8rem;
}
</style>
