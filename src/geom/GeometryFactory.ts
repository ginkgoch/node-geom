import * as jsts from 'jsts';
import LinearRing from "./LinearRing";
import Point from "./Point";
import Polygon from "./Polygon";
import Geometry from "./Geometry";
import MultiPoint from "./MultiPoint";
import LineString from "./LineString";
import IGeoJSON from '../base/IGeoJSON';
import WKBUtils from '../shared/WkbUtils';
import MultiLineString from "./MultiLineString";
import GeometryCollection from "./GeometryCollection";
import { IEnvelope, ICoordinate } from '..';

export default class GeometryFactory {
    static buildCircle(center: ICoordinate, radius: number, segments: number = 36): Polygon {
        if (segments < 4) {
            throw new Error('segments must be greater than 3.');
        }

        let angle = 2 * Math.PI / segments;
        let coordinates = new Array<ICoordinate>();
        for (let i = 0; i < segments; i++) {
            let x = center.x + radius * Math.cos(angle * i);
            let y = center.y - radius * Math.sin(angle * i);
            coordinates.push({ x, y });
        }

        coordinates.push({ x: coordinates[0].x, y: coordinates[0].y });
        return new Polygon(new LinearRing(coordinates));
    }

    static buildEllipse(center: ICoordinate, radiusX: number, radiusY: number, segments: number = 36): Polygon {
        if (segments < 4) {
            throw new Error('segments must be greater than 3.');
        }

        let angle = 2 * Math.PI / segments;
        let coordinates = new Array<ICoordinate>();
        for (let i = 0; i < segments; i++) {
            let x = center.x + radiusX * Math.cos(angle * i);
            let y = center.y - radiusY * Math.sin(angle * i);
            coordinates.push({ x, y });
        }

        coordinates.push({ x: coordinates[0].x, y: coordinates[0].y });
        return new Polygon(new LinearRing(coordinates));
    }

    static buildStar(center: ICoordinate, vertexCount: number, radiusLong: number, radiusShort?: number): Polygon {
        if (vertexCount < 3) {
            throw new Error('vertexCount must be larger than 2.')
        }

        radiusShort = radiusShort || radiusLong * .5;

        let step = Math.PI / vertexCount;
        let coordinates = new Array<ICoordinate>();
        for (let i = 0; i < vertexCount * 2; i++) {
            let radius = i % 2 === 0 ? radiusLong : radiusShort;
            let x = center.x + radius * Math.cos(step * i);
            let y = center.y - radius * Math.sin(step * i);
            coordinates.push({ x, y });
        }

        coordinates.push({ x: coordinates[0].x, y: coordinates[0].y });
        return new Polygon(new LinearRing(coordinates));
    }

    static buildSquare(center: ICoordinate, sideLength: number): Polygon {
        let sideLengthHalf = sideLength * 0.5;
        let coordinates = new Array<ICoordinate>();
        coordinates.push({ x: center.x + sideLengthHalf, y: center.y + sideLengthHalf });
        coordinates.push({ x: center.x + sideLengthHalf, y: center.y - sideLengthHalf });
        coordinates.push({ x: center.x - sideLengthHalf, y: center.y - sideLengthHalf });
        coordinates.push({ x: center.x - sideLengthHalf, y: center.y + sideLengthHalf });
        coordinates.push({ x: coordinates[0].x, y: coordinates[0].y });

        return new Polygon(new LinearRing(coordinates));
    }

    static buildRectangle(center: ICoordinate, width: number, height: number): Polygon {
        let widthHalf = width * 0.5;
        let heightHalf = height * 0.5;
        let coordinates = new Array<ICoordinate>();
        coordinates.push({ x: center.x + widthHalf, y: center.y + heightHalf });
        coordinates.push({ x: center.x + widthHalf, y: center.y - heightHalf });
        coordinates.push({ x: center.x - widthHalf, y: center.y - heightHalf });
        coordinates.push({ x: center.x - widthHalf, y: center.y + heightHalf });
        coordinates.push({ x: coordinates[0].x, y: coordinates[0].y });

        return new Polygon(new LinearRing(coordinates));
    }

    /**
     * @deprecated Use envelopeAsPolygon(envelope: IEnvelope) instead.
     */
    static createPolygon(envelope: IEnvelope) {
        return this.envelopeAsPolygon(envelope);
    }

    static envelopeAsPolygon(envelope: IEnvelope) {
        return new Polygon(this.createLinearRing(envelope));
    }

    /**
     * @deprecated Use envelopeAsLinearRing(envelope: IEnvelope) instead.
     */
    static createLinearRing(envelope: IEnvelope) {
        return this.envelopeAsLinearRing(envelope);
    }

    static envelopeAsLinearRing(envelope: IEnvelope) {
        return new LinearRing([
            [envelope.minx, envelope.maxy],
            [envelope.maxx, envelope.maxy],
            [envelope.maxx, envelope.miny],
            [envelope.minx, envelope.miny],
            [envelope.minx, envelope.maxy]
        ].map(v => ({ x: v[0], y: v[1] })));
    }

    static create(geomTS: jsts.geom.Geometry): Geometry
    static create(wkt: string): Geometry
    static create(wkb: Buffer): Geometry
    static create(geoJson: IGeoJSON): Geometry
    static create(param: string | Buffer | jsts.geom.Geometry | IGeoJSON): Geometry {
        if (param instanceof jsts.geom.Geometry) {
            return GeometryFactory._createByGeom(param);
        } else if (param instanceof Buffer) {
            return WKBUtils.wkbToGeom(param);
        } else if (typeof param === 'string') {
            return GeometryFactory._createByWKT(param);
        } else {
            return GeometryFactory._createByGeoJSON(param);
        }
    }

    private static _createByWKT(wkt: string): Geometry {
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

    private static _createByGeoJSON(json: IGeoJSON): Geometry {
        const reader = new jsts.io.GeoJSONReader();
        const geom = reader.read(json)
        return GeometryFactory._createByGeom(geom);
    }
}