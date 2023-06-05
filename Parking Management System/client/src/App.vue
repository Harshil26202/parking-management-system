<template>
  <body>
    <v-app style="background-color: #e7f6f2">
      <v-tooltip location="top"
        ><template v-slot:activator="{ props }">
          <v-btn
          icon="mdi-message"
            v-bind="props"
            size="large"
            variant="elevated"
            color="#2C3333"
            class="fixed mr-3 mb-3"
            style="position: absolute; bottom: 0px; right: 0px"
            @click="getCartDetails()"
          ><v-icon color="white">mdi-message</v-icon></v-btn>
        </template>
        <span>Chat</span>
      </v-tooltip>
      <router-view>
        
      </router-view>
    </v-app>
  </body>
</template>

<script>
export default {
  name: "App",
};
</script>
