interface IStaticObject {
    id: number,
}

type IFetchMask = Object

interface IActiveObject {
    id: Number,
    object: Model,
    fetch: Function,
    fetchMask: IFetchMask,
}

interface IRoute {
    id: number
    name?: string,
    raw: GeoJsonObject,
}

export interface IColor {
    type: string, 
    values: [Number, Number, Number], 
    alpha: Number
}

export interface IIcon {
    name: string,
    url: string,
    fs: string,
}

export type IModelValue = IStaticObject | IActiveObject | IRoute

export interface ICustomTileLayer {
    attribution: string,
    [ name: string]: any,
}

export type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'