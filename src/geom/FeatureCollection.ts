import Feature from "./Feature";
import Envelope from "./Envelope";
import Constants from "../shared/Constants";
import IGeoJSON from "../base/IGeoJSON";
import { IFeature } from "..";

/** @category Features */
export default class FeatureCollection {
    id = 0
    features = new Array<Feature>();
    type = Constants.TYPE_FEATURE_COLLECTION;

    constructor(features?: Array<IFeature>, id?: number) {
        if (id !== undefined) this.id = id;

        if (features === undefined) return;

        features.forEach(f => this.features.push(Feature.create(f)));
    }

    envelope() {
        return Envelope.unionAll(this.features.map(f => f.envelope()));
    }

    toJSON() {
        return {
            id: this.id,
            type: this.type,
            features: this.features.map(f => f.toJSON())
        };
    }

    /**
     * 
     * @deprecated This method is deprecated. Please use parseJSON() instead.
     */
    static create(json: IGeoJSON): FeatureCollection {
        if (json.type !== Constants.TYPE_FEATURE_COLLECTION) {
            throw new Error('Not a FeatureCollection json.');
        }

        if (json.features === undefined) {
            throw new Error('Invalid FeatureCollection json.')
        }

        const features = json.features.map(f => Feature.create(f));
        return new FeatureCollection(features, json.id);
    }

    static parseJSON(json: IGeoJSON): FeatureCollection {
        if (json.type !== Constants.TYPE_FEATURE_COLLECTION) {
            throw new Error('Not a FeatureCollection json.');
        }

        if (json.features === undefined) {
            throw new Error('Invalid FeatureCollection json.')
        }

        const features = json.features.map(f => Feature.create(f));
        return new FeatureCollection(features, json.id);
    }
}