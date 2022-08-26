<template>
    <div 
        id="mapContainer"
        ref="mapContainer"
        :style="[mapStyle]"
    >
         <div
            class="overlay edit"
            v-if="type!=='snapshot'"
            :style="[mapStyle]"
        >
            <div
                id="random-text"
            >
                <slot name="text">asdf</slot>
            </div>
            <div
                style="z-index: 5000; position: absolute; margin-left: 100px; padding: 50px;  width: 100%; height: 100%;"
                id="notification"
                v-if="notifications.length > 0"
                @mouseover="blockMouseFn"
                @mouseleave="unblockMouseFn"
            >
                <div
                    style="background-color: blue; width: 200px; height: 200px;"
                >
                    popup
                </div>
            </div>
            <slot name="overlay">
                <div
                    id="overlay-main"
                >
                    <div
                        class="overlay"
                        id="overlay-left"
                        @mouseover="blockMouseFn"
                        @mouseleave="unblockMouseFn"
                    >
                        <slot name="overlay-left">
                            <div
                                class="slot-column"
                            >
                                <div class="row">

                                    <div class="column" v-if="zoomButtonLocation=='top-left'">
                                        <button 
                                            type="button" 
                                            onclick="alert('Hello world!')"
                                            @click="zoomFn('in')"     
                                        >+</button>
                                        <button 
                                            type="button" 
                                            onclick="alert('Hello world!')"
                                            @click="zoomFn('out')"     
                                        >-</button>
                                    </div>
                                    <slot name="overlay-left-top"></slot>
                                </div>
                                <div class="row">
                                    <div class="column" v-if="zoomButtonLocation=='bottom-left'">
                                        <button 
                                            type="button" 
                                            onclick="alert('Hello world!')"
                                            @click="zoomFn('in')"     
                                        >+</button>
                                        <button 
                                            type="button" 
                                            onclick="alert('Hello world!')"
                                            @click="zoomFn('out')"     
                                        >-</button>
                                    </div>
                                    <slot name="overlay-left-bottom"></slot>
                                </div>
                            </div>
                        </slot>
                    </div>
                    <div
                        class="overlay"
                        id="overlay-right"
                        @mouseover="blockMouseFn"
                        @mouseleave="unblockMouseFn"
                    >
                        <slot name="overlay-right">
                            <div
                                class="slot-column"
                            >
                                <div class="row">
                                    <div class="column" v-if="zoomButtonLocation=='top-right'">
                                        <button 
                                            type="button" 
                                            onclick="alert('Hello world!')"
                                            @click="zoomFn('in')"     
                                        >+</button>
                                        <button 
                                            type="button" 
                                            onclick="alert('Hello world!')"
                                            @click="zoomFn('out')"     
                                        >-</button>
                                    </div>
                                    <slot name="overlay-right-top"></slot>
                                </div>
                                <div class="row">
                                    <div class="column" v-if="zoomButtonLocation=='bottom-right'">
                                        <button 
                                            type="button" 
                                            onclick="alert('Hello world!')"
                                            @click="zoomFn('in')"     
                                        >+</button>
                                        <button 
                                            type="button" 
                                            onclick="alert('Hello world!')"
                                            @click="zoomFn('out')"     
                                        >-</button>
                                    </div>
                                    <slot name="overlay-right-bottom"></slot>
                                </div>
                            </div>
                        </slot>
                    </div>
                </div>
            </slot>
        </div>
    </div> 
</template>

<style scoped lang="sass">
#mapContainer
    width: 400px
    height: 400px
    z-index:0
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

.overlay
    z-index: 4000

#overlay-main
    z-index: 4000
    display: flex
    flex-wrap: nowrap
    justify-content: space-between
    height: 100%
    width: 100%
    // TODO
    // background-color: rgba(0, 0, 0, 0.45)

#overlay-left
    z-index: 4000
#overlay-right
    z-index: 4000

.slot-column
    display: flex
    flex-direction: column 
    justify-content: space-between
    flex-wrap: nowrap
    height: 100%
    max-height: inherit

#random-text
    z-index: 4500
    position: absolute
    width: 100%
    height: 100%
    text-align: center
    display: flex
    flex-direction: column
    justify-content: center

.row
    display: flex

.column
    display: flex
    flex-direction: column

</style>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted, computed, toRefs, useSlots, } from 'vue'

import 'leaflet/dist/leaflet.css'
import L, { LayerOptions, TileLayer, TileLayerOptions } from 'leaflet'
import GeoJSON, { GeoJsonObject } from 'geojson'

import { VueMap } from './Map'
import { IColor, IIcon, IModelValue, Position } from './map'

import { validateColor, validateIcon } from './util/util'

const slots = useSlots()
const props = defineProps({
        // Content
        title: {
            type: String,
            default: 'Map',
            description: 'Map title',
        },
        // objects to be displayed
        modelValue: {
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
            default(rawProps: any) {
                return []
                // rawProps.map((prop) => {
                //     if (!prop.icon) prop.icon = DEFAULT_OBJECT_ICON
                //     if (!prop.icon) prop.icon = DEFAULT_OBJECT_ICON
                // })        
            },
        },
        // Map type
        type: {
            type: String,
            default: 'interactive',
            validator(val: 'interactive'| 'snapshot'| 'responsive') {
                return ['interactive', 'snapshot', 'responsive'].includes(val)
            }
        },
        // Center of the map
        center: {
            type: Object,
            // Center of europe
            default(rawProps: any)   {
                // @ts-ignore
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
            validator(value:GeoJsonObject) {
                return true;
            }
        },
        // Style
        // Zoom level
        zoomLevel: {
            type: Number,
            default: 7,
            validator(value: Number) {
                return value > 0;
            }
        },
        // Some color
        color: {
            type: String, 
            default: '(128, 128, 128, 0)',
        },
        // Tile layer
        tileLayer: {
            type: [String, Object],
            description: 'Used to load and display tile layers on the map',
            default() {
                // return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            },
            validator(value: { urlTemplate: string, options: { attribution: string, [name: string]: any }}) {
                // if (object...)
                // L.tileLayer(test)
                if (!value.urlTemplate) {
                    console.error('Missing tile Layer url! Using default tile layer')
                    return false
                }
                if (!value.options.attribution) {
                    console.warn('Missing tile layer attribution')
                }
                return true
            }
        },
        width: {
            type: [Number, String],
            default: 300,
            description: 'Map width in pixels',
            validator(val: string | number) {
                if (typeof val === 'string') {
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
            validator(val: number|string) {
                if (typeof val === 'string') {
                    const re = /[1-9]+px/;
                    return /^(([1-9][0-9]+)|(0))px$/.test(val)
                } 
                return val > 0
            },
        },
        square: {
            type: Boolean,
            default: false,
            description: 'height=width=min(height, width)',
        },
        // Default z-index for overlay
        // default text has this
        // than comes the overlay
        // then popup
        // then warnings, errors
        overlayZindex: {
            type: Number,
            default: 4000,
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
            defult: false,
        },
        // TODO download and replace default with those
        // Static object icon
        staticObjectIcon: {
            type: [String, Object, ],
            default: 'https://www.politiadefrontiera.ro/vault/images/ptfpin_green.png',
            // default: VueMap.DEFAULT_STATIC_OBJECT_ICON,
            validator(val: IIcon) {
                return validateIcon(val) 
            }
        },
        // Active object icon
        activeObjectIcon: {
            type: [String, Object, ],
            default: 'https://www.politiadefrontiera.ro/vault/images/ptfpin_green.png',
        },
        // Route start icon
        routeIconStart: {
            type: [String, Object, ],
            default: 'https://www.politiadefrontiera.ro/vault/images/ptfpin_green.png',
        },
        // Route destination icon
        routeIconDest: {
            type: [String, Object, ],
            default: 'https://www.politiadefrontiera.ro/vault/images/ptfpin_green.png',
        },
        // Route default color
        routeColor: {
            type: String,
            default: VueMap.ROUTE_DEFAULT_COLOR,
            validator(val: IColor) {
                return validateColor(val)
            },
            description: 'Default color for every route',
        },
        // Route active color
        routeColorActive: {
            type: String,
            default: VueMap.ROUTE_DEFAULT_ACTIVE_COLOR,
            validator(val: IColor) {
                return validateColor(val)
            },
            description: 'Default active color for every route',
        },
        // Active color for every object
        activeColor: {
            type: [String, Function],
            default: VueMap.DEFAULT_ACTIVE_COLOR,
            validator(val: IColor) {
                return validateColor(val)
            },
            description: 'Default active color for every object',
        },
        blurMap: {
            type: Boolean,
            default: false,
            // TODO
            description: 'Backgrond-color of the overlay',
        },
        darkenMap: {
            type: Boolean,
            default: false,
            description: 'Backgrond-color of the overlay is set to transparent grey'
        },
        disableZoomButton: {
            type: Boolean,
            default: false,
        },
        zoomButtonLocation: {
            type: String,
            default: 'top-left',
            validator(val: Position) {
                if (!['top-left', 'top-right', 'bottom-left', 'bottom-right'].includes(val)) {
                    return false
                }
                return true
            }
        },
        // Behaviour
        // TODO
        blockMouseEvents: {
            type: Boolean,
            default: false,
            description: 'Block mouse events',
        },
        // TODO
        controlZoom: {
            type: Boolean,
            default: false,
            description: 'When performing zoom with the mousewheel the ctrl button will have to be pressed. \'Use ctrl + scroll to zoom the map\' message will be shown.'
        },
        disableDoubleClickZoom: {
            type: Boolean,
            default: false,
            description: 'Disable zoom-in when double right clicking with mouse',
        },
        disableScroolWheelZoom: {
            type: Boolean,
            default: false,
            description: 'Disable zoom with scroll wheel',
        },
        // dev
        showDevWarnings: {
            type: Boolean, 
            default: true,
            description: 'Show developer warnings, errors in console',
        }
        // vehicle icon
        // route default color
        // route highlight color
        // zoom on location when selected
        // show zoom buttons

        // emit click event
        // 
})

// Leaflet entry point
let mapDiv : any
// Map container ref
const mapContainer = ref(null)
// Overlay ref
const overlay = ref(null)
// TODO
// https://gis.stackexchange.com/questions/225098/using-google-maps-static-tiles-with-leaflet
// Hybrid,

// googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
//     maxZoom: 20,
//     subdomains:['mt0','mt1','mt2','mt3']
// });
// satellite,

// googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
//     maxZoom: 20,
//     subdomains:['mt0','mt1','mt2','mt3']
// });
// Terrain

// googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
//     maxZoom: 20,
//     subdomains:['mt0','mt1','mt2','mt3']
// });
// Note that difference in the "lyrs" parameter in the URL:

// Hybrid: s,h;
// Satellite: s;
// Streets: m;
// Terrain: p;

// const vueMap = ref(new VueMap({}))

const map = {
    // tileLayer: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //     maxZoom: 25,
    //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    // }),
    tileLayer: L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    })
}


const height = ref()
const width = ref()  

const {
    dark,
    type,
    center,
    zoomLevel,
    overlayZindex,
    showDevWarnings,
    disableDoubleClickZoom,
    disableScroolWheelZoom,
    zoomButtonLocation,
} = toRefs(props)

watch(() => props.height, (val) => {
    if (typeof val === 'string' && val.includes('px')) {
        height.value = val.substring(0, val.indexOf('px'))
    } else {
        height.value = val
    }
}, {
    immediate: true,
})



watch(() => props.width, (val) => {
    if (typeof val === 'string' && val.includes('px')) {
        width.value = val.substring(0, val.indexOf('px'))
    } else {
        width.value = val
    }
}, {
    immediate: true,
})

watch(() => props.type, (val) => {
    switch (val) {
        case 'snapshot':
            console.log('Snapshot') 
            // block mouse events on overlay
            // block mouse events for each component
            break
        case 'responsive': 
        
            break
        default:
            break
    }
}, {
    immediate: true,
})



const background = computed(() => {
    return (dark.value) ? 'white' : 'dark'
})


const emit = defineEmits(['subscribe:user', 'subscribe'])

// Leaflet setup method
const setupLeafletMapFn = () => {
    // Constructor with center location
    // @ts-ignore
    mapDiv = L.map(mapContainer.value, {
        closePopupOnClick: type.value === 'snapshot' ? false : true,
        dragging: type.value === 'snapshot' ? false : true,
        zoomControl: false,
        attributionControl:false,
    }).setView(center.value.geometry.coordinates.reverse(), zoomLevel.value)
    
    setTileLayerFn('default', )
 
    // L.Icon.Default.prototype.options.iconUrl = 'https://png.pngtree.com/png-vector/20190223/ourmid/pngtree-vector-house-icon-png-image_695369.jpg',
    // setupIconFn()
    // blockEventsOverOverlayFn()
} 

// const setTileLayerFn = (type: string='custom', tileLayerUrl: string|null=null, tileLayerAttribution: string|null=null, maxZoom: number = 25) => {
const setTileLayerFn = (type?: 'dark' | 'default', tileLayer?: { urlTemplate: string, options: { attribution: string, [name: string]: any } }, ) => {
    mapDiv.removeLayer(map.tileLayer)
    switch (type) {
        case 'dark':
            map.tileLayer  = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
                maxZoom: 25,
                attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors' 
            })
            break;
        case 'default':
            // Default tileLayer is already stored
            break;
        default: 
            if (tileLayer)
                map.tileLayer  = L.tileLayer(tileLayer.urlTemplate, tileLayer.options)
            // Default tile layer remains 
            break
    }
    map.tileLayer.addTo(mapDiv)
}

// TODO
const notifications = ref([])

watch(dark, (val) => {
    if (val) {
        setTileLayerFn('dark')
    } else {
        // Switches back to original tile if it exists or default
        setTileLayerFn()
    }
})

watch(() => props.tileLayer, (val) => {
    // @ts-ignore
    setTileLayerFn(undefined , val)
})

const vMap = ref(new VueMap())

onMounted(() => {
    verifySlots()
    // verifyStyles()
    setupLeafletMapFn()
    setupMapStyling()
    setupMapBehaviour()
})

// TODO Check for misspellings, wrong values and such
function verifyStyles() {

}

function setupMapStyling() {
    if (dark.value) {
        setTileLayerFn('dark')
    }
}

// TODO Move to Map.ts
function setupMapBehaviour() {
    if (disableDoubleClickZoom) mapDiv.doubleClickZoom.disable()
    // if (disableDoubleClickZoom) VMap.disableDoubleClickZoom
    if (disableScroolWheelZoom) mapDiv.scrollWheelZoom.disable()
    // if (disableDoubleClickZoom) VMap.disableScrollWheelZoom
    blockEventsOverOverlayFn()
}

// Style object
const baseMapStyle = ref({
    width: '400px',
    height: '400px',
})

// Style object
const mapStyle = ref({
    width: width.value + 'px',
    height: height.value + 'px',
})

// Overlay style
// TODO Bootstrap
const overlayStyle = ref({
    zIndex: overlayZindex.value,
})

// TODO Mouse event blocking
const mapMoving = ref(false)

const blockEventsOverOverlayFn = () => {
    mapDiv.on('movestart', () => {
        mapMoving.value = true
    })
    mapDiv.on('moveend', () => {
        mapMoving.value = false
    })
    return;
}

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

function verifySlots() {
    let warnMessage = ''
    if (slots.default) {
        for (const property in slots) {
            if (property != 'default') {
                warnMessage += '\'' + property + '\' '
            }
        }
    }
    if (slots['overlay']) {
        for (const property in slots) {
            if (property != 'overlay' && property != 'default') {
                warnMessage += '\'' + property + '\' '
            }
        }
    }
    if (slots['overlay-left']) {
        if (slots['overlay-left-bottom']) {
            warnMessage += '\'overlay-left-bottom \''
        }
        if (slots['overlay-left-top']) {
            warnMessage += '\'overlay-left-top \''
        }
    }
    if (slots['overlay-right']) {
        if (slots['overlay-right-bottom']) {
            warnMessage += '\'overlay-right-bottom \''
        }
        if (slots['overlay-right-top']) {
            warnMessage += '\'overlay-right-top \''
        }
    }
    if (showDevWarnings && warnMessage) {
        console.warn('The following slots will be ignored: ' + warnMessage)
    }
}

// TODO
// Zoom in or out
function zoomFn(type: 'in' | 'out') {
    console.log('zooming')
    if (type == 'in')
        mapDiv.zoomIn()
    else if (type == 'out')
        mapDiv.zoomOut()
}

function refreshMap() {

}



</script>



