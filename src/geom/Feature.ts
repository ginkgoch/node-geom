import IFeature from "../base/IFeature";
import Constants from "../shared/Constants";
import { Geometry } from "..";

export default class Feature implements IFeature {
    id: number = 0;    
    geometry: Geometry;
    properties: Map<string, any>;

    constructor(geom: Geometry) {
        this.id = 0;
        this.geometry = geom;
        this.properties = new Map<string, any>();
    }

    get type(): string {
        return Constants.TYPE_FEATURE;
    }

    json() {
        const properties = {} as any;
        this.properties.forEach((v, k, m) => {
            properties[k] = v;
        });

        return {
            id: this.id,
            type: this.type,
            geometry: this.geometry.json(),
            properties
        };
    }
}