import Feature from "./Feature";
import Envelope from "./Envelope";

export default class FeatureCollection {
    id = 0
    features = new Array<Feature>();
    constructor(features?: Array<Feature>) {
        if (features === undefined) return;

        features.forEach(f => this.features.push(f));
    }

    envelope() {
        return Envelope.unionAll(this.features.map(f => f.envelope()));
    }
}