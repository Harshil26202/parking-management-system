<template>
  <div v-if="!noDataDialog">
    <v-card>
      <v-data-table
        :items-per-page="itemsPerPage"
        :headers="headers"
        :items="vehicleList"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-dialog v-model="approveDialog" max-width="500px">
            <v-card>
              <v-container>
                <v-row>
                  <v-col class="text-h6 mt-2">Choose Slot </v-col>
                  <v-col
                    ><v-select
                      label="Request Slot"
                      v-model="selectedSlot"
                      :items="slots"
                      variant="outlined"
                    ></v-select
                  ></v-col>
                </v-row>
              </v-container>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="#2C3333"
                  variant="text"
                  @click="
                    approveDialog = false;
                  "
                  >Cancel</v-btn
                >
                <v-btn
                  color="#2C3333"
                  :disabled="selectedSlot === null"
                  variant="text"
                  @click="
                    approveDialog = false;
                    approveVehicle(selectedVehicle, selectedUser, selectedVehicleNumber, selectedSlot, selectedOwnerId);
                  "
                  >Confirm</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            class="me-2"
            @click="
              approveDialog = true;
              selectedVehicle = item.value.vehicle_id;
              selectedOwnerId = item.value.owner_id;
              selectedUser = item.value.owner_name;
              selectedVehicleNumber = item.value.vehicle_number;
            "
          >
            mdi-check
          </v-icon>
          <v-icon @click="rejectVehicle(item.value.vehicle_id, item.value.owner_name, item.value.vehicle_number, item.value.owner_id)">
            mdi-close
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
      vehicleList: [],
      text: "",
      timeout: 2000,
      snackbar: false,
      approveDialog: false,
      selectedSlot: null,
      selectedVehicle: null,
      selectedOwnerId: null,
      selectedUser: null,
      selectedVehicleNumber: null,
      slots: [],
      itemsPerPage: 10,
      headers: [
        { title: "Id", align: "center", key: "vehicle_id", sortable: false },
        { title: "Name", align: "center", key: "owner_name" },
        { title: "Block No", align: "center", key: "block_no" },
        { title: "Vehicle Type", align: "center", key: "vehicle_type" },
        { title: "Vehicle Number", align: "center", key: "vehicle_number" },
        { title: "Actions", key: "actions", align: "center", sortable: false },
      ],
    };
  },
  methods: {
    async getSlots() {
      const data = await axios.get(
        "http://localhost:8001/get-vehicle-parking-slots"
      );
      for (let i = 0; i < data.data.length; i++) {
        this.slots.push(data.data[i].slot_id);
      }
    },
    async getLogs() {
      const logs = await axios.get(
        "http://localhost:8001/admin/pending-vehicle"
      );
      if (logs.data.length === 0) {
        return (this.text = "Hurray! no requests pending");
      }
      this.vehicleList = logs.data;
    },
    async approveVehicle(vehicleId, ownerName, vehicleNumber, slotId, ownerId) {
      axios
        .post("http://localhost:8001/admin/approve-vehicle", {
          owner_id: ownerId,
          vehicle_id: vehicleId,
          slot_id: slotId,
          owner_name: ownerName,
          vehicle_number: vehicleNumber,
        })
        .then((response) => {
          if (response.status === 200) {
            this.text = "Vehicle added Successfully!";
            this.loading = false;
            this.timeout = 3000;
            for (let i = 0; i < this.vehicleList.length; i++) {
              if (this.vehicleList[i].vehicle_id === vehicleId) {
                this.vehicleList.splice(i, 1);
              }
            }
            for (let i = 0; i < this.slots.length; i++) {
              if (this.slots[i] === slotId) {
                this.slots.splice(i, 1);
              }
            }
            this.selectedSlot = null;
            this.selectedVehicle = null,
            this.selectedUser = null,
            this.selectedVehicleNumber = null
          }
        })
        .catch((error) => {
          if (error.response.status === 500) {
            this.text = "Internal server error";
          }
          this.loading = false;
        });
    },
    async rejectVehicle(vehicleId, ownerName, vehicleNumber, ownerId) {
      axios
        .post("http://localhost:8001/admin/reject-vehicle", {
          vehicle_id: vehicleId,
          owner_id: ownerId,
          owner_name: ownerName,
          vehicle_number: vehicleNumber
        })
        .then((response) => {
          if (response.status === 200) {
            this.text = "Vehicle rejected Successfully!";
            this.loading = false;
            this.timeout = 3000;
            for (let i = 0; i < this.vehicleList.length; i++) {
              if (this.vehicleList[i].vehicle_id === vehicleId) {
                this.vehicleList.splice(i, 1);
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
    this.getSlots();
  },
};
</script>
