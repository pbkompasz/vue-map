import { GeoJsonObject } from "geojson";
import parse from 'parse-css-color'
import { Color } from "../Map";

const parseCenter = (center: string|Object|GeoJsonObject|any, defaultCenter: GeoJsonObject) => {
    const res = {
        lat: -1,
        lng: -1
    }
    switch (typeof center) {
        case 'string':
            res.lat = Number(center.split(',')[0])
            res.lng = Number(center.split(',')[1])
            break
        
        case 'object':
            if (!center) {
                console.warn('Missing center. Using default center')
                return defaultCenter
            }

            if (!center.lat) {
                throw new Error("Missing latitude field in center object");
                
            }
            if (!center.lng && !center.lon) {
                throw new Error("Missing longitude field in center object");
            }
            res.lat = Number(center.lat)
            res.lng = Number(center.lng || center.lon)
            break
    
        case 'undefined':
            console.warn('Undefined center. Using default center')
            return defaultCenter
            break

        default:
            throw new Error("Center type incompatible");
            break
    }
}

const parseColor = (color: string, defaultColor: Color|string) => {
    try {
        return parse(color) 
    } catch (error: any) {
        console.warn(`${color} is not valid. Setting default color: ${defaultColor}`) 
    }
}

export {
    parseCenter,
    parseColor,
}