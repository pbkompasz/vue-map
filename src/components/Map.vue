<template>
  <div id="mapContainer" ref="mapContainer" :style="[mapStyle]">
    <div class="overlay edit" v-if="type !== 'snapshot'" :style="[mapStyle]">
      <div
        style="
          z-index: 5000;
          position: absolute;
          margin-left: 100px;
          padding: 50px;
          width: 100%;
          height: 100%;
        "
        id="notification"
        v-if="notifications.length > 0"
        @mouseover="blockMouseFn"
        @mouseleave="unblockMouseFn"
      >
        <div style="background-color: blue; width: 200px; height: 200px">
          popup
        </div>
      </div>
      <slot
        name="overlay"
        @mouseover="blockMouseFn"
        @mouseleave="unblockMouseFn"
      >
        <div class="buttons">
          <button
            type="button"
            onclick="alert('Hello world!')"
            @click="zoomFn('in')"
          >
            +
          </button>
          <button
            type="button"
            onclick="alert('Hello world!')"
            @click="zoomFn('out')"
          >
            -
          </button>
        </div>
      </slot>
    </div>
  </div>
</template>

<style scoped lang="sass">
#mapContainer
  width: 400px
  height: 400px
  z-index: 0
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
.buttons
  display: flex
  flex-direction: column
  gap: 5px
  margin: 5px
  position: absolute
  // top: calc(400px - 5px - 10px - 25px - 25px)
  // left: calc(400px - 25px - 10px)
button
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
import {
  ref,
  onMounted,
  watch,
  onUnmounted,
  computed,
  toRefs,
  useSlots,
} from 'vue';

import 'leaflet/dist/leaflet.css';
import L, { LayerOptions, TileLayer, TileLayerOptions } from 'leaflet';
import GeoJSON, { GeoJsonObject } from 'geojson';

import { VueMap, useMapProps, useMapEmits } from './Map';
import type { IColor, IIcon, IModelValue, Position } from './types/map';

import { validateColor, validateIcon } from './util/util';

const slots = useSlots();
const props = defineProps(useMapProps);
// const emit = defineEmits(useMapEmits);

// Leaflet entry point
let mapDiv: any;
// Map container ref
const mapContainer = ref(null);
// Overlay ref
const overlay = ref(null);
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
  tileLayer: L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  }),
};

const height = ref();
const width = ref();

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
} = toRefs(props);

watch(
  () => props.height,
  (val) => {
    if (typeof val === 'string' && val.includes('px')) {
      height.value = val.substring(0, val.indexOf('px'));
    } else {
      height.value = val;
    }
  },
  {
    immediate: true,
  }
);

watch(
  () => props.width,
  (val) => {
    if (typeof val === 'string' && val.includes('px')) {
      width.value = val.substring(0, val.indexOf('px'));
    } else {
      width.value = val;
    }
  },
  {
    immediate: true,
  }
);

watch(
  () => props.type,
  (val) => {
    switch (val) {
      case 'snapshot':
        console.log('Snapshot');
        // block mouse events on overlay
        // block mouse events for each component
        break;
      case 'responsive':
        break;
      default:
        break;
    }
  },
  {
    immediate: true,
  }
);

const background = computed(() => {
  return dark.value ? 'white' : 'dark';
});

const emit = defineEmits(['subscribe:user', 'subscribe']);

// Leaflet setup method
const setupLeafletMapFn = () => {
  // Constructor with center location
  // @ts-ignore
  mapDiv = L.map(mapContainer.value, {
    closePopupOnClick: type.value === 'snapshot' ? false : true,
    dragging: type.value === 'snapshot' ? false : true,
    zoomControl: false,
    attributionControl: false,
  }).setView(center.value.geometry.coordinates.reverse(), zoomLevel.value);

  setTileLayerFn('default');

  // L.Icon.Default.prototype.options.iconUrl = 'https://png.pngtree.com/png-vector/20190223/ourmid/pngtree-vector-house-icon-png-image_695369.jpg',
  // setupIconFn()
  // blockEventsOverOverlayFn()
};

// const setTileLayerFn = (type: string='custom', tileLayerUrl: string|null=null, tileLayerAttribution: string|null=null, maxZoom: number = 25) => {
const setTileLayerFn = (
  type?: 'dark' | 'default',
  tileLayer?: {
    urlTemplate: string;
    options: { attribution: string; [name: string]: any };
  }
) => {
  mapDiv.removeLayer(map.tileLayer);
  switch (type) {
    case 'dark':
      map.tileLayer = L.tileLayer(
        'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
        {
          maxZoom: 25,
          attribution:
            '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
        }
      );
      break;
    case 'default':
      // Default tileLayer is already stored
      break;
    default:
      if (tileLayer)
        map.tileLayer = L.tileLayer(tileLayer.urlTemplate, tileLayer.options);
      // Default tile layer remains
      break;
  }
  map.tileLayer.addTo(mapDiv);
};

// TODO
const notifications = ref([]);

watch(dark, (val) => {
  if (val) {
    setTileLayerFn('dark');
  } else {
    // Switches back to original tile if it exists or default
    setTileLayerFn();
  }
});

watch(
  () => props.tileLayer,
  (val) => {
    // @ts-ignore
    setTileLayerFn(undefined, val);
  }
);

const vMap = ref(new VueMap());

onMounted(() => {
  verifySlots();
  // verifyStyles()
  setupLeafletMapFn();
  setupMapStyling();
  setupMapBehaviour();
});

// TODO Check for misspellings, wrong values and such
function verifyStyles() {}

function setupMapStyling() {
  if (dark.value) {
    setTileLayerFn('dark');
  }
}

// TODO Move to Map.ts
function setupMapBehaviour() {
  if (disableDoubleClickZoom) mapDiv.doubleClickZoom.disable();
  // if (disableDoubleClickZoom) VMap.disableDoubleClickZoom
  if (disableScroolWheelZoom) mapDiv.scrollWheelZoom.disable();
  // if (disableDoubleClickZoom) VMap.disableScrollWheelZoom
  blockEventsOverOverlayFn();
}

// Style object
const baseMapStyle = ref({
  width: '400px',
  height: '400px',
});

// Style object
const mapStyle = ref({
  width: width.value + 'px',
  height: height.value + 'px',
});

// Overlay style
// TODO Bootstrap
const overlayStyle = ref({
  zIndex: overlayZindex.value,
});

// TODO Mouse event blocking
const mapMoving = ref(false);

const blockEventsOverOverlayFn = () => {
  mapDiv.on('movestart', () => {
    mapMoving.value = true;
  });
  mapDiv.on('moveend', () => {
    mapMoving.value = false;
  });
  return;
};

const blockMouseFn = () => {
  if (!mapMoving.value) mapDiv.dragging.disable();
  mapDiv.touchZoom.disable();
  mapDiv.doubleClickZoom.disable();
  mapDiv.scrollWheelZoom.disable();
  mapDiv.boxZoom.disable();
  mapDiv.keyboard.disable();
};

const unblockMouseFn = () => {
  mapDiv.dragging.enable();
  mapDiv.touchZoom.enable();
  mapDiv.doubleClickZoom.enable();
  mapDiv.scrollWheelZoom.enable();
  mapDiv.boxZoom.enable();
  mapDiv.keyboard.enable();
};

function verifySlots() {
  let warnMessage = '';
  if (slots.default) {
    for (const property in slots) {
      if (property != 'default') {
        warnMessage += "'" + property + "' ";
      }
    }
  }
  if (slots['overlay']) {
    for (const property in slots) {
      if (property != 'overlay' && property != 'default') {
        warnMessage += "'" + property + "' ";
      }
    }
  }
  if (slots['overlay-left']) {
    if (slots['overlay-left-bottom']) {
      warnMessage += "'overlay-left-bottom '";
    }
    if (slots['overlay-left-top']) {
      warnMessage += "'overlay-left-top '";
    }
  }
  if (slots['overlay-right']) {
    if (slots['overlay-right-bottom']) {
      warnMessage += "'overlay-right-bottom '";
    }
    if (slots['overlay-right-top']) {
      warnMessage += "'overlay-right-top '";
    }
  }
  if (showDevWarnings && warnMessage) {
    console.warn('The following slots will be ignored: ' + warnMessage);
  }
}

// TODO
// Zoom in or out
function zoomFn(type: 'in' | 'out') {
  console.log('zooming');
  if (type == 'in') mapDiv.zoomIn();
  else if (type == 'out') mapDiv.zoomOut();
}

function refreshMap() {}
</script>



