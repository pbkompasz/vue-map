import { parseCenter } from "./util/util"
import L, { GeoJSONOptions, tileLayer } from 'leaflet'
import GeoJSON, { GeoJsonObject } from 'geojson'
import { IModelValue } from "./map"

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

export class VueMap {

    // default style values
    static readonly DEFAULT_WIDTH = 400
    static readonly DEFAULT_HEIGHT = 400
    static readonly ROUTE_DEFAULT_COLOR = '#615f5f'
    static readonly ROUTE_HIGHLIGHT_COLOR = '#ff0000'
    static readonly DEFAULT_COLOR = '#808080'
    static readonly DEFAULT_MAP_TYPE = 'interactive'
    static readonly DEFAULT_ZOOM_LEVEL = 25

    // default behaviour values
    // @ts-ignore WHY?
    static readonly DEFAULT_MAP_CENTER = GeoJSON.parse({
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
        type: VueMap.DEFAULT_MAP_TYPE,
        center: VueMap.DEFAULT_MAP_CENTER,
        zoomLevel: VueMap.DEFAULT_ZOOM_LEVEL,
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