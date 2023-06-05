<template>
  <div v-if="!noDataDialog">
    <v-card>
      <v-data-table
        :items-per-page="itemsPerPage"
        :headers="headers"
        :items="penaltyList"
        class="elevation-1"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon class="me-2" @click="resolvePenalty(item)">
            mdi-check
          </v-icon>
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
        No Pending Penalties!</b
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
      penaltyList: [],
      text: "",
      timeout: 2000,
      ownerId: this.$store.state.owner.data.owner_id,
      noDataDialog: false,
      itemsPerPage: 10,
      headers: [
        { title: "Id", align: "center", key: "vehicle_id", sortable: false },
        { title: "Vehicle Number", key: "vehicle_number" },
        { title: "Vehicle Type", align: "center", key: "vehicle_type" },
        {
          title: "Time",
          align: "center",
          key: "event_time",
        },
        { title: "Penalty Amount", align: "center", key: "penalty_amount" },
        { title: "Actions", key: "actions", align: "center", sortable: false },
      ],
    };
  },
  methods: {
    async getLogs() {
      const logs = await axios.post(
        "http://localhost:8001/owner/request/get-penalties",
        { owner_id: this.ownerId }
      );
      if (logs.data.length === 0) {
        this.noDataDialog = true;
      }
      for (let i = 0; i < logs.data.length; i++) {
        if (logs.data[i].penalty_amount === null) {
          logs.data[i].penalty_amount = 0;
        }
      }
      this.penaltyList = logs.data;
    },
    async resolvePenalty(item){
      axios
        .post("http://localhost:8001/owner/resolve-penalty", {
          item: item,
        })
        .then((response) => {
          if (response.status === 200) {
            this.text = "Penalty Request Sent Successfully!";
            this.loading = false;
            this.timeout = 3000;
            for(let i =0;i<this.penaltyList.length;i++){
                if(this.penaltyList[i].id === item.value){
                    this.penaltyList.splice(i,1)
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
