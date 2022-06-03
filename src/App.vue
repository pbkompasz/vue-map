<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
//@ts-ignore
import Map from './components/Map.vue'
</script>

<template>
    <div id="container">
        <div id="yourName">
            YOUR NAME HERE
        </div>
        <Map 
            id="map"
            height="400px"
            :width="500"
            square
            dark
        >

        </Map>
    </div>
</template>

<style scoped lang="sass">
#app 
  font-family: Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
  margin-top: 60px

#container
    width: 100%

#yourName
    text-align: center
    font-size: 70px

#map
    background-color: inherit
    border-style: solid

</style>
