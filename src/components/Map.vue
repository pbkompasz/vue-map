<template>
    <div 
        id="mapContainer"
        style="z-index:0; width: 400px; height: 400px"
        ref="mapContainer"
        :style="[baseMapStyle, mapStyle]"
    >
    </div> 
</template>

<style scoped lang="sass">
#mapContainer
    width: 100%
    height: 100%
    min-width: 400px
    min-height: 400px
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

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted, computed, toRefs, } from 'vue'
import 'leaflet/dist/leaflet.css'
import L, { tileLayer } from 'leaflet'
import GeoJSON from 'geojson'

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
            validator(val: string) {
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
            validator(value) {
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
        // Static object icon
        staticObjectIcon: {
            type: [String, Object, ],
            default: 'https://www.politiadefrontiera.ro/vault/images/ptfpin_green.png',
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
            default: 'grey',
        },
        // Route active color
        routeColorActive: {
            type: String,
            default: 'red',
        },
        // Active color for every object
        activeColor: {
            type: [String, Function],
            default: 'red',
        },
        // Behaviour
        blockMouseEvents: {
            type: Boolean,
            default: false,
            description: 'Block mouse events',
        },
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

const map = {
    tileLayer: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 25,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }),
}


const height = ref()
const width = ref()  

const {
    dark,
    type,
    center,
    zoomLevel,
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

// defineProps<{ msg: string }>()

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

const setTileLayerFn = (type: string='custom', tileLayerUrl: string|null=null, tileLayerAttribution: string|null=null, maxZoom: number = 25) => {
    // TODO remove last tileLayer
    // let url = tileLayerUrl.value, maxZoom = tileLayerZoomLevel.value, attribution = tileLayerAttribution.value
    mapDiv.removeLayer(map.tileLayer)
    switch (type) {
        case 'dark':
            map.tileLayer  = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
                maxZoom: 25,
                attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors' 
            })
            break;
        case 'default':
            map.tileLayer  = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 25,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            })
            break;
        default: 
            if (tileLayerUrl && tileLayerAttribution)
                map.tileLayer  = L.tileLayer(tileLayerUrl, {
                    maxZoom: maxZoom,
                    attribution: tileLayerAttribution,
                })
            map.tileLayer  = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 25,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            })
            break
    }
    map.tileLayer.addTo(mapDiv)
}

watch(dark, (val) => {
    if (val) {
        setTileLayerFn('dark')
    } else {
        setTileLayerFn()
    }
})

onMounted(() => {
    setupLeafletMapFn()
    if (dark.value) {
        setTileLayerFn('dark')
    }
})

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

</script>



