# Vue3-Map

Vue3-Map is a mobile first, lightweight, responsive map component for Vue.js v3 built on Leaflet.  
Visualize locations, routes and more.  
Built in overlay support.

## Install

npm install vue-map --save

## Demo

[Live Demo](https://google.com)

``` html
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
  <template #overlay>
    <!-- <button
        @click="switchOverlay"
    >button</button> -->
  </template>
</Map>
```

## Props

### model-value

## Slots

### Overlay

Overlay with customizable z-index.

### Events

### Methods

zoomIn
zoomOut
lockMap
disable

### <location>

### Route <route :from="" :to="">

## Directory structure

```
src   
├── App.vue  
├── assets                              # Logos   
│   ├── static-object-green.png            
│   └── static-object-red.png   
├── components  
│   ├── map.d.ts                        # types  
│   ├── Map.json                        # documentation   
│   ├── Map.ts                          #    
│   ├── Map.vue                         # Main Vue component   
│   ├── Notification.vue                # Default overlay components   
│   └── util                            # Utils   
│       └── util.ts  
├── data.ts                             # Demo data  
├── index.ts  
└── main.ts  
```

<!--
TODO
  .github workflow
  update readme
  make overlay a single object rather than 4
-->