<template>
  <div v-if="!noDataDialog">
    <v-card>
      <v-data-table
        :items-per-page="itemsPerPage"
        :headers="headers"
        :items="wrongParkingList"
        class="elevation-1"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon class="me-2" @click="resolveParking(item)"> mdi-check </v-icon>
          <!-- <v-icon @click="rejectP(item)"> mdi-close </v-icon> -->
        </template>
      </v-data-table>
      <v-snackbar v-model="snackbar" :timeout="timeout">
        {{ text }}

        <template v-slot:actions>
          <v-btn color="blue" variant="text" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-card>
  </div>
  <v-card v-else>
    <v-card-title align="center"
      ><b
        >Hurray!<br />
        No Wrong Parking!</b
      ></v-card-title
    >
    <v-container>
      <v-row>
        <v-col>
          <v-img
            :src="require('../../../assets/giphy.gif')"
            height="450px"
          ></v-img>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      wrongParkingList: [],
      text: "",
      timeout: 2000,
      ownerId: this.$store.state.owner.data.owner_id,
      noDataDialog: false,
      itemsPerPage: 10,
      headers: [
        { title: "Id", align: "center", key: "id", sortable: false },
        { title: "Vehicle Number", key: "vehicle_number" },
        { title: "Vehicle Type", align: "center", key: "vehicle_type" },
        {
          title: "Time",
          align: "center",
          key: "event_time",
        },
        { title: "Actions", key: "actions", align: "center", sortable: false },
      ],
    };
  },
  methods: {
    async getLogs() {
      const logs = await axios.post(
        "http://localhost:8001/owner/request/resolve-wrong-parking",
        { owner_id: this.ownerId }
      );
      console.log(logs.data);
      if (logs.data.length === 0) {
        this.noDataDialog = true;
      }
      this.wrongParkingList = logs.data;
    },
    async resolveParking(item){
      axios
        .post("http://localhost:8001/owner/resolve-parking", {
          item: item,
        })
        .then((response) => {
          if (response.status === 200) {
            this.text = "Parking Request Resolved Successfully!";
            this.loading = false;
            this.timeout = 3000;
            for(let i =0;i<this.wrongParkingList.length;i++){
                if(this.wrongParkingList[i].id === item.value){
                    this.wrongParkingList.splice(i,1)
                }
            }
          }
        })
        .catch((error) => {
          if (error.response.status === 500) {
            this.text = "Internal server error";
          }
          this.loading = false;
        });
    }
  },
  beforeMount() {
    this.getLogs();
  },
};
</script>
