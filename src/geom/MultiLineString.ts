/// <reference path="../types/Jsts.ts" />
import LineString from "./LineString";
import GeometryCollectionBase from "./GeometryCollectionBase";
import { GeometryType } from "./GeometryType";
import Geometry from "./Geometry";
import ICoordinate from "../base/ICoordinate";

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

    protected _clone(convert?: (coordinate: ICoordinate) => ICoordinate): Geometry {
        return new MultiLineString(this._cloneChildren(convert));
    }

    static _from(multiline: jsts.geom.MultiLineString): MultiLineString {
        const geom = new MultiLineString();
        const geomCount = multiline.getNumGeometries();
        for (let i = 0; i < geomCount; i++) {
            geom.children.push(LineString._from(<jsts.geom.LineString>multiline.getGeometryN(i)));
        }

        return geom;
    }
}