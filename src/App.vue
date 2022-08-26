<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
//@ts-ignore
import Map from './components/Map.vue'
import { ref } from 'vue'

const dark = ref(false)
const warning = ref(false)
const error = ref(false)
const zoom = ref()
const type = ref('interactive')
</script>

<template>
    <div class="container">
        <div id="yourName">
        </div>
        <div>
            <h2>Demo</h2>
            <div
                id="map" 
                class="container"
            >
                <Map 
                    height="400px"
                    :width="500"
                    square
                    :dark="dark"
                    :type="type"
                    :zoom="zoom"
                >
                    <template #popup>
                        asd
                    </template>
                </Map>
                <div
                    id="settings"
                >
                    <div class="section" >
                        <h3 >Behaviour</h3>
                        <div class="criteria">
                            <div>Zoom level</div>
                            <input type="range" id="two" v-model="zoom"/>
                        </div>
                        <div class="criteria">
                            <div>Map type</div>
                            <select name="type" id="cars" v-model="type">
                                <option value="interactive">Interactive</option>
                                <option value="snapshot">Snapshot</option>
                                <option value="responsive">Responsive</option>
                            </select>
                        </div>
                        <div class="criteria">
                            <div>Show warning</div>
                            <input type="checkbox" id="two" v-model="warning"/>
                        </div>
                        <div class="criteria">
                            <div>Show error</div>
                            <input type="checkbox" id="two" v-model="error"/>
                        </div>
                    </div>
                    <div class="section" >
                        <h3>Style</h3>
                        <div class="criteria">
                            <div>Dark mode</div>
                            <input type="checkbox" id="two" v-model="dark"/>
                        </div>
                    </div>
                    <div class="section" >
                        <h3>Model</h3>
                    </div>
                </div>
            </div>
        </div>
        <div id="comparison">
            <div style="max-width: 45vw">
                <h2>Knockoff</h2>
                <Map
                    :height="400"
                    width="400px"
                    zoom-button-location="bottom-right"
                >
                    <!-- center="40.805449,-73.965441" -->
                    <!-- zoom -->
                    <!-- zoom-position="bottom-right" -->
                    <template #overlay-left-top>
                        <div id="google-overlay">
                            <div style="font-weight: bold; font-size: 14px; margin: 0">
                                2880 Broadway
                            </div>
                            <div style="color: grey">
                                2880 Broadway, New York, NY 10025, USA
                            </div>
                            <a
                                style="text-decoration: none; color: #1a73e8;"
                                href="https://maps.google.com/maps?ll=40.805449,-73.965441&z=13&t=m&hl=en-US&gl=US&mapclient=embed&q=2880%20Broadway%20New%20York%2C%20NY%2010025%20USA"
                            >
                                View larger map
                            </a>
                        </div>
                    </template> 
                    <template #overlay-left-bottom>
                            <!-- <button
                                @click="switchOverlay"
                            >button</button> -->
                    </template>
                    <template #overlay>
                            <!-- <button
                                @click="switchOverlay"
                            >button</button> -->
                    </template>
                    <!-- <template #text>
                        <div style="color: white; font-size: 20px;">Use ctrl + scroll to zoom the map</div>
                    </template> -->
                </Map>
            </div>
            <div style="max-width: 50vw">
                <h2>Original</h2>
                <iframe width="400" height="400" id="gmap_canvas" src="https://maps.google.com/maps?q=2880%20Broadway,%20New%20York&t=&z=13&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>
            </div>
        </div>
        
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

.container
    width: 100%
    display: flex
    flex-direction: column

#yourName
    text-align: center
    font-size: 70px

#map
    width: 100%
    background-color: inherit
    display: flex
    flex-direction: row
    flex-wrap: wrap
    align-items: center

#settings
    display: flex
    margin-left: 50px
    flex-direction: row
    max-height: 400px
    height: 400px
    max-width: 250px
    flex-wrap: nowrap

#comparison
    display: flex
    flex-direction: row
    flex-wrap: wrap

div
    margin-top: 20px
    width: 100%

.section
    min-width: 200px
    height: inherit
    max-height: inherit
    overflow-y: auto 
    margin: 0 20px
    padding: 20px
    border-style: outset

.criteria
    display: flex
    align-items: baseline

#google-overlay
    font-family: Roboto,Arial
    font-size: 12px
    background-color: white
    margin: 10px
    width: 215px
    max-width: 215px
    padding: 10px

</style>
