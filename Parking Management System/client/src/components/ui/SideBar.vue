<template>
  <v-navigation-drawer v-model="drawer" class="mt-16" color="#2C3333">
    <v-list>
      <v-list-item v-if="!isOwner && isAdmin" style="text-decoration: none">
        <template v-slot:prepend>
          <v-btn variant="text" block icon="mdi-home"></v-btn>
        </template>
        <router-link
          to="/admin/home"
          style="text-decoration: none; color: white"
        >
          <v-list-item-title>Home</v-list-item-title>
        </router-link>
        <template v-slot:append>
          <v-btn
            variant="text"
            icon="mdi-chevron-left"
            @click.stop="onToggle()"
          ></v-btn>
        </template>
      </v-list-item>
      <v-list-item v-else style="text-decoration: none">
        <template v-slot:prepend>
          <v-btn variant="text" block icon="mdi-home"></v-btn>
        </template>
        <router-link
          to="/owner/home"
          style="text-decoration: none; color: white"
        >
          <v-list-item-title>Home</v-list-item-title>
        </router-link>
        <template v-slot:append>
          <v-btn
            variant="text"
            icon="mdi-chevron-left"
            @click.stop="onToggle()"
          ></v-btn>
        </template>
      </v-list-item>
      <router-link
        v-if="!isOwner && isAdmin"
        to="/admin/search"
        style="text-decoration: none; color: inherit">
        <v-list-item title="Search">
          <template v-slot:prepend>
            <v-btn variant="text" icon="mdi-account-search"></v-btn>
          </template>
        </v-list-item>
      </router-link>
      <router-link
        v-else
        to="/owner/search"
        style="text-decoration: none; color: inherit"
      >
        <v-list-item title="Search">
          <template v-slot:prepend>
            <v-btn variant="text" icon="mdi-account-search"></v-btn>
          </template>
        </v-list-item>
      </router-link>
      <v-list-item>
        <v-list-item-title
          ><v-icon class="ml-2 mr-4">mdi-account-plus</v-icon
          >Requests</v-list-item-title
        >
        <template v-slot:append>
          <v-icon variant="text" @click="toggleRequests()">{{ icon }}</v-icon>
        </template>
        <v-content v-show="isOpen">
          <v-list v-if="!isOwner && isAdmin">
            <router-link
              to="/admin/add-owner"
              style="text-decoration: none; color: inherit"
              ><v-list-item title="Add Owner"></v-list-item
            ></router-link>
            <router-link
              to="/admin/add-vehicle"
              style="text-decoration: none; color: inherit"
              ><v-list-item title="Add Vehicle"></v-list-item
            ></router-link>
            <router-link
              to="/admin/wrong-parking"
              style="text-decoration: none; color: inherit"
              ><v-list-item title="Wrong Parking"></v-list-item
            ></router-link>
            <router-link
              to="/admin/guest-parking"
              style="text-decoration: none; color: inherit"
              ><v-list-item title="Guest Parking"></v-list-item
            ></router-link>
          
            <router-link
              to="/admin/penalties"
              style="text-decoration: none; color: inherit"
              ><v-list-item title="Penalties"></v-list-item
            ></router-link>
          </v-list>
          <v-list v-else>
            <router-link
              to="/owner/wrong-parking"
              style="text-decoration: none; color: inherit"
              ><v-list-item title="Wrong Parking"></v-list-item
            ></router-link>

            <router-link
              to="/owner/guest-parking"
              style="text-decoration: none; color: inherit"
            >
              <v-list-item title="Guest Parking"></v-list-item>
            </router-link>
            <router-link
              to="/owner/resolve-wrong-parking"
              style="text-decoration: none; color: inherit"
              ><v-list-item title="Resolve Parking"></v-list-item
            ></router-link>
            <router-link
              to="/owner/resolve-penalties"
              style="text-decoration: none; color: inherit"
            >
              <v-list-item title="Resolve Penalties"></v-list-item>
            </router-link>
          </v-list>
        </v-content>
      </v-list-item>
      <router-link
        v-if="!isOwner && isAdmin"
        to="/admin/map"
        style="text-decoration: none; color: inherit"
      >
        <v-list-item title="show map">
          <template v-slot:prepend>
            <v-btn variant="text" icon="mdi-map"></v-btn>
          </template>
        </v-list-item>
      </router-link>
      <router-link
        v-else
        to="/owner/map"
        style="text-decoration: none; color: inherit"
      >
        <v-list-item title="show map">
          <template v-slot:prepend>
            <v-btn variant="text" icon="mdi-map"></v-btn>
          </template>
        </v-list-item>
      </router-link>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      isOpen: false,
      icon: "mdi-chevron-down",
    };
  },
  computed: {
    drawer() {
      return this.$store.getters["toggle"];
    },
    isOwner(){
      return this.$store.getters["isOwner"]
    },
    isAdmin() {
      return this.$store.getters["isAdmin"];
    },
  },
  methods: {
    onToggle() {
      this.$store.dispatch("onToggle");
    },
    toggleRequests() {
      this.isOpen = !this.isOpen;
      this.icon = this.isOpen ? "mdi-chevron-up" : "mdi-chevron-down";
    },
  },
};
</script>

<style scoped>
.v-list-item {
  color: white;
}
</style>
