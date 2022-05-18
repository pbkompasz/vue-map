<template>
    <div 
        id="mapContainer"
        style="z-index:0; background-color: red"
        ref="mapContainer"
    >

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

<script>
import { ref, onMounted, toRefs, onBeforeUnmount, watch } from 'vue'
// // import { useQuasar } from 'quasar';
// // import { client } from 'boot/axios'
// // import 'leaflet/dist/leaflet.css'
// // import L from 'leaflet'
// // const GeoJSON = require('geojson')
// // import Behaviour from 'classes/user/settings/Behaviour';
// // import Location from 'classes/navigation/Location';
// // import CreateLocationComponent from 'components/reusable/CreateLocation'
// // import CreateRouteComponent from 'components/reusable/CreateRoute'
// // import EditLocationComponent from 'components/reusable/EditLocation'
// // import EditRouteComponent from 'components/reusable/EditRoute'
export default {
    name: 'MapComponent',
    props: {
        center: {
            type: Object,
            // Center of europe
            default(rawProps)   {
                return GeoJSON.parse(
                    { 
                        name: 'Location A', 
                        category: 'Store', 
                        street: 'Market', 
                        lat: 47.4811282,
                        lng: 18.9902218
                    }, 
                    {Point: ['lat', 'lng']});
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
        }
    },
    setup (props, {emit}) {
        onMounted(() => {
            console.log('asd')
        })
        const $q = useQuasar();
        // Leaflet entry point
        let mapDiv
        // Map container ref
        const mapContainer = ref(null)
        // Overlay ref
        const overlay = ref(null)
        // Dark mode
        const darkMode = ref($q.dark.isActive)
        watch(() => $q.dark.isActive, val => {
            darkMode.value = val
        })
        const { center, zoomLevel, interactive, positions, locations, routes, movingObjects, snapshot, responsive, } = toRefs(props)
        // Focused entity
        const focused = ref()
        // Focused route
        const focusedRoute = ref()
        // Focused location
        const focusedLocation = ref()
        // Main dialog active
        const trigger = ref(false)
        const add = ref()
        // Main dialog title
        const title = ref('createLocation')
        const titleNice = ref('Create new location')
        // Search criteria
        const searchCriteria = ref(null) 
        // Search result
        const searchResults = ref([]) 
        // Create location name or coordinates
        // Highlighted entities
        const highlights = ref([])
        // Search bar hovered 
        const searchActive = ref(false)
        // Search bar clicked 
        const recommendationActive = ref(false)
        // CONSTS
        const LOGO_OFFSET_Y = -0.1
        // Location store
        const locationLayers = []
        // Route store
        const routeLayers = []
        // Moving object store
        const movingObjectLayers = []
        // Icon store
        const icon = {}
        
        // Leaflet setup method
        // Gets called on mounted
        const setupLeafletMap = ({
            interactive = false,
            snaphot = false,
        }) => {
            // Constructor with center location
            mapDiv = L.map("mapContainer", {
                closePopupOnClick: snapshot.value ? false : true,
                dragging: snapshot.value ? false : true,
                zoomControl: false,
                attributionControl:false,
            }).setView(center.value.geometry.coordinates.reverse(), zoomLevel.value);
            // Set zoom level
            // L.set
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapDiv);
            L.Icon.Default.prototype.options.iconUrl = 'https://png.pngtree.com/png-vector/20190223/ourmid/pngtree-vector-house-icon-png-image_695369.jpg',
            setupIconFn()
            blockEventsOverOverlayFn()
        } 
        // TODO test
        // rewrite to simple function with onmouseover
        const blockEventsOverOverlayFn = () => {
            mapDiv.on('movestart', () => {
                mapMoving.value = true
            })
            mapDiv.on('moveend', () => {
                mapMoving.value = false
            })
            return;
            const { clientWidth, clientHeight } = mapContainer.value
            const blockedTerritory =  [
                {
                    startX: 0,
                    startY: 0,
                    finishX: (searchActive.value) ? 250 : 150 ,
                    finishY: (searchActive.value) ? 50 : 500 ,
                },
                {
                    startX: (trigger.value) ? clientWidth - 700 : clientWidth - 150 ,
                    startY: 0,
                    finishX: clientWidth,
                    finishY: clientHeight,
                },
            ]
            // TODO
            // if (popupWindowActive) {
            //     blockedTerritory.push({
            //         startX: 0,
            //         startY: 0,
            //         finishX: (searchActive.value) ? 250 : 150 ,
            //         finishX: (searchActive.value) ? 50 : 500 ,
            //     })
            // }
            const events = ['click', 'dblclick', 'scrollWheelZoom', 'dragging', 'mousewheel', ]
            const checkIfEventIsBlocked = (x, y) => {
                // console.log({x, y, })
                for (const territory in blockedTerritory) {
                    // console.log(blockedTerritory[territory])    
                    if (x >= blockedTerritory[territory].startX && x <= blockedTerritory[territory].finishX &&
                        y >= blockedTerritory[territory].startY && y <= blockedTerritory[territory].finishY) {
                        return true
                    }
                }
                return false
            }
            events.forEach((event) => {
                mapDiv.on(event, (resp) => {
                    // console.log(resp)
                    if (checkIfEventIsBlocked(resp.containerPoint.x, resp.containerPoint.y)) {
                        // console.log('block')
                        mapDiv.dragging.disable();
                        mapDiv.touchZoom.disable();
                        mapDiv.doubleClickZoom.disable();
                        mapDiv.scrollWheelZoom.disable();
                        mapDiv.boxZoom.disable();
                        mapDiv.keyboard.disable();
                    }
                    mapDiv.dragging.enable();
                    mapDiv.touchZoom.enable();
                    mapDiv.doubleClickZoom.enable();
                    mapDiv.scrollWheelZoom.enable();
                    mapDiv.boxZoom.enable();
                    mapDiv.keyboard.enable();
                })
            })
            // TODO same with mousewheel event
            L.DomEvent.on(mapDiv.getContainer(), 'mousewheel', function() {
                console.log(L.DomEvent.getMousePosition())
            });
        }
        // Draw routes
        const drawRoutesFn = (routes) => {
            // const route = routes[0]
            routes.forEach((route) => {
                const geojsonLayer = L.geoJson(route.raw, {
                    style: function(feature) {
                        return {
                            stroke: true,
                            color: "grey",
                            weight: 3
                        };
                    },
                    onEachFeature: function(feature, layer) {
                        layer.bindPopup("id: " + route.id + "<br>")
                    }
                }).addTo(mapDiv);
                routeLayers.push(geojsonLayer)
                mapDiv.fitBounds(geojsonLayer.getBounds());
                geojsonLayer.on('click', (event) => {
                    const geometry =  event.layer.feature.geometry
                    const route = routes.find((route) => {
                        return route.raw.geometry == geometry
                    })
                    focusedRoute.value = route
                    focused.value = { 
                        type: 'route',
                        entity: route,
                    }
                    focusOnRouteFn(geojsonLayer)     
                    setRouteActiveFn(geojsonLayer)
                })
            })
        }
        // TODO
        // Focus on route, change color, set center on route
        const focusOnRouteFn = (routeLayer) => {
            // Get bounds object
            const bounds = routeLayer.getBounds()
            // Fit the map to the polygon bounds
            mapDiv.fitBounds(bounds)
            // Or center on the polygon
            const center = bounds.getCenter()
            mapDiv.flyTo(center)
        }
        // Focus on location, change icon, set center to location
        const focusOnLocationFn = (locationLayer, zoomLevel = 8) => {
            // Change icon
            changeIconFn(locationLayer, icon.focused)
            // Set center
            mapDiv.flyTo([locationLayer._latlng.lat, locationLayer._latlng.lng], zoomLevel)
        }
        // Unfocus location, change icon to default
        const unfocusLocationFn = (locationLayer) => {
            changeIconFn(locationLayer, icon.greenIcon)
        }
        // Create icons
        const setupIconFn = () => {
            var LeafIcon = L.Icon.extend({
            options: {
                    iconSize: 		[21, 34], 
                    iconAnchor: 	[11, 0],
                    popupAnchor: 	[0, 0],
                }
            });
            // TODO
            // Download and change to local
            icon.greenIcon = new LeafIcon({
                iconUrl: 'https://www.politiadefrontiera.ro/vault/images/ptfpin_green.png',
                offset: false,
            })
            icon.focused = new LeafIcon({
                iconUrl: 'https://www.politiadefrontiera.ro/vault/images/ptfpin_red.png',
                offset: false,
            })
            icon.defaultLocation = new LeafIcon({
                iconUrl: 'https://www.politiadefrontiera.ro/vault/images/ptfpin_red.png',
                offset: false,
            })
            icon.defaultCar = new LeafIcon({
                iconUrl: 'icons/car.png',
                offset: true,
            })
            icon.car2 = new LeafIcon({
                iconUrl: 'icons/car2.png',
            })
            icon.carCombi = new LeafIcon({
                iconUrl: 'icons/car-combi.png',
            })
            icon.pickup = new LeafIcon({
                iconUrl: 'icons/pickup.png',
            })
            icon.defaultVan = new LeafIcon({
                iconUrl: 'icons/van.png',
            })
            icon.van2 = new LeafIcon({
                iconUrl: 'icons/van2.png',
            })
            icon.defaultSemiTruck = new LeafIcon({
                iconUrl: 'icons/test.png',
            })
            icon.defaultSemiTrailer = new LeafIcon({
                iconUrl: 'icons/test.png',
            })
            icon.defaultVehicle = new LeafIcon({
                iconUrl: 'icons/car.png',
            })
            icon.defaultBorderCrossing = new LeafIcon({
                iconUrl: 'https://www.politiadefrontiera.ro/vault/images/ptfpin_red.png',
            })
            icon.defaultLoading = new LeafIcon({
                iconUrl: 'https://www.politiadefrontiera.ro/vault/images/ptfpin_red.png',
            })
            icon.defaultUnloading = new LeafIcon({
                iconUrl: 'https://www.politiadefrontiera.ro/vault/images/ptfpin_red.png',
            })
        }
        // Change icon on loayer
        const changeIconFn = (locationLayer, icon) => {
            locationLayer.setIcon(icon);
        }
        // Draw locations received as props
        // Location markers are stored in locationMarkers
        const drawLocationsFn = (locations) => {
            locations.forEach((location) => {
                const lat = location.raw.geometry.coordinates[1];
                const lon = location.raw.geometry.coordinates[0];
                // create a new marker using the icon style
                const marker = L.marker([lat,lon],{
                    icon: icon.greenIcon
                }).addTo(mapDiv)
                const popup = location.raw.properties.description ? (location.raw.properties.name + '<br />' + location.raw.properties.description) : (location.raw.properties.name)
                marker.bindPopup(popup)
                locationLayers.push(marker)
                marker.on('click', (event) => {
                    const location = locations.find((location) => {
                        return (event.latlng.lat == location.raw.geometry.coordinates[1] && event.latlng.lng == location.raw.geometry.coordinates[0] )
                    })
                    focusedLocation.value = location
                    focused.value = { 
                        type: 'location',
                        entity: location,
                    }
                    focusOnLocationFn(marker)
                    setTimeout(() => {
                        unfocusLocationFn(marker) 
                    }, 1000);
                })
            })
        }
        // Draw moving object (vehicle, etc. )
        // Store moving object in movingObject array
        // default: follow = true
        const drawMovingObjectsFn = (objects) => {
            objects.forEach((object) => {
                const lat = object.raw.geometry.coordinates[1];
                const lon = object.raw.geometry.coordinates[0];
                // create a new marker using the icon style
                const marker = L.marker([lat,lon],{
                    icon: icon[object.icon]
                }).addTo(mapDiv)
                marker.options = {
                    follow: true,
                }
                movingObjectLayers.push(marker)
                .bindPopup(object.popup) 
                createFollowJobFn(object)
                // marker.on('click', (event) => {
                //     const location = locations.find((location) => {
                //         return (event.latlng.lat == location.raw.geometry.coordinates[1] && event.latlng.lng == location.raw.geometry.coordinates[0] )
                //     })
                //     focusedLocation.value = location
                //     focused.value = { 
                //         type: 'location',
                //         entity: location,
                //     }
                //     focusOnLocationFn(marker)
                //     setTimeout(() => {
                //         unfocusLocationFn(marker) 
                //     }, 1000);
                // })
            })
        }
        const createFollowJobFn = (object) => {
            new CronJob('*/5 * * * * *', fetchLocationFn(object.id)); 
        }
        // Mapbox setup method
        // Only called inside onMounted when map is interactive
        const setupMapbox = () => {
            // const mbxClient = require('@mapbox/mapbox-sdk');
            // const baseClient = new mbxClient({ accessToken: process.env.MAPBOX_API_KEY });
            // const mbxDirections = require('@mapbox/mapbox-sdk/services/directions');
            // const directionClient = mbxDirections(baseClient)
            // // Just for testing
            // directionClient.getDirections({
            //     profile: 'cycling',
            //     geometries: 'geojson',
            //     waypoints: [
            //         {
            //         coordinates: [-84.518399,39.134126],
            //         approach: 'unrestricted'
            //         },
            //         {
            //         coordinates: [-84.511987,39.102638]
            //         },
            //     ]
            //     })
            // .send()
            // .then(response => {
            //         const directions = response.body;
            //         console.log(directions)
            // });  
            
        }
        // Only a fixed map is visible
        // No events emited, no functions can be called
        // Cron jobs inactive
        const toggleSnapshotModeFn = () => {
            console.log('Toogle snapshot mode')
            // L.zoomControl = false
            L.closePopupOnClick(false).affTo(mapDiv)
            mapDiv.dragging = false
        }
        // Toogle interactive mode
        const toggleInteractiveFn = () => {
            console.log('Toggle interactive mode')
        }
        let CronJob = null
        // Toggle responsive mode
        const toggleResponsiveFn = () => {
            console.log('Toggle responsive mode')
            // Job that runs every 5 seconds
            CronJob = require('cron').CronJob;
        }
        const fetchLocationFn = async (id) => {
            await client.post()
            // OR
            // websockets
        }
        // Think it's obsolete
        watch(locations, (val) => {
            try {
                drawLocationsFn(locations.value)
                if (locations.value && locations.value.length>  0)
                    focusedLocation.value = locations.value[0]
            } catch (error) {
                console.log(error) 
                emit('error')
            }
        })
        // Think it's obsolete
        watch(routes, (val) => {
            try {
                drawRoutesFn(routes.value)
                if (routes.value && routes.value.length > 0)
                    focusedRoute.value = routes.value[0]
            } catch (error) {
                console.log(error)
                emit('error') 
            }
        })
        // Watch if an entity is focused
        watch(focused, (val) => {
            if (val.type == 'location') {
                trigger.value = true
                title.value = 'editLocation'
            } else if (val.type == 'route') {
                trigger.value = true
                title.value = 'editRoute'
            } 
        })
        // Watch title for main sidebar
        watch(title, (val) => {
            switch (val) {
                case 'createLocation':
                    titleNice.value = 'Create new location' 
                    break;
                case 'createRoute':
                    titleNice.value = 'Create new route' 
                    break;
                case 'search':
                    titleNice.value = 'Search' 
                    break;
                case 'insert':
                    titleNice.value = 'Insert' 
                    break;
                case 'editLocation':
                    setLocationEditableFn()
                    titleNice.value = 'Edit location' 
                    break;
                case 'editRoute':
                    setRouteEditableFn()
                    titleNice.value = 'Edit route' 
                    break;
                case 'addCheckpoint':
                    titleNice.value = 'Add checkpoint' 
                    break;
                case 'highlight':
                    titleNice.value = 'Highlight' 
                    break;
                default:
                    titleNice.value = ''
                    break;
            }
        })
        
        onMounted(() => {
            // Setup leaflet
            setupLeafletMap({
                interactive: interactive.value,
                snaphot: snapshot.value,
            })
            
            // TODO Move mapbox to the backend
            // Setup MapBox
            if (interactive.value)
                setupMapbox()
            
            // if (snapshot.value) {
            //     toggleSnapshotMode()
            // }
        })
        // Stop jobs fetching active entities' locations
        onBeforeUnmount(() => {
            if (responsive.value) {
                FetchVehiclesLocationsJob.stop();
            }
        })
        // Activate main sidebar, set title
        const triggerFn = (type, name) => {
            if (!interactive) {
                console.log('Actions allowed only in interactive mode')
                return;
            }
            trigger.value = true
            title.value = type
        }
        // Watch for main sidebar activity, trigger offset accordingly
        watch(trigger, (val) => {
            if (val) {
                offsetMapFn(+1) 
            } else {
                offsetMapFn(-1) 
            }
        })
        // Watch for popups
        // watch(popups, (val) => {
        // }, { deep: true, }
        // )
        // Search with filters locally, on the backend and or on a service
        const searchFn = async (criteria) => {
            console.log(locations.value)
            console.log(movingObjects.value)
            // Search local 
            const localRes = []
            // (locations.value).concat(movingObjects.value).forEach((entity) => {
            //     console.log(entity.raw.properties)
            // })
            // Search backend
            // const searchBackendPromise = 
            // Search mapbox
            // const searchMapbox =
            // return await Promise.all(searchLocalPromise, searchBackendPromise, searchMapbox) 
        }
        
        // Parse GeoJSON's properties into a location dictionary
        const locationNice = (id) => {
            const loc = locations.value.find((location) => {
                return location.id == id
            })
            console.log(loc)
            const locNice = {
                id: loc.id,
                name: loc.raw.properties.name,
                street: loc.raw.properties.street,
                description: loc.raw.properties.description,
                googleMapsLink: loc.raw.properties.googleMapsLink,
                lat: loc.raw.geometry.coordinates[1],
                lon: loc.raw.geometry.coordinates[0],
            }
            return locNice
        }
        // Zoom in or out
        const zoomFn = (type) => {
            if (type == 'in')
                mapDiv.zoomIn()
            else if (type == 'out')
                mapDiv.zoomOut()
        }
        const createLocationFn = async (locationRaw) => {
            try {
                const location = new Location({ 
                    raw: locationRaw,
                });
                const resp = await location.save()
                emit('create:location', resp)
            } catch (error) {
                console.log(error)
                
            }
        }
        const toggleChangeLocationFn = (id) => {
        }
        const toggleEditLocationFn = (id) => {
        }
        // Show notification
        const throwNotifcation = ({
            error : Boolean = false,
            timeout,
            position,
        }) => {
        }
        const routeToEdit = ref({})
        // Set a route as editable
        // If no route is specified set the focused route entity the editable
        const setRouteEditableFn = (route) => {
            if (!route && focusedRoute.value) { 
                route = focusedRoute.value
            }
            const start = locationNice(route.start)
            const destination = locationNice(route.destination)
            const intermediaryLocations = []
            if (route.intermediaryLocations)
                route.intermediaryLocations.forEach((loc) => {
                    intermediaryLocations.push(locationNice(loc))
                })
            routeToEdit.value = {
                start,
                destination,
                intermediaryLocations,
            }
        }
        const locationToEdit = ref({})
        // Set a location as editable
        // If no location is specified set the focused location entity the editable
        const setLocationEditableFn = (location) => {
            if (location) {
                locationToEdit.value = location
                return;
            }
            if (focusedLocation.value) {
                locationToEdit.value = focusedLocation.value
            }
        }
        // offset map, called when main sidebar is active or a popup window appears
        const offsetMapFn = (dir) => {
            // Calculate the offset
            const offset = mapDiv.getSize().x*0.15;
            // Then move the map
            mapDiv.panBy(new L.Point(dir * offset, 0), {
                animate: true,
                duration: 0.5,
            });
        }
        const focusSearchFn = (active) => {
            if (active) {
                recommendationActive.value = true
                searchActive.value = false
            }
            else {
                recommendationActive.value = false
                setTimeout(() => {
                    searchActive.value = false
                }, 500); 
            }
        }
        const leaveSearchFn = (leave) => {
            if (leave) {
                if (!recommendationActive.value)
                    searchActive.value = false
                else {
                    searchActive.value = true
                }
            } else {
                searchActive.value = true
            }
            
        }
        const dummyLocationLayer = ref()
        const focusBeforeCreateFn = (coord) => {
            createDummyLocationFn(coord)
        }
        const createDummyLocationFn = (coord) => {
            if (dummyLocationLayer.value) {
                mapDiv.removeLayer(dummyLocationLayer.value)
            }
            // create a new marker using the icon style
            const marker = L.marker([coord.lat, coord.lon],{
                icon: icon.greenIcon
            }).addTo(mapDiv)
            mapDiv.flyTo([marker._latlng.lat, marker._latlng.lng], 8)
            dummyLocationLayer.value = marker
        }
        const changeTypeBeforeCreateFn = (type) => {
            switch (type) {
                case 'loading':
                    changeIconFn(dummyLocationLayer.value, icon.car2)
                    break;
                case 'loading':
                    changeIconFn(dummyLocationLayer.value, icon.loading)
                    break;
                case 'unloading':
                    changeIconFn(dummyLocationLayer.value, icon.unloading)
                    break;
                case 'meetup':
                    changeiconfn(dummylocationlayer.value, icon.meetup)
                    break;
                case 'store':
                    changeiconfn(dummylocationlayer.value, icon.store)
                    break;
                case 'border-crossing':
                    changeiconfn(dummylocationlayer.value, icon['border-crossing'])
                    break;
                case 'checkpoint':
                    changeiconfn(dummylocationlayer.value, icon.checkpoint)
                    break;
                default:
                    break;
            }
        }
        const updatePopupBeforeCreateFn = (data) => {
            let popup = ''
            if (data.name)
                popup += `<div style="font-weight: bold;text-decoration: underline;">${data.name}<div><br/>`
            if (data.description)
                popup += `<p>${data.description}<p>`
            if (dummyLocationLayer) {
                dummyLocationLayer.value.bindPopup(popup)
                dummyLocationLayer.value.openPopup();
            }
        }
        const setRouteActiveFn = (routeLayer) => {
            routeLayer.setStyle({
                color: '#3388ff',
                weight: 5,
            })
        }
        const mapMoving = ref(false)
        const blockMouseFn = () => {
            if (!mapMoving.value)
                mapDiv.dragging.disable();
            mapDiv.touchZoom.disable();
            mapDiv.doubleClickZoom.disable();
            mapDiv.scrollWheelZoom.disable();
            mapDiv.boxZoom.disable();
            mapDiv.keyboard.disable();
        }
        const unblockMouseFn = () => {
            mapDiv.dragging.enable();
            mapDiv.touchZoom.enable();
            mapDiv.doubleClickZoom.enable();
            mapDiv.scrollWheelZoom.enable();
            mapDiv.boxZoom.enable();
            mapDiv.keyboard.enable();
        }
        const updateLocationFn = async (locationRaw) => {
            console.log(locationToEdit.value.id)
            try {
                const location = Location.find(locationToEdit.value.id)
                location.raw = locationRaw
                const resp = await location.update(['raw'])
                emit('update:location', resp)
            } catch (error) {
                console.log(error)
                
            }
        }
        return {
            center,
            center, 
            zoomLevel, 
            interactive, 
            positions, 
            locations, 
            routes, 
            movingObjects,
            snapshot,
            trigger,
            add,
            triggerFn,
            responsive,
            zoomFn,
            title,
            titleNice,
            searchCriteria,
            searchResults,
            searchFn,
            darkMode,
            options: [1, 2, 3],
            model: ref(),
            createLocationFn,
            focused,
            locationNice,
            toggleChangeLocationFn,
            toggleEditLocationFn,
            focusOnLocationFn,
            routeToEdit,
            locationToEdit,
            overlay,
            mapContainer,
            searchActive,
            recommendationActive,
            leaveSearchFn,
            focusedRoute,
            focusedLocation,
            focusSearchFn,
            focusBeforeCreateFn,
            highlights,
            changeTypeBeforeCreateFn,
            updatePopupBeforeCreateFn,
            setRouteActiveFn,
            blockMouseFn,
            unblockMouseFn,
            mapMoving,
            updateLocationFn,
        }
    },
    components: {
        CreateLocationComponent,
        CreateRouteComponent,
        EditLocationComponent,
        EditRouteComponent,
    }
}
// TODO
// set routes[0] and locations[0] as initial selected routes
// Zoom on select
// Hover popup
</script>