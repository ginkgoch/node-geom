import IFeature from "../base/IFeature";
import Constants from "../shared/Constants";
import { Geometry, IGeoJson, GeometryFactory } from "..";

export default class Feature implements IFeature {
    id: number = 0;    
    geometry: Geometry;
    properties: Map<string, any>;

    /**
     * Construct a feature instance.
     * @param {Geometry} geom The geometry in the feature. It is required.
     * @param {Map<string, any>} properties The properties of this feature. Default is empty map.
     * @param id The id of this feature. Default id is the same as geometry's id.
     */
    constructor(geom: Geometry|IGeoJson, properties?: Map<string, any>|any, id?: number) {
        if (geom instanceof Geometry) {
            this.geometry = geom;
        } else {
            this.geometry = GeometryFactory.create(geom);
        }

        if (id !== undefined) {
            this.id = id;
        } else {
            this.id = this.geometry.id;
        }

        this.properties = new Map<string, any>();
        if (properties !== undefined) {
            if (properties instanceof Map) {
                properties.forEach((v, k, m) => {
                    this.properties.set(k, v);
                });
            } else {
                Object.keys(properties).forEach(k => {
                    this.properties.set(k, properties[k])
                });
            }
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

    envelope() {
        return this.geometry.envelope();
    }

    clone(fields?: 'none' | 'all' | string[]) {
        const geomClone = this.geometry.clone();
        if (fields === undefined || fields === 'all') {
            return new Feature(geomClone, this.properties, this.id);
        } else if (fields === 'none') {
            return new Feature(geomClone, {}, this.id);
        } else {
            const props = new Map<string, any>();
            fields.filter(f => this.properties.has(f)).forEach(f => props.set(f, this.properties.get(f)));
            return new Feature(geomClone, props, this.id);
        }
    }
}