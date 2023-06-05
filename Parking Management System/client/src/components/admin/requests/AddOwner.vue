<template>
  <div v-if="!noDataDialog">
    <v-card>
      <v-data-table
        :items-per-page="itemsPerPage"
        :headers="headers"
        :items="ownerList"
        class="elevation-1"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon class="me-2" @click="approveOwner(item.value.owner_id, item.value.owner_name, item.value.email_id)">
            mdi-check
          </v-icon>
          <v-icon @click="rejectOwner(item.value.owner_id, item.value.owner_name, item.value.email_id)"> mdi-close </v-icon>
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
      ownerList: [],
      text: "",
      timeout: 2000,
      snackbar: false,
      itemsPerPage: 10,
      headers: [
        { title: "Id", align: "center", key: "owner_id", sortable: false },
        { title: "Name", align: "center", key: "owner_name" },
        { title: "Block No", align: "center", key: "block_no" },
        { title: "Email id", align: "center", key: "email_id" },
        { title: "Actions", key: "actions", align: "center", sortable: false },
      ],

    };
  },
  methods: {
    async getLogs() {
      const logs = await axios.get("http://localhost:8001/admin/pending-owner");
      console.log(logs.data);
      if (logs === []) {
        return (this.text = "Hurray! no requests pending");
      }
      this.ownerList = logs.data;
    },
    async approveOwner(ownerId, ownerName, EmailId) {
      axios
        .post("http://localhost:8001/admin/approve-owner", {
          owner_id: ownerId,
          owner_name: ownerName,
          email_id: EmailId
        })
        .then((response) => {
          if (response.status === 200) {
            this.text = "Owner added Successfully!";
            this.loading = false;
            this.timeout = 3000;
            for(let i =0;i<this.ownerList.length;i++){
                if(this.ownerList[i].owner_id === ownerId){
                    this.ownerList.splice(i,1)
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
    async rejectOwner(ownerId, ownerName, EmailId) {
      axios
        .post("http://localhost:8001/admin/reject-owner", {
          owner_id: ownerId,
          owner_name: ownerName,
          email_id: EmailId
        })
        .then((response) => {
          if (response.status === 200) {
            this.text = "Owner rejected Successfully!";
            this.loading = false;
            this.timeout = 3000;
            for(let i =0;i<this.ownerList.length;i++){
                if(this.ownerList[i].owner_id === ownerId){
                    this.ownerList.splice(i,1)
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
