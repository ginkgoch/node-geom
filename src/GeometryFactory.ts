import * as jsts from 'jsts';
import LinearRing from "./LinearRing";
import Point from "./Point";
import Polygon from "./Polygon";
import Geometry from "./Geometry";
import MultiPoint from "./MultiPoint";
import LineString from "./LineString";
import IGeoJson from './base/IGeoJson';
import WkbUtils from './shared/WkbUtils';
import MultiLineString from "./MultiLineString";
import GeometryCollection from "./GeometryCollection";

export default class GeometryFactory {
    static create(geomTS: jsts.geom.Geometry): Geometry
    static create(wkt: string): Geometry
    static create(wkb: Buffer): Geometry
    static create(geoJson: IGeoJson): Geometry
    static create(param: string | Buffer | jsts.geom.Geometry | IGeoJson): Geometry {
        if (param instanceof jsts.geom.Geometry) {
            return GeometryFactory._createByGeom(param);
        } else if (param instanceof Buffer) {
            return WkbUtils.wkbToGeom(param);
        } else if (typeof param === 'string') {
            return GeometryFactory._createByWkt(param);
        } else {
            return GeometryFactory._createByGeoJson(param);
        }
    }

    private static _createByWkt(wkt: string): Geometry {
        const reader = new jsts.io.WKTReader();
        const geomTS = reader.read(wkt);
        const geom = GeometryFactory.create(geomTS);
        return geom;
    }

    private static _createByGeom(geom: jsts.geom.Geometry): Geometry {
        if (geom instanceof jsts.geom.Point) {
            return Point._from(geom);
        } else if (geom instanceof jsts.geom.LineString) {
            return LineString._from(geom);
        } else if (geom instanceof jsts.geom.LinearRing) {
            return LinearRing._from(geom);
        } else if (geom instanceof jsts.geom.Polygon) {
            return Polygon._from(geom);
        } else if (geom instanceof jsts.geom.MultiLineString) {
            return MultiLineString._from(geom);
        } else if (geom instanceof jsts.geom.MultiPoint) {
            return MultiPoint._from(geom);
        } else if (geom instanceof jsts.geom.GeometryCollection) {
            return GeometryCollection._from(geom);
        } else {
            throw new Error(`${geom} is not supported.`);
        }
    }

    private static _createByGeoJson(json: IGeoJson): Geometry {
        const reader = new jsts.io.GeoJSONReader();
        const geom = reader.read(json)
        return GeometryFactory._createByGeom(geom);
    }
}