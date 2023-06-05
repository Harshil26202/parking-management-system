<template>
  <v-toolbar color="#2C3333">
    <template v-slot:prepend>
      <v-app-bar-nav-icon
        color="white"
        @click.stop="onToggle()"
      ></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title class="pt-3">
      <img src="../../assets/logo.png" style="width: 20%" />
    </v-app-bar-title>
    <template v-slot:append>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn @click="showNotification()" v-bind="props" stacked>
            <v-badge :content="notificationCount()"><v-icon size="small">mdi-bell</v-icon> </v-badge>
          </v-btn>
        </template>
        <v-card class="mx-auto text-center" style="max-height: 300px">
          <v-card-title><b>Notifications</b></v-card-title>
          <v-divider class="my-2"></v-divider>
          <v-list v-if="notifications.length > 0" lines="one">
            <v-list-item
              v-for="notification in notifications"
              :key="notification.id"
              :title="notification.notification_text"
              class="text-left"
            >
              <template v-slot:append>
                <v-btn
                  color="#2C3333"
                  size="small"
                  class="ml-1"
                  variant="text"
                  @click="changeStatus(notification.id)"
                  ><v-icon>mdi-check</v-icon></v-btn
                >
              </template>
            </v-list-item>
          </v-list>
          <v-text v-else> no notifications left.. </v-text>
          <v-divider class="my-3"></v-divider>
          <v-btn
            rounded
            :disabled="notifications.length === 0"
            color="#2C3333"
            class="mb-2 text-white"
            @click="clearNotification()"
          >
            clear
          </v-btn>
        </v-card>
      </v-menu>
      <v-menu min-width="200px" rounded>
        <template v-slot:activator="{ props }">
          <v-btn
            icon="mdi-account-circle"
            v-bind="props"
            @click="getProfile()"
          ></v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center">
              <v-avatar icon="mdi-account-circle"> </v-avatar>
              <h3>{{ owner_name }}</h3>
              <p class="text-caption mt-1">
                {{ owner_email }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-container>
                <v-row v-if="isAdmin" class="d-flex justify-center">
                  <v-btn
                    rounded
                    variant="text"
                    @click="toggleRole()"
                    color="#2C3333"
                    ><b
                      >Switch to {{ isOwner === false ? "Owner" : "Admin" }}</b
                    ></v-btn
                  >
                </v-row>
                <v-row class="d-flex justify-center">
                  <router-link to="edit-profile">
                    <v-btn rounded variant="text" color="#2C3333">
                      <v-icon>mdi-pencil</v-icon>
                      <b>Edit Profile</b>
                    </v-btn>
                  </router-link>
                </v-row>
                <v-row class="d-flex justify-center">
                  <router-link to="change-password">
                    <v-btn rounded variant="text" color="#2C3333">
                      <v-icon>mdi-lock-reset</v-icon>
                      <b>Reset Password</b>
                    </v-btn>
                  </router-link>
                </v-row>
              </v-container>
              <v-divider class="my-3"></v-divider>
              <v-btn
                rounded
                color="#2C3333"
                @click="
                  snackbar = true;
                  signout();
                "
              >
                Logout
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </template>
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ text }}
      <template v-slot:actions>
        <v-btn color="blue" variant="text" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-toolbar>
</template>
<script>
import axios from "axios";
export default {
  name: "MainHeader",
  data() {
    return {
      snackbar: false,
      text: "",
      timeout: null,
      drawer: false,
      prevAdmin: false,
      owner_name: null,
      owner_email: null,
      notifications: [],
    };
  },
  computed: {
    isAdmin() {
      return this.$store.state.owner.data.isAdmin;
    },
    isOwner() {
      return this.$store.getters["isOwner"];
    },
  },
  methods: {
    notificationCount() {
      return this.notifications.length > 9 ? "9+" : this.notifications.length;
    },
    onToggle() {
      this.$store.dispatch("onToggle");
    },
    toggleRole() {
      this.$store.dispatch("changeRole");
      console.log(this.isOwner);
      if (this.isOwner) {
        this.$router.push({ path: "/owner/home" });
      } else {
        this.$router.push({ path: "/admin/home" });
      }
    },
    getProfile() {
      this.owner_name = this.$store.state.owner.data.owner_name;
      this.owner_email = this.$store.state.owner.data.email_id;
    },
    async showNotification() {
      const logs = await axios.post("http://localhost:8001/get-notifications", {
        owner_id: this.$store.state.owner.data.owner_id,
      });
      if (logs.data.length === 0) {
        return (this.text = "Hurray! no notifications");
      }
      console.log(logs);
      this.notifications = logs.data;
      console.log(this.notifications);
    },
    async changeStatus(id) {
      await axios
        .post("http://localhost:8001/change-notification-status", {
          id: id,
        })
        .then((response) => {
          if (response.status === 200) {
            for (let i = 0; i < this.notifications.length; i++) {
              if (this.notifications[i].id === id) {
                this.notifications.splice(i, 1);
              }
            }
            this.notificationCount()
          }
        })
        .catch((error) => {
          if (error.response.status === 500) {
            this.text = "Internal server error";
          }
          this.loading = false;
        });
    },
    async clearNotification() {
      await axios
        .post("http://localhost:8001/clear-notification", {
          owner_id: this.$store.state.owner.data.owner_id,
        })
        .then((response) => {
          if (response.status === 200) {
            this.notifications = null,
            this.text = "Notification cleared";
            this.notificationCount()
          }
        })
        .catch((error) => {
          if (error.response.status === 500) {
            this.text = "Internal server error";
          }
          this.loading = false;
        });
    },
    signout() {
      localStorage.clear("token");
      sessionStorage.clear();
      this.timeout = 1000;
      this.text = "Logged out succesfully!";
      setTimeout(() => {
        this.$router.push("/signin");
      }, 1000);
      if (this.$store.state.owner.data.password === null) {
        axios.post("http://localhost:3000/logout");
      }
    },
  },
  beforeMount() {
    this.showNotification();
    this.getProfile();
    this.prevAdmin = this.$store.state.owner.data.isAdmin;
  },
};
</script>

<style scoped>
.v-toolbar {
  position: sticky !important;
  top: 0;
  background-color: #2c3333;
  z-index: 1000;
}
.v-btn {
  color: white;
}
</style>
