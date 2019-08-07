import Feature from "./Feature";
import Envelope from "./Envelope";
import Constants from "../shared/Constants";
import IGeoJson from "../base/IGeoJson";

export default class FeatureCollection {
    id = 0
    features = new Array<Feature>();
    type = Constants.TYPE_FEATURE_COLLECTION;

    constructor(features?: Array<Feature>, id?: number) {
        if (id !== undefined) this.id = id;

        if (features === undefined) return;

        features.forEach(f => this.features.push(f));
    }

    envelope() {
        return Envelope.unionAll(this.features.map(f => f.envelope()));
    }

    json() {
        return {
            id: this.id,
            type: this.type,
            features: this.features.map(f => f.json())
        };
    }

    static create(json: IGeoJson): FeatureCollection {
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