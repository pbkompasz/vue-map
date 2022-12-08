import { parseCenter, validateColor, validateIcon } from "./util/util"
import L, { GeoJSONOptions, tileLayer } from 'leaflet'
import GeoJSON, { GeoJsonObject } from 'geojson'
import { IColor, IIcon, IModelValue } from "./types/map"

export class ModelValue {
    
    validate (modelValue: IModelValue[]) {
    const returnMap = new Map()
    modelValue.forEach((val) => {
        // check if every id is unique
        let id = val.id
        if (val.id) {
            if (returnMap.get(val.id)) {
                console.warn('Id not unique, some functionalities might not work!')
                id = Math.floor(Math.random() * 1000)
                while (returnMap.get(id)) {
                    id = Math.floor(Math.random() * 1000)
                }
            }
        }
        // ...
        returnMap.set(id, val)
    })
    return []
}
}

// TODO Decorators
// https://www.digitalocean.com/community/tutorials/how-to-use-decorators-in-typescript
// https://blog.logrocket.com/a-practical-guide-to-typescript-decorators/
// https://www.typescriptlang.org/docs/handbook/decorators.html
// 2. eslint
// 3. ci/cd
// 4. jsdoc
export class VueMap {

    static readonly DEFAULT_WIDTH = 400
    static readonly DEFAULT_HEIGHT = 400

    static readonly ROUTE_COLOR_DEFAULT = '#615f5f'
    static readonly ROUTE_COLOR_ACTIVE_DEFAULT = '#ff0000'
    static readonly COLOR_DEFAULT = '#808080'
    static readonly COLOR_ACTIVE_DEFAULT = '#ff0000'
    static readonly MAP_TYPE_DEFAULT = 'interactive'
    static readonly ZOOM_LEVEL_DEFAULT = 25

    // default behaviour values
    // @ts-ignore WHY?
    static readonly MAP_CENTER_DEFAULT = GeoJSON.parse({
        lat: 47.4811282,
        lng: 18.9902218
    }, { Point: ['lat', 'lng', ]})

    // default modelValue values

    // Leaflet entry point
    mapDiv : any
    // Main map object
    map = {
        tileLayer: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 25,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }),
        type: VueMap.MAP_TYPE_DEFAULT,
        center: VueMap.MAP_CENTER_DEFAULT,
        zoomLevel: VueMap.ZOOM_LEVEL_DEFAULT,
    }

    // Leaflet setup method
    setupLeafletMapFn = () => {
        // Constructor with center location
        // @ts-ignore
        mapDiv = L.map(mapContainer.value, {
            closePopupOnClick: this.map.type === 'snapshot' ? false : true,
            dragging: this.map.type === 'snapshot' ? false : true,
            zoomControl: false,
            attributionControl:false,
        }).setView(this.map.center.geometry.coordinates.reverse(), this.map.zoomLevel)

        
        this.setTileLayerFn('default', )
    
        // L.Icon.Default.prototype.options.iconUrl = 'https://png.pngtree.com/png-vector/20190223/ourmid/pngtree-vector-house-icon-png-image_695369.jpg',
        // setupIconFn()
        // blockEventsOverOverlayFn()
    } 

    setTileLayerFn = (type: string='custom', tileLayerUrl: string|null=null, tileLayerAttribution: string|null=null, maxZoom: number = 25) => {
        this.mapDiv.removeLayer(this.map.tileLayer)
        switch (type) {
            case 'dark':
                this.map.tileLayer  = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
                    maxZoom: 25,
                    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors' 
                })
                break;
            case 'default':
                this.map.tileLayer  = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 25,
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                })
                break;
            default: 
                if (tileLayerUrl && tileLayerAttribution)
                    this.map.tileLayer  = L.tileLayer(tileLayerUrl, {
                        maxZoom: maxZoom,
                        attribution: tileLayerAttribution,
                    })
                this.map.tileLayer  = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 25,
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                })
                break
        }
        this.map.tileLayer.addTo(this.mapDiv)
    }


    constructor(center?: Location|string, ) {
            
    }

}


export const useMapProps = {
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
        console.warn('Not array');
        return false;
      }
      for (const el of value) {
        if (!['static-object', 'active-object', 'route'].includes(el.type)) {
          return false;
        }
      }
      return true;
    },
    default(rawProps: any) {
      return [];
      // rawProps.map((prop) => {
      //     if (!prop.icon) prop.icon = DEFAULT_OBJECT_ICON
      //     if (!prop.icon) prop.icon = DEFAULT_OBJECT_ICON
      // })
    },
  },
  // Map type
  // TODO switch to disable boolean prop
  type: {
    type: String,
    default: 'interactive',
    validator(val: 'interactive' | 'snapshot' | 'responsive') {
      return ['interactive', 'snapshot', 'responsive'].includes(val);
    },
  },
  // Center of the map
  center: {
    type: Object,
    // Center of europe
    default(rawProps: any) {
      // @ts-ignore
      return GeoJSON.parse(
        {
          name: 'Location A',
          category: 'Store',
          street: 'Market',
          lat: 47.4811282,
          lng: 18.9902218,
        },
        { Point: ['lat', 'lng'] }
      );
      // [47.4811282, 18.9902218],
    },
    validator(value: GeoJsonObject) {
      return true;
    },
  },
  // Style
  // Zoom level
  zoomLevel: {
    type: Number,
    default: 7,
    validator(value: Number) {
      return value > 0;
    },
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
    validator(value: {
      urlTemplate: string;
      options: { attribution: string; [name: string]: any };
    }) {
      // if (object...)
      // L.tileLayer(test)
      if (!value.urlTemplate) {
        console.error('Missing tile Layer url! Using default tile layer');
        return false;
      }
      if (!value.options.attribution) {
        console.warn('Missing tile layer attribution');
      }
      return true;
    },
  },
  width: {
    type: [Number, String],
    default: 300,
    description: 'Map width in pixels',
    validator(val: string | number) {
      if (typeof val === 'string') {
        const re = /[1-9]+px/;
        return /^(([1-9][0-9]+)|(0))px$/.test(val);
      }
      return val > 0;
    },
  },
  height: {
    type: [Number, String],
    default: 300,
    description: 'Map width in pixels',
    validator(val: number | string) {
      if (typeof val === 'string') {
        const re = /[1-9]+px/;
        return /^(([1-9][0-9]+)|(0))px$/.test(val);
      }
      return val > 0;
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
    type: [String, Object],
    default: 'https://www.politiadefrontiera.ro/vault/images/ptfpin_green.png',
    // default: VueMap.DEFAULT_STATIC_OBJECT_ICON,
    validator(val: IIcon) {
      return validateIcon(val);
    },
  },
  // Active object icon
  activeObjectIcon: {
    type: [String, Object],
    default: 'https://www.politiadefrontiera.ro/vault/images/ptfpin_green.png',
  },
  // Route start icon
  routeIconStart: {
    type: [String, Object],
    default: 'https://www.politiadefrontiera.ro/vault/images/ptfpin_green.png',
  },
  // Route destination icon
  routeIconDest: {
    type: [String, Object],
    default: 'https://www.politiadefrontiera.ro/vault/images/ptfpin_green.png',
  },
  // Route default color
  routeColor: {
    type: String,
    default: VueMap.ROUTE_COLOR_DEFAULT,
    validator(val: IColor) {
      return validateColor(val);
    },
    description: 'Default color for every route',
  },
  routeWidth: {

  },
  // Route active color
  routeColorActive: {
    type: String,
    default: VueMap.ROUTE_COLOR_ACTIVE_DEFAULT,
    validator(val: IColor) {
      return validateColor(val);
    },
    description: 'Default active color for every route',
  },
  // Active color for every object
  activeColor: {
    type: [String, Function],
    default: VueMap.COLOR_ACTIVE_DEFAULT,
    validator(val: IColor) {
      return validateColor(val);
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
    description: 'Backgrond-color of the overlay is set to transparent grey',
  },
  disableZoomButton: {
    type: Boolean,
    default: false,
  },
  zoomButtonLocation: {
    type: String,
    default: 'top-left',
    validator(val: NewType) {
      if (
        !['top-left', 'top-right', 'bottom-left', 'bottom-right'].includes(val)
      ) {
        return false;
      }
      return true;
    },
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
    description:
      "When performing zoom with the mousewheel the ctrl button will have to be pressed. 'Use ctrl + scroll to zoom the map' message will be shown.",
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
  },
  // vehicle icon
  // route default color
  // route highlight color
  // zoom on location when selected
  // show zoom buttons

  // emit click event
  //
}

export const useMapEmits = []