import Point from "./Point";
import GeometryCollectionBase from "./GeometryCollectionBase";
import { GeometryType } from "./GeometryType";
import Geometry from "./Geometry";

export default class MultiPoint extends GeometryCollectionBase<Point> {
    constructor(points?: Point[]) {
        super(points);
    }
    
    get type(): GeometryType {
        return GeometryType.MultiPoint;
    }

    _ts(): jsts.geom.Geometry {
        return Geometry._factory.createMultiPoint(this.children.map(c => c._ts() as jsts.geom.Point));
    }
}