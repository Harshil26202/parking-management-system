<template>
    <section>
        <header-1></header-1>
            <v-container>
                <v-row no-gutters>
                    <v-col v-if="drawer" cols="3">
                        <side-bar></side-bar>
                    </v-col>
                    <v-col >
                        <router-view></router-view>    
                    </v-col>
                </v-row>
            </v-container>
    </section>
</template>
<script>
import Header1 from '../ui/Header.vue';
import SideBar from '../ui/SideBar.vue';
export default{
    components:{
        Header1,
        SideBar,
    },
    computed: {
        drawer() {
            return this.$store.getters["toggle"];
        },
    }

}
</script>

<style>
header-1 {
    position: sticky !important;
    top: 0;
    background-color: #2C3333;
  }
section {
    background-color: #E7F6F2;
}
</style>

