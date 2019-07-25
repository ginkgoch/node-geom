import Geometry from "./Geometry";
import { GeometryType } from "./GeometryType";
import GeometryCollectionBase from "./GeometryCollectionBase";

export default class GeometryCollection extends GeometryCollectionBase<Geometry> {
    constructor(geometries?: Geometry[]) {
        super(geometries);
    }

    get type(): GeometryType {
        return GeometryType.GeometryCollection;
    }

    get geometries() {
        return this._geometries;
    }

    _ts(): jsts.geom.Geometry {
        return Geometry._factory.createGeometryCollection(this.children.map(l => l._ts()));
    }
}