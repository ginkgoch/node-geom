import Geometry from "./Geometry";
import { GeometryType } from "./GeometryType";
import GeometryCollectionBase from "./GeometryCollectionBase";
import GeometryFactory from "./GeometryFactory";
import IGeoJson from "../base/IGeoJson";
import ICoordinate from "../base/ICoordinate";

/**
 * @category geom
 * @class
 * @description This class represents the GeometryCollection geometry.
 */
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

    json(): IGeoJson {
        return {
            type: this.type,
            geometries: this._geometries.map(g => g.json())
        }
    }

    _ts(): jsts.geom.Geometry {
        return Geometry._factory.createGeometryCollection(this.children.map(l => l._ts()));
    }

    protected _clone(convert?: (coordinate: ICoordinate) => ICoordinate): Geometry {
        return new GeometryCollection(this._cloneChildren(convert));
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