import IFeature from "../base/IFeature";
import Constants from "../shared/Constants";
import { Geometry } from "..";

export default class Feature implements IFeature {
    id: number = 0;    
    geometry: Geometry;
    properties: Map<string, any>;

    /**
     * Construct a feature instance.
     * @param {Geometry} geom The geometry in the feature. It is required.
     * @param {Map<string, any>} properties The properties of this feature. Default is empty map.
     * @param id The id of this feature. Default is 0.
     */
    constructor(geom: Geometry, properties?: Map<string, any>, id?: number) {
        this.geometry = geom;
        if (id !== undefined) {
            this.id = id;
        }
        this.properties = new Map<string, any>();
        if (properties !== undefined) {
            properties.forEach((v, k, m) => {
                this.properties.set(k, v);
            })
        }
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