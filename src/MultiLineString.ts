import LineString from "./LineString";
import GeometryCollectionBase from "./GeometryCollectionBase";
import { GeometryType } from "./GeometryType";
import Geometry from "./Geometry";

export default class MultiLineString extends GeometryCollectionBase<LineString> {
    constructor(lines?: LineString[]) {
        super(lines);
    }
    
    get type(): GeometryType {
        return GeometryType.MultiLineString
    }

    _ts(): jsts.geom.Geometry {
        return Geometry._factory.createMultiLineString(this.children.map(l => l._ts() as jsts.geom.LineString));
    }
}