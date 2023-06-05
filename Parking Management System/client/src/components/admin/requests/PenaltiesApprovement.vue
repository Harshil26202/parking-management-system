<template>
  <div v-if="!noDataDialog">
    <v-card>
      <v-data-table
        :items-per-page="itemsPerPage"
        :headers="headers"
        :items="penaltiesLogs"
        class="elevation-1"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon @click="approvePenalties(item)">
            mdi-check
          </v-icon>
          <v-icon @click="rejectPenalties(item)"> mdi-close </v-icon>
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
        No Pending Requests!</b
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
      penaltiesLogs: [],
      text: "",
      timeout: 2000,
      snackbar: false,
      noDataDialog: false,
      itemsPerPage: 10,
      headers: [
        { title: "Id", align: "center", key: "id", sortable: false },
        { title: "Owner Name", align: "center", key: "owner_name" },
        { title: "Block No", align: "center", key: "block_no" },
        { title: "Vehicle Type", align: "center", key: "vehicle_type" },
        { title: "Vehicle Number", align: "center", key: "vehicle_number" },
        { title: "Penalty Amount", align: "center", key: "penalty_amount" },
        { title: "Actions", key: "actions" , sortable: false },
      ],

    };
  },
  methods: {
    async getLogs() {
      const logs = await axios.get(
        "http://localhost:8001/admin/pending-penalties"
      );
      if (logs.data.length === 0) {
        this.noDataDialog = true;
      }
      for (let i = 0; i < logs.data.length; i++) {
        if (logs.data[i].penalty_amount === null) {
          logs.data[i].penalty_amount = 0;
        }
      }
      this.penaltiesLogs = logs.data;
    },
    async approvePenalties(item) {
      console.log(item);
      axios
        .post("http://localhost:8001/admin/approve-penalty", {
          item: item,
        })
        .then((response) => {
          if (response.status === 200) {
            this.text = "Penalty approved Successfully!";
            this.loading = false;
            this.timeout = 3000;
            for(let i =0;i<this.penaltiesLogs.length;i++){
                if(this.penaltiesLogs[i].id === item.value){
                    this.penaltiesLogs.splice(i,1)
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
    },
    async rejectPenalties(item) {
      axios
        .post("http://localhost:8001/admin/reject-penalty", {
          item: item,
        })
        .then((response) => {
          if (response.status === 200) {
            this.text = "Penalty rejected Successfully!";
            this.loading = false;
            this.timeout = 3000;
            for(let i =0;i<this.penaltiesLogs.length;i++){
                if(this.penaltiesLogs[i].id === item.value){
                    this.penaltiesLogs.splice(i,1)
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
    },
  },
  beforeMount() {
    this.getLogs();
  },
};
</script>
