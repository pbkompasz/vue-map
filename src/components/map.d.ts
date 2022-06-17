interface StaticObject {
    id: number,
}

interface MovingObject {
    id: Number,
    object: Model,
}

interface Route {
    id: number
    name?: string,
    raw: GeoJsonObject,
}

export interface Model {
    
}

export interface Color {
    type: string, 
    values: [Number, Number, Number], 
    alpha: Number
}

export interface Icon {
    name: string,ovin
    url: string,
    fs: string,
}

export type IModelValue = StaticObject | MovingObject | Route

export interface CustomTileLayer {
    attribution: string,
    [ name: string]: any,
}