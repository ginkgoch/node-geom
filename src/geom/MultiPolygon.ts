/// <reference path="../types/Jsts.ts" />

import Polygon from "./Polygon";
import Geometry from "./Geometry";
import { GeometryType } from "./GeometryType";
import GeometryCollectionBase from "./GeometryCollectionBase";
import ICoordinate from "../base/ICoordinate";

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

    protected _clone(convert?: (coordinate: ICoordinate) => ICoordinate): Geometry {
        return new MultiPolygon(this._cloneChildren(convert));
    }

    static _from(multiPolygon: jsts.geom.MultiPolygon): MultiPolygon {
        const geom = new MultiPolygon();
        const polygonCount = multiPolygon.getNumGeometries();
        for(let i = 0; i < polygonCount; i++) {
            geom.children.push(Polygon._from(<jsts.geom.Polygon>multiPolygon.getGeometryN(i)));
        }

        return geom;
    } 
}