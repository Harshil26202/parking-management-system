<template>
  <div>
    <div class="text-right" style="margin-top: 20px">
      <v-btn
        class="mr-4 mb-3"
        color="#2C3333"
        variant="tonal"
        @click="
          editDialog = true;
          isAdd = true;
          emptyVehicle();
        "
        ><b> Add Vehicle</b></v-btn
      >
    </div>
    <div v-if="!noDataDialog">
      <v-card>
        <v-data-table
          :items-per-page="itemsPerPage"
          :headers="headers"
          :items="vehicles"
          class="elevation-1"
          ><template v-slot:top>
            <v-dialog v-model="editDialog" max-width="500px">
              <v-card>
                <v-card-title class="mt-5 ml-7">
                  <span v-if="isAdd" class="text-h5">Add Vehicle</span>
                  <span v-else class="text-h5">Edit Vehicle Info</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="5">
                        <v-select
                          label="Vehicle Type"
                          v-model="vehicle.vehicle_type"
                          :items="vehicle_types"
                          variant="outlined"
                        >
                        </v-select>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          label="Vehicle Number"
                          v-model="vehicle.vehicle_number"
                          clearable
                          variant="outlined"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="1">
                        <v-icon
                          v-model="vehicle.isFavourite"
                          @click="vehicle.isFavourite = !vehicle.isFavourite"
                          size="large"
                          class="mt-3"
                        >
                          {{
                            vehicle.isFavourite
                              ? "mdi-star"
                              : "mdi-star-outline"
                          }}
                        </v-icon>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="#2C3333"
                    variant="text"
                    @click="
                      editDialog = false;
                      isAdd = false;
                    "
                  >
                    <b>Cancel</b>
                  </v-btn>
                  <v-btn
                    color="#2C3333"
                    variant="text"
                    :disabled="vehicle.vehicle_type === null || vehicle.vehicle_number === null"
                    @click="addVehicle();editDialog= false"
                    v-if="isAdd"
                    ><b> Add Vehicle </b></v-btn
                  ><v-btn
                    color="#2C3333"
                    variant="text"
                    @click="editVehicle(); editDialog = false"
                    v-else
                    ><b> Confirm Changes</b>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <!-- Delete Dialog -->
            <v-dialog v-model="deleteDialog" max-width="500px">
              <v-card>
                <v-card-title class="text-h6 mt-5 ml-5"
                  >Are you sure you want to delete this vehicle?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="#2C3333"
                    variant="text"
                    @click="deleteDialog = false"
                    ><b>Cancel</b></v-btn
                  >
                  <v-btn
                    color="#2C3333"
                    variant="text"
                    @click="deleteVehcile(selectedVehicle, selectedVehicleSlot);deleteDialog= false"
                    ><b>OK</b></v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
          <template v-slot:[`item.isFavourite`]="{ item }">
            <v-icon v-if="item.value.isFavourite"> mdi-star </v-icon>
            <v-icon v-else> mdi-star-outline </v-icon>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon
              class="me-2"
              @click="
                editDialog = true;
                isAdd = false;
                vehicle.vehicle_id = item.value.vehicle_id;
                vehicle.vehicle_type = item.value.vehicle_type;
                vehicle.vehicle_number = item.value.vehicle_number;
                vehicle.isFavourite = item.value.isFavourite;
              "
            >
              mdi-pencil
            </v-icon>
            <v-icon
              @click="
                deleteDialog = true;
                selectedVehicle = item.value.vehicle_id;
                selectedVehicleSlot = item.value.slot_id;
              "
            >
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
          No Wrong Parking!</b
        ></v-card-title
      >
      <v-container>
        <v-row>
          <v-col>
            <v-img
              :src="require('../../assets/giphy.gif')"
              height="450px"
            ></v-img>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      vehicles: [],
      ownerId: this.$store.state.owner.data.owner_id,
      noData: false,
      editDialog: false,
      isAdd: false,
      deleteDialog: false,
      selectedVehicle: null,
      selectedVehicleSlot: null,
      vehicle_types: ["car", "bike", "scooter"],
      vehicle: {
        vehicle_id: null,
        vehicle_type: null,
        vehicle_number: null,
        isFavourite: false,
      },
      itemsPerPage: 10,
      headers: [
        { title: "Id", align: "center", key: "vehicle_id", sortable: false },
        { title: "Vehicle Number", key: "vehicle_number" },
        { title: "Vehicle Type", align: "center", key: "vehicle_type" },
        { title: "Allotted Slot", align: "center", key: "slot_id" },
        { title: "Favourite", align: "center", key: "isFavourite" },
        { title: "Actions", key: "actions", align: "center", sortable: false },
      ],
    };
  },
  methods: {
    async getVehicles() {
      const data = await axios.post("http://localhost:8001/get-vehicle-by-id", {
        owner_id: this.ownerId,
      });
      if (data.data.length === 0) {
        return (this.noData = true);
      }
      this.vehicles = data.data;
    },
    async addVehicle() {
      this.vehicle.isFavourite = this.vehicle.isFavourite === null ? false: true
      axios
        .post("http://localhost:8001/add-vehicle", {
          vehicle: this.vehicle,
          owner_id: this.$store.state.owner.data.owner_id,
        })
        .then((response) => {
          if (response.status === 200) {
            this.text = "Vehicle Request sent Successfully!";
            this.getVehicles();
          }
        })
        .catch((error) => {
          if (error.response.status === 500) {
            this.text = "Internal server error";
          }
        });
    },
    async editVehicle() {
      this.vehicle.isFavourite = this.vehicle.isFavourite === null || this.vehicle.isFavourite === false ? false: true
      axios
        .post("http://localhost:8001/edit-vehicle", {
          vehicle: this.vehicle,
          owner_id: this.$store.state.owner.data.owner_id,
        })
        .then((response) => {
          if (response.status === 200) {
            this.text = "Vehicle Details updated Successfully!";
            this.getVehicles();
          }
        })
        .catch((error) => {
          if (error.response.status === 500) {
            this.text = "Internal server error";
          }
        });
    },
    async deleteVehcile(vehicleId, slotId) {
      axios
        .post("http://localhost:8001/delete-vehicle", {
          vehicle_id: vehicleId,
          owner_id: this.$store.state.owner.data.owner_id,
          slot_id: slotId,
        })
        .then((response) => {
          if (response.status === 200) {
            this.text = "Vehicle deleted Successfully!";
            for (let i = 0; i < this.vehicles.length; i++) {
              if (this.vehicles[i].vehicle_id === vehicleId) {
                this.vehicles.splice(i, 1);
              }
            }
          }
        })
        .catch((error) => {
          if (error.response.status === 500) {
            this.text = "Internal server error";
          }
        });
    },
    emptyVehicle(){
      this.vehicle.vehicle_id = null,
      this.vehicle.vehicle_number = null,
      this.vehicle.vehicle_type = null,
      this.vehicle.isFavourite = null
    }
  },
  beforeMount() {
    this.getVehicles();
  },
};
</script>
