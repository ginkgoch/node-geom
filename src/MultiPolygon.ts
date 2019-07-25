import Polygon from "./Polygon";
import { GeometryType } from "./GeometryType";
import GeometryCollectionBase from "./GeometryCollectionBase";
import Geometry from "./Geometry";

export default class MultiPolygon extends GeometryCollectionBase<Polygon> {
    constructor(polygon?: Polygon[]) {
        super(polygon);
    }
    
    get type(): GeometryType {
        return GeometryType.MultiPolygon;
    }

    _ts(): jsts.geom.Geometry {
        return Geometry._factory.createMultiPolygon(this.children.map(l => l._ts() as jsts.geom.Polygon));
    }
}