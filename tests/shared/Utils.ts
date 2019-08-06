import _ from "lodash";
import Geometry from "../../src/geom/Geometry";
import ICoordinate from "../../src/base/ICoordinate";
import GeometryFactory from "../../src/geom/GeometryFactory";
import Point from "../../src/geom/Point";
import LineString from "../../src/geom/LineString";
import LinearRing from "../../src/geom/LinearRing";
import Polygon from "../../src/geom/Polygon";
import MultiPoint from "../../src/geom/MultiPoint";
import MultiLineString from "../../src/geom/MultiLineString";
import MultiPolygon from "../../src/geom/MultiPolygon";

export default class Utils {
    static randomPoint() {
        const [x, y] = [Utils._randomHorizontal(), Utils._randomVertical()];
        return { x, y };
    }

    static randomPointGeometry() {
        const p = Utils.randomPoint();
        return new Point(p.x, p.y);
    }

    static randomLineString(count: number) {
        const line = new Array<ICoordinate>();
        _.range(count).forEach(i => line.push(
            Utils.randomPoint()
        ));

        return line;
    }

    static randomLineStringGeometry(count: number) {
        const l = Utils.randomLineString(count);
        return new LineString(l);
    }

    static randomRing(count: number) {
        const ring = new Array<ICoordinate>();
        _.range(count - 1).forEach(i => ring.push(
            Utils.randomPoint()
        ));

        ring.push(_.chain(ring).first().clone().value());
        return ring;
    }

    static randomRingGeometry(count: number) {
        const r = Utils.randomRing(count);
        return new LinearRing(r);
    }

    static randomPolygonGeometry() {
        return new Polygon(this.randomRingGeometry(5), this.randomRingGeometry(6));
    }

    static randomMultiPointGeometry(count: number) {
        return new MultiPoint(_.range(count).map(i => Utils.randomPointGeometry()));
    }

    static randomMultiLineStringGeometry(count: number) {
        return new MultiLineString(_.range(count).map(i => Utils.randomLineStringGeometry(6)));
    }

    static randomMultiPolygonGeometry(count: number) {
        return new MultiPolygon(_.range(count).map(i => Utils.randomPolygonGeometry()));
    }

    static _randomHorizontal() {
        return _.random(-180, 180, true);
    }

    static _randomVertical() {
        return _.random(-90, 90, true);
    }

    static validateJsonResult<T extends Geometry>(json: any, expectedTypeName: string) {
        expect(json).toHaveProperty('type');
        if (expectedTypeName === 'GeometryCollection') {
            expect(json).toHaveProperty('geometries');
        } else {
            expect(json).toHaveProperty('coordinates');
        }
        expect(json.type).toEqual(expectedTypeName);
    }

    static validateWkbAndWktAreEqual(wkt: string, wkb: string) {
        const geom1 = GeometryFactory.create(wkt);
        const geom2 = GeometryFactory.create(Buffer.from(wkb, 'hex'));
        expect(geom2).toEqual(geom1);
    }
}