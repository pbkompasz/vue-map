<template>
    <div 
        id="mapContainer"
        style="z-index:0;"
        ref="mapContainer"
    >
        asd
        <div
            class="row justify-between items-start edit"
            v-if="interactive"
            style="height: 100%"
        >
            <!-- Popup window parent -->
            <div
                class="row justify-center items-center" 
                style="position: absolute; margin-left: 100px; padding: 50px;  width: 100%; height: 100%; "
                v-if="false"
                @mouseover="blockMouseFn"
                @mouseleave="unblockMouseFn"
            >

                <div
                    class="col-2"
                    style="z-index: 5000; transition: visibility 1.5s"
                >
                    <create-location-component
                        class="q-pa-md"
                    ></create-location-component>
                    <!-- <q-card>
                        asd
                    </q-card> -->
                </div>
            </div>
            <div
                style="z-index: 4000;"
                class="column q-ma-sm "
                @mouseover="blockMouseFn"
                @mouseleave="unblockMouseFn"
            >
                <!-- Search bar -->
                <q-input
                    :class="{'searchbar': true, 'searchbarhover' : true, }"
                    :bg-color="(darkMode && darkMode == true) ? 'dark' : 'white'"
                    :style="{'width': (recommendationActive || searchActive) ? '240px' : '100px', }"
                    dense
                    square 
                    outlined
                    id="searchbar"
                    label-slot
                    @focus="focusSearchFn(true)"
                    @blur="focusSearchFn(false)"
                    @mouseover="leaveSearchFn(false)"
                    @mouseleave="leaveSearchFn(true)"
                >
                    <template #label>
                        <div
                            class="text-caption"
                            :style="{'color': (darkMode && darkMode == true) ? 'white' : '#3a4149'}"
                        >
                            Search
                        </div>
                    </template>
                    <template v-slot:append>
                        <q-icon 
                            name="search" 
                            size="sm" 
                            :color="(darkMode && darkMode == true) ? 'white' : '#3a4149'"
                        />
                    </template>
                </q-input>
                <!-- Suggestions / Query results -->
                <q-slide-transition
                    :duration="500" 
                    appear
                >
                    <div
                        :style="{'background-color': (darkMode && darkMode == true) ? '#3a4149' : 'white'}"
                        class="q-mt-md"
                        v-show="recommendationActive"
                    >
                        <q-list
                            id="query"
                            dark
                            dense
                            separator
                            padding
                        >
                            <q-item clickable v-ripple>
                                <q-item-section>Single line item</q-item-section>
                            </q-item>

                            <q-item clickable v-ripple>
                                <q-item-section>
                                <q-item-label>Item with caption</q-item-label>
                                <q-item-label caption>Caption</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-item clickable v-ripple>
                                <q-item-section>
                                <q-item-label overline>OVERLINE</q-item-label>
                                <q-item-label>Item with caption</q-item-label>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </div>
                </q-slide-transition>
            </div>
            <q-card
                class="row no-wrap "
                style="z-index: 4000"
                :style="{ 'background-color': (darkMode && darkMode == true) ? '#3a4149' : ''}"
                :id="(!trigger) ? 'mainDialog' : 'mainDialogActive'"
                @mouseover="blockMouseFn"
                @mouseleave="unblockMouseFn"
            >
                <div
                    class="column no-warp q-mt-sm q-mr-sm" 
                    id="buttons"
                >
                    <!-- zoom in -->
                    <q-icon
                        class="btn"
                        name="add" 
                        :color="(darkMode && darkMode == true) ? 'white' : '#3a4149'"
                        :style="{'background-color': (darkMode && darkMode == true) ? '#3a4149' : 'white'}"
                        @click="zoomFn('in')"
                    >
                        <q-tooltip anchor="center left" self="center right" :offset="[10, 10]">
                            <div>Zoom in</div>
                        </q-tooltip> 
                    </q-icon>
                    <!-- zoom out -->
                    <q-icon 
                        class="btn" 
                        name="remove" 
                        :color="(darkMode && darkMode == true) ? 'white' : '#3a4149'"
                        :style="{'background-color': (darkMode && darkMode == true) ? '#3a4149' : 'white'}"
                        @click="zoomFn('out')"
                    >
                        <q-tooltip anchor="center left" self="center right" :offset="[10, 10]">
                            <div>Zoom out</div>
                        </q-tooltip> 
                    </q-icon>
                    <!-- create location -->
                    <q-icon 
                        :class="{'btn': true, 'q-mt-md': true, 'btnActive' : (title == 'createLocation')}" 
                        name="img:icons/add-location.png" 
                        size="md"
                        :color="(darkMode && darkMode == true) ? 'white' : '#3a4149'"
                        :style="{'background-color': (darkMode && darkMode == true) ? '#3a4149' : 'white'}"
                        @click="triggerFn('createLocation')"
                    >
                        <q-tooltip v-if="!trigger" anchor="center left" self="center right" :offset="[10, 10]">
                            <div>Create location</div>
                        </q-tooltip> 
                    </q-icon>
                    <!-- create route -->
                    <q-icon 
                        :class="{'btn': true, 'btnActive' : (title == 'createRoute')}" 
                        name="img:icons/add-route.png" 
                        size="sm"
                        :color="(darkMode && darkMode == true) ? 'white' : '#3a4149'"
                        :style="{'background-color': (darkMode && darkMode == true) ? '#3a4149' : 'white'}"
                        @click="triggerFn('createRoute')"
                    >
                        <q-tooltip v-if="!trigger" anchor="center left" self="center right" :offset="[10, 10]">
                            <div>Create route</div>
                        </q-tooltip> 
                    </q-icon>
                    <!-- find -->
                    <q-icon 
                        :class="{'btn': true, 'btnActive' : (title == 'search')}" 
                        name="search" 
                        size="xs"
                        :color="(darkMode && darkMode == true) ? 'white' : '#3a4149'"
                        :style="{'background-color': (darkMode && darkMode == true) ? '#3a4149' : 'white'}"
                        @click="triggerFn('search')"
                    >
                        <q-tooltip v-if="!trigger" anchor="center left" self="center right" :offset="[10, 10]">
                            <div>Detailed search</div>
                        </q-tooltip> 
                    </q-icon>
                    <!-- insert -->
                    <!-- <q-icon 
                        :class="{'btn': true, 'btnActive' : (title == 'insert')}" 
                        name="add_circle_outline" 
                        color="black"
                        @click="triggerFn('insert')"
                    >
                        <q-tooltip v-if="!trigger" anchor="center left" self="center right" :offset="[10, 10]">
                            <div>Insert</div>
                        </q-tooltip> 
                    </q-icon> -->

                    <!-- skip -->
                    <!-- edit location -->
                    <q-icon 
                        class="btn q-mt-md" 
                        :class="{'btn': true, 'q-mt-md': true, 'btnActive' : (title == 'editLocation')}" 
                        name="img:icons/edit-location.png" 
                        size="md"
                        :color="(darkMode && darkMode == true) ? 'white' : '#3a4149'"
                        :style="{'background-color': (darkMode && darkMode == true) ? '#3a4149' : 'white'}"
                        @click="triggerFn('editLocation')"
                    >
                        <q-tooltip v-if="!trigger" anchor="center left" self="center right" :offset="[10, 10]">
                            <div>Edit location</div>
                        </q-tooltip> 
                    </q-icon>
                    <!-- edit route -->
                    <q-icon 
                        :class="{'btn': true, 'btnActive' : (title == 'editRoute')}" 
                        name="img:icons/edit0route.png" 
                        size="sm"
                        :color="(darkMode && darkMode == true) ? 'white' : '#3a4149'"
                        :style="{'background-color': (darkMode && darkMode == true) ? '#3a4149' : 'white'}"
                        @click="triggerFn('editRoute')"
                    >
                        <q-tooltip v-if="!trigger" anchor="center left" self="center right" :offset="[10, 10]">
                            <div>Edit route</div>
                        </q-tooltip> 
                    </q-icon>
                    <!-- add checkpoint -->
                    <q-icon 
                        :class="{'btn': true, 'btnActive' : (title == 'addCheckpoint')}" 
                        name="check" 
                        :color="(darkMode && darkMode == true) ? 'white' : '#3a4149'"
                        :style="{'background-color': (darkMode && darkMode == true) ? '#3a4149' : 'white'}"
                        @click="triggerFn('addCheckpoint')"
                    >
                        <q-tooltip v-if="!trigger" anchor="center left" self="center right" :offset="[10, 10]">
                            <div>Add checkpoint</div>
                        </q-tooltip> 
                    </q-icon>
                    <!-- highlight -->
                    <q-icon 
                        :class="{'btn': true, 'btnActive' : (title == 'highlight')}" 
                        name="star" 
                        :color="(darkMode && darkMode == true) ? 'white' : '#3a4149'"
                        :style="{'background-color': (darkMode && darkMode == true) ? '#3a4149' : 'white'}"
                        @click="triggerFn('highlight')"
                    >
                        <q-tooltip 
                            anchor="center left" 
                            self="center right" 
                            :offset="[10, 10]"
                            style="position: relative"
                            v-if="!trigger"
                        >
                            <div 
                                style="position: relative"
                            >Highlight</div>
                        </q-tooltip> 
                    </q-icon>
                </div> 
                <div
                    id="editContent"
                    class="q-ma-md column q-mt-sm q-mr-sm"
                    :style="{ 'background-color': (darkMode && darkMode == true) ? '#3a4149' : 'white', 'height': '100%', 'width': trigger ? '300px' : '0px', 'transition': 'width 0.5s' }"
                    @click.self="null"
                    ref="overlay"
                >
                    <div
                        v-if="trigger"
                        class="q-ma-sm"
                        style="width: 270px;"
                    >
                        <div style="width: 100%" class="row items-center q-pb-none ">
                            <div 
                                class="text-h6 q-mt-md q-ml-sm"
                                :style="{'color': (darkMode && darkMode == true) ? 'white' : '#3a4149'}"
                            >
                                {{ titleNice }}
                           </div>
                            <q-space />
                            <q-btn 
                                @click="trigger=false;title=''" 
                                :style="{'color': (darkMode && darkMode == true) ? 'white' : '#3a4149'}"
                                dark
                                icon="close" 
                                flat 
                                round 
                                dense 
                            />
                        </div>
                        <div 
                            class="column q-ma-md" 
                            v-if="title == 'search'"
                        >
                            <q-input  
                                dense
                                label-color="black"
                                color="black" 
                                :debounce="200"
                                v-model="searchCriteria" 
                                label="Search for a location or a route" 
                                @update:model-value="searchFn"
                                filled
                            />
                            <q-list 
                                bordered
                                class="q-mt-md"
                            >
                                <q-item 
                                    color="black" 
                                    v-if="searchResults.length == 0"
                                >
                                    <div style="color: black">
                                        No results for {{ searchCriteria }}
                                    </div>
                                </q-item>
                                <q-item color="black" v-else v-for="result in searchResults" :key="result.id">
                                    <div style="color: black">
                                        {{ result }}
                                    </div>
                                </q-item>
                            </q-list>
                        </div>
                        
                        <create-location-component
                            v-if="title == 'createLocation'" 
                            class="q-pa-md"
                            @update:focused="focusBeforeCreateFn"                
                            @update:popup="updatePopupBeforeCreateFn"                
                            @create:location="createLocationFn"                
                            @update:type="changeTypeBeforeCreateFn"                
                        ></create-location-component>
                        
                        <div class="column" v-if="title == 'createRoute'" style="background-color: white">
                            craete route
                            strating Location
                            ending location
                            intermediary location
                            choose from multiple routes
                        </div>
                        <div class="column" v-if="title == 'insert'" style="background-color: white">
                            insert something
                        </div>
                        
                        <edit-location-component
                            v-if="title == 'editLocation'"  
                            :locationToEdit="locationToEdit"
                            @update:location="updateLocationFn"                
                        ></edit-location-component>
                        
                        <edit-route-component
                            v-if="title == 'editRoute'"  
                            class="q-pa-md"
                            :routeToEdit="routeToEdit"
                            @update:route="updateRouteFn"                
                        ></edit-route-component>
                        
                        <div class="column" v-if="title == 'addCheckpoint'" style="background-color: white">
                            add checkpoint
                            get notification when a vehicle reaches the vicinity of this location
                            <q-btn
                                label="Create checkpoint"
                            ></q-btn>
                        </div>
                        <div 
                            class="column items-center" 
                            v-if="title == 'highlight'"
                            style="width: 100%; height: 100%"
                        >
                            <q-list v-if="highlights && highlights.length > 0">
                                <q-item
                                    v-for="highlight in highlights"
                                    :key="highlight.id"
                                >
                                    {{ highlight }} 
                                </q-item>
                            </q-list>
                            <div 
                                v-else
                                class="column items-center"    
                            >
                                <div 
                                    class="text-h6"
                                    :style="{'color': (darkMode && darkMode == true) ? 'white' : '#3a4149'}"
                                >
                                    You do not have highlighted items
                                </div>
                                <br>
                                <!-- <q-btn
                                    label="Create highlight"
                                    style="margin-top: 100%"
                                ></q-btn> -->
                            </div>
                        </div>
                    </div>
                </div>
            </q-card>
        </div>
    </div> 
</template>

<style scoped lang="sass">
#mapContainer
    width: 100%
    height: 100%
#mainDialog
    background-color: rgba(255,255,255, 0)
    height: 100%
    max-width: 40%
    box-shadow: none
#mainDialogActive
    height: 100%
    background-color: rgba(255,255,255, 1)
    max-width: 40%
.edit
    width: 100%
    position: absolute
#buttons
    background-color: rgba(255,255,255, 0)
    box-shadow: none
    height: 100%
.btn
    background-color: white
    width: 25px
    height: 25px
.btnActive
    background-color: grey
#editContent
    max-width: 30%
    min-width: 20%
    width: 300px
    color: black
    margin: 0
    padding: 0
.searchbarhover
    width: 240px
.asd
    width: 240px
.searchbar:hover
    width: 240px
.searchbar
    max-width: 350px
    width: 100px
    height: 25px
    color: red
    transition: width 0.5s
#query
    transition: visibility 0.5s, opacity 0.5s linear
</style>
<script lang="ts">

export default {
    name: 'MapComponent',
    props: {
        // Center of the map
        center: {
            type: Object,
            // Center of europe
            default(rawProps)   {
                return {}
                // return GeoJSON.parse(
                //     { 
                //         name: 'Location A', 
                //         category: 'Store', 
                //         street: 'Market', 
                //         lat: 47.4811282,
                //         lng: 18.9902218
                //     }, 
                //     {Point: ['lat', 'lng']});
                // [47.4811282, 18.9902218],
            },
            validator(value) {
                return true;
            }
        },
        zoomLevel: {
            type: Number,
            default: 7,
            validator(value) {
                return value > 0;
            }
        },
        // Some color
        color: {
            type: String, 
            default: '(128, 128, 128, 0)',
        },
        // Entities to be shown
        locations: {
            type: Object,
            default: [],
        },
        routes: {
            type: Object,
            default: [],
        },
        movingObjects: {
            type: Object,
            default: [{}],
        },
        vehicleLocations: {
            type: Object,
            default: [],
        },
        mode: {
            type: String,
            validator(value) {
                return ['interactive', 'snapshot', 'responsive', ].includes(value)
            },
        },
        // Tile layer
        tileLayerUrl: {
            type: [String, Object],
            description: 'Used to load and display tile layers on the map',
            default() {
                // return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            },
            validator(value) {
                // if (object...)
                // L.tileLayer(test)
                return true
            }
        },
        tileLayerZoomLevel: {
            type: [Number],
            description: 'Tile layer zoomIn level',
            default() {
                return 20
            },
            validator(value) {
                return true
            }
        },
        tileLayerAttribution: {
            type: String,
            description: 'String to be shown in the attribution control',
            default() {
                return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            },
            validator(value) {
                // check if legit string
                return true
            }
        },
        width: {
            type: [Number, String],
            default: 300,
            description: 'Map width in pixels',
            validator(val) {
                return true
                if (typeof val === 'string' || val instanceof String) {
                    const re = /[1-9]+px/;
                    return /^(([1-9][0-9]+)|(0))px$/.test(val)
                } 
                return val > 0
            },
        },
        height: {
            type: [Number, String],
            default: 300,
            description: 'Map width in pixels',
            validator(val: any|string|String) {
                return true
                if (typeof val === 'string' || val instanceof String) {
                    const re = /[1-9]+px/;
                    return /^(([1-9][0-9]+)|(0))px$/.test(val)
                } 
                return val > 0
            },
        },
        // Gets passed to every subcomponent
        dense: {
            type: Boolean,
            default: false,
        },
        // Gets passed to every subcomponent
        // Tile layer changes to a dark one
        // Every icon changes to a dark one
        dark: {
            type: Boolean,
            default: false,
        },
        // object: {
            // type: 'static-object|active-object|route',
            // data: GeoJSON,
            // icon: 'default',
            // iconSize: 'xs|sm|md|lg|xl'.split('\''),
            // emit event for moving object
            // emit: true,
            // called every time 
            // fetchFunction
            // fetchFunctionMask
            // where to look for lat and lon
            // refreshRate(in seconds),
        // },
        objects: {
            type: Object,
            validator(value) {
                if (!Array.isArray(value)) {
                    console.warn('Not array')
                    return false
                }
                for (const el of value) {
                    if (!['static-object', 'active-object', 'route'].includes(el.type)) {
                        return false
                    }
                }
                return true
            },
            default(rawProps) {
                return []
                // rawProps.map((prop) => {
                //     if (!prop.icon) prop.icon = DEFAULT_OBJECT_ICON
                //     if (!prop.icon) prop.icon = DEFAULT_OBJECT_ICON
                // })        
            },
        },
        // Modes
        interactive: {
            type: Boolean,
            default: false,
        },
        snapshot: {
            type: Boolean,
            default: false,
        },
        responsive: {
            type: Boolean,
            default: false,
        },
        // Focused entity
        focused: {
            type: Object,
        },
        // location icon
        locationIcon: {
            type: String,
            default: 'https://www.politiadefrontiera.ro/vault/images/ptfpin_green.png',
        },
        // vehicle icon
        // route default color
        // route highlight color
        // zoom on location when selected
        // show zoom buttons
        // block mouse events on overlay
        // block mouse events for each component
        // emit click event
        // 
    },
    
    
    
}
// TODO
// set routes[0] and locations[0] as initial selected routes
// Zoom on select
// Hover popup
</script>



<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>



