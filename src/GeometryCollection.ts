import Geometry from "./Geometry";
import { GeometryType } from "./GeometryType";
import GeometryCollectionBase from "./GeometryCollectionBase";
import GeometryFactory from "./GeometryFactory";

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

    static _from(geometryCollection: jsts.geom.GeometryCollection): GeometryCollection {
        const geom = new GeometryCollection();
        const count = geometryCollection.getNumGeometries();
        for (let i = 0; i < count; i++) {
            geom.children.push(
                GeometryFactory.create(geometryCollection.getGeometryN(i))
            );
        }

        return geom;
    }
}