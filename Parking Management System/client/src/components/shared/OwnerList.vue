<template>
  <div>
    <v-card color="#A5C9CA">
      <v-container fluid>
        <v-row align-content="center">
          <v-col cols="5">
            <v-autocomplete
              variant="solo"
              v-model="values"
              :items="searchCategories"
              label="Search By"
            ></v-autocomplete>
          </v-col>
          <v-col cols="4">
            <v-text-field
              label="value"
              variant="outlined"
              clearable
              v-model="searchValue"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-btn
              size="x-large"
              variant="tonal"
              @click="search()"
              :disabled="
                values === 'All' || searchValue === null || searchValue === ''
              "
              ><v-icon icon="mdi-account-search"></v-icon>Search</v-btn
            >
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <v-card v-if="!noDataDialog">
      <v-data-table
        :items-per-page="itemsPerPage"
        :headers="headers"
        :items="ownerList"
        class="elevation-1"
        @click:row="showVehicle"
      >
        <template v-slot:top>
          <v-dialog v-model="displayVehicle" width="700px">
            <v-card>
              <v-container>
                <v-row justify="center">
                  <h3 style="color: #2c3333">{{ vehicleOwner }}</h3>
                </v-row>
                <v-row v-if="vehicleList.length !== 0">
                  <v-data-table
                    :items-per-page="itemsPerPage1"
                    :headers="headers1"
                    :items="vehicleList"
                    class="elevation-1"
                  >
                    <template v-if="isAdmin" v-slot:[`item.actions`]="{ item }">
                      <v-icon
                        class="me-2"
                        @click="
                          editVehicleDialog = true;
                          vehicle.vehicle_id = item.value.vehicle_id;
                          vehicle.vehicle_owner_id = vehicleOwnerId;
                          vehicle.vehicle_type = item.value.vehicle_type;
                          vehicle.vehicle_number = item.value.vehicle_number;
                          vehicle.isFavourite = item.value.isFavourite;
                        "
                      >
                        mdi-pencil
                      </v-icon>
                      <v-icon
                        @click="
                          deleteVehicleDialog = true;
                          vehicle.alloted_slot = item.value.slot_id;
                          vehicle.vehicle_id = item.value.vehicle_id;
                          vehicle.vehicle_owner_id = vehicleOwnerId;
                        "
                      >
                        mdi-close
                      </v-icon>
                    </template></v-data-table
                  >
                </v-row>
                <v-row v-else justify="center" class="pt-3">
                  <p>No Vehicle Found.</p>
                </v-row>
              </v-container>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="#2C3333"
                  variant="text"
                  @click="displayVehicle = false"
                >
                  <b>Cancel</b>
                </v-btn>
              </v-card-actions>
            </v-card>
            <v-dialog v-model="editVehicleDialog" max-width="500px">
              <v-card>
                <v-card-title class="mt-5 ml-7">
                  <span class="text-h5">Edit Vehicle Info</span>
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
                    @click="editVehicleDialog = false"
                  >
                    <b>Cancel</b>
                  </v-btn>
                  <v-btn
                    color="#2C3333"
                    variant="text"
                    @click="
                      editVehicle();
                      editVehicleDialog = false;
                    "
                    ><b> Confirm Changes</b>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="deleteVehicleDialog" max-width="500px">
              <v-card>
                <v-card-title class="text-h6 mt-5 ml-5"
                  >Are you sure you want to delete this vehicle?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="#2C3333"
                    variant="text"
                    @click="deleteVehicleDialog = false"
                    ><b>Cancel</b></v-btn
                  >
                  <v-btn
                    color="#2C3333"
                    variant="text"
                    @click="deleteVehicle(); deleteVehicleDialog = false"
                    ><b>OK</b></v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-dialog>
        </template>
        <template v-if="isAdmin" v-slot:[`item.actions`]="{ item }">
          <v-icon class="me-2" @click="editOwner(item)"> mdi-pencil </v-icon>
          <v-icon @click="deleteOwner(item)"> mdi-close </v-icon>
        </template>
      </v-data-table>
    </v-card>
    <v-card v-else>
      <section class="page_404">
        <div class="container">
          <div class="row">
            <div class="col-sm-12">
              <div class="col-sm-10 col-sm-offset-1 text-center">
                <div class="four_zero_four_bg"></div>
                <div class="contant_box_404">
                  <h3 class="h2">No data available</h3>
                  <a
                    v-if="isAdmin"
                    href="http://localhost:8080/admin/search"
                    class="link_404"
                    >Try Again</a
                  >
                  <a
                    v-else
                    href="http://localhost:8080/owner/search"
                    class="link_404"
                    >Try Again</a
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      ownerList: [],
      vehicleList: [],
      vehicleOwner: null,
      dialog: false,
      editVehicleDialog: false,
      deleteVehicleDialog: false,
      vehicleOwnerId: null,
      displayVehicle: false,
      searchOwner: null,
      searchCategories: ["All", "Vehicle", "Name", "Block No"],
      values: "All",
      searchValue: null,
      isAdmin: this.$store.state.owner.data.isAdmin,
      noDataDialog: false,
      itemsPerPage: 10,
      headers: [
        { title: "Id", align: "center", key: "owner_id", sortable: false },
        { title: "Name", align: "center", key: "owner_name" },
        { title: "Block No", align: "center", key: "block_no" },
        { title: "Email Id", align: "center", key: "email_id" },
        { title: "No of Vehicles", align: "center", key: "number_of_vehicle" },
      ],
      itemsPerPage1: 10,
      headers1: [
        { title: "Id", align: "center", key: "vehicle_id", sortable: false },
        { title: "Type", align: "center", key: "vehicle_type" },
        { title: "Vehicle Number", align: "center", key: "vehicle_number" },
        { title: "Allotted Slot", align: "center", key: "slot_id" },
      ],
      vehicle_types: ["car", "bike", "scooter"],
      vehicle: {
        vehicle_id: null,
        vehicle_owner_id: null,
        vehicle_type: null,
        vehicle_number: null,
        alloted_slot: null,
        isFavourite: false,
      },
      onEditVehicle: false,
      onEditOwner: false,
    };
  },
  watch: {
    values(val) {
      if (val === "All") {
        this.searchValue = null;
        this.noDataDialog = false;
        this.getOwners();
      }
    },
  },
  methods: {
    async getOwners() {
      const owners = await axios.get("http://localhost:8001/search");
      this.ownerList = owners.data;
    },
    async search() {
      if (this.values === "Vehicle") {
        this.searchOwner = await axios
          .post("http://localhost:8001/admin/search/search-by-vehicle-no", {
            type: "vehicle_no",
            value: this.searchValue,
          })
          .catch((error) => {
            if (error.response.status === 404) {
              this.noDataDialog = true;
            }
          });
      } else if (this.values === "Name") {
        this.searchOwner = await axios
          .post("http://localhost:8001/admin/search/search-by-owner-name", {
            type: "owner_name",
            value: this.searchValue,
          })
          .catch((error) => {
            if (error.response.status === 404) {
              this.noDataDialog = true;
            }
          });
      } else if (this.values === "Block No") {
        this.searchOwner = await axios
          .post("http://localhost:8001/admin/search/search-by-block-no", {
            type: "block_no",
            value: this.searchValue,
          })
          .catch((error) => {
            if (error.response.status === 404) {
              this.noDataDialog = true;
            }
          });
      }
      this.ownerList = this.searchOwner.data;
    },
    async showVehicle(e, { item }) {
      if(!this.onEditOwner){
        this.displayVehicle = true;
      }
      this.onEditOwner = false
      if (!this.onEditVehicle) {
        this.vehicleOwnerId = item.props.title.owner_id;
        this.vehicleOwner = item.props.title.owner_name;
      }
      const vehicles = await axios
        .post("http://localhost:8001/get-vehicle-by-id", {
          owner_id: this.vehicleOwnerId,
        })
        .catch((error) => {
          console.log(error);
        });
      this.vehicleList = vehicles.data;
    },
    async editOwner(item) {
      this.onEditOwner = true
      console.log(item);
    },
    async deleteOwner(item) {
      this.onEditOwner = true
      console.log(item);
    },
    async editVehicle() {
      this.vehicle.isFavourite =
        this.vehicle.isFavourite === null || this.vehicle.isFavourite === false
          ? false
          : true;
      axios
        .post("http://localhost:8001/edit-vehicle", {
          vehicle: this.vehicle,
          owner_id: this.vehicle.vehicle_owner_id,
        })
        .then((response) => {
          if (response.status === 200) {
            this.text = "Vehicle Details updated Successfully!";
            this.onEditVehicle = true;
            this.showVehicle(null, {});
          }
        })
        .catch((error) => {
          if (error.response.status === 500) {
            this.text = "Internal server error";
          }
        });
    },
    async deleteVehicle() {
      axios
        .post("http://localhost:8001/delete-vehicle", {
          vehicle_id: this.vehicle.vehicle_id,
          owner_id: this.vehicle.vehicle_owner_id,
          slot_id: this.vehicle.alloted_slot,
        })
        .then((response) => {
          if (response.status === 200) {
            this.text = "Vehicle deleted Successfully!";
            this.onEditVehicle = true;
            this.showVehicle(null, {});
          }
        })
        .catch((error) => {
          if (error.response.status === 500) {
            this.text = "Internal server error";
          }
        });
    },
  },
  beforeMount() {
    this.getOwners();
    if (this.isAdmin) {
      this.headers.push({
        title: "Actions",
        key: "actions",
        align: "center",
        sortable: false,
      });

      this.headers1.push({
        title: "Actions",
        key: "actions",
        align: "center",
        sortable: false,
      });
    }
  },
};
</script>

<style scoped>
/*======================
    404 page
=======================*/

.page_404 {
  padding: 5px 0;
  background: #fff;
  font-family: "Arvo", serif;
}

.page_404 img {
  width: 100%;
}

.four_zero_four_bg {
  background-image: url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif);
  height: 370px;
  background-position: center;
}

.four_zero_four_bg h3 {
  font-size: 80px;
}

.link_404 {
  color: #fff !important;
  padding: 10px 20px;
  background: #39ac31;
  margin: 10px 0;
  display: inline-block;
}
.contant_box_404 {
  margin-top: -10px;
}
.contant_box_404 a {
  text-decoration: none;
}
</style>
