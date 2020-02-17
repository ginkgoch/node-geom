import Utils from "../shared/Utils";
import LineString from "../../src/geom/LineString";
import { GeometryType } from "../../src/geom/GeometryType";
import GeometryFactory from "../../src/geom/GeometryFactory";
import Point from "../../src/geom/Point";

describe('LineString', () => {
    it('constructor', () => {
        let line = new LineString();
        expect(line.type).toBe(GeometryType.LineString);
        expect(line.coordinatesFlat().length).toBe(0);

        let r = [
            Utils.randomPoint(),
            Utils.randomPoint(),
            Utils.randomPoint(),
            Utils.randomPoint()
        ];
        line = new LineString(r);
        expect(line.coordinatesFlat().length).toBe(4);

        for(let i = 0; i < r.length; i++) {
            expect(line.coordinatesFlat()[i]).toBe(r[i]);
        };
    });

    it('centroid', () => {
        let line = new LineString([
            {x: 0, y: 0},
            {x: 100, y: 100}
        ]);

        let c = line.centroid();
        expect(c.x).toBe(50);
        expect(c.y).toBe(50);
    });

    it('envelope', () => {
        let line = new LineString([
            {x: 0, y: 0},
            {x: 100, y: 100}
        ]);

        let c = line.envelope();
        expect(c).toEqual({ minx: 0, miny: 0, maxx: 100, maxy: 100 });
    });

    it('json', () => {
        let line = new LineString([
            {x: 0, y: 0},
            {x: 100, y: 100}
        ]);

        let json = line.toJSON();
        Utils.validateJsonResult(json, 'LineString');

        let line2 = GeometryFactory.create(json);
        expect(line2).toEqual(line);
    });

    it('wkt', () => {
        const line = new LineString([
            {x: 0, y: 0},
            {x: 100, y: 100}
        ]);

        const wkt = line.toWKT();
        expect(wkt).toEqual('LINESTRING(0 0,100 100)');
    })

    it('wkb', () => {
        const wkt = 'LINESTRING(0 0,100 100)';
        const wkb = '0102000000020000000000000000000000000000000000000000000000000059400000000000005940';
        Utils.validateWkbAndWktAreEqual(wkt, wkb);
    });

    it('from number array', () => {
        let line = LineString.fromNumbers(0, 0, 10, 10);
        expect(line._coordinates.length).toBe(2);
        expect(line._coordinates[0]).toEqual({ x: 0, y: 0 });
        expect(line._coordinates[1]).toEqual({ x: 10, y: 10 });

        line = LineString.fromNumbers(0, 0, 10, 10, 50);
        expect(line._coordinates.length).toBe(2);
        expect(line._coordinates[0]).toEqual({ x: 0, y: 0 });
        expect(line._coordinates[1]).toEqual({ x: 10, y: 10 });

        expect(() => {
            LineString.fromNumbers(0, 0, 10)
        }).toThrow(/coordinates must have at least/i);
    });

    it('from points', () => {
        let line = LineString.fromPoints(new Point(0, 0), new Point(10, 10), new Point(5, 0));
        expect(line._coordinates.length).toBe(3);
    });
});