<template>
    <div v-if="!noDataDialog">
      <v-card>
        <v-data-table
          :items-per-page="itemsPerPage"
          :headers="headers"
          :items="guestParkingRequests"
          class="elevation-1"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon @click="approveRequest(item)">
              mdi-check
            </v-icon>
            <v-icon @click="rejectRequest(item)"> mdi-close </v-icon>
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
        guestParkingRequests: [],
        text: "",
        timeout: 2000,
        snackbar: false,
        noDataDialog: false,
        itemsPerPage: 10,
        headers: [
          { title: "Id", align: "center", key: "id", sortable: false },
          { title: "Owner Name", align: "center", key: "owner_name" },
          { title: "Block No", align: "center", key: "block_no" },
          { title: "From", align: "center", key: "from_time" },
          { title: "To", align: "center", key: "to_time" },
          { title: "Requested Slot", align: "center", key: "requested_slot" },
          { title: "Actions", key: "actions" , sortable: false },
        ],
  
      };
    },
    methods: {
      async getLogs() {
        const logs = await axios.get(
          "http://localhost:8001/admin/get-guest-parking"
        );
        if (logs.data.length === 0) {
          this.noDataDialog = true;
        }
        this.guestParkingRequests = logs.data;
      },
      async approveRequest(item) {
        axios
          .post("http://localhost:8001/admin/approve-guest-parking", {
            item: item,
          })
          .then((response) => {
            if (response.status === 200) {
              this.text = "Approved Successfully!";
              this.loading = false;
              this.timeout = 3000;
              for(let i =0;i<this.guestParkingRequests.length;i++){
                  if(this.guestParkingRequests[i].id === item.value){
                      this.guestParkingRequests.splice(i,1)
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
      async rejectRequest(item) {
        axios
          .post("http://localhost:8001/admin/reject-guest-parking", {
            item: item,
          })
          .then((response) => {
            if (response.status === 200) {
              this.text = "Rejected Successfully!";
              this.loading = false;
              this.timeout = 3000;
              for(let i =0;i<this.guestParkingRequests.length;i++){
                  if(this.guestParkingRequests[i].id === item.value){
                      this.guestParkingRequests.splice(i,1)
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
  