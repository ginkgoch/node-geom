import MultiLineString from "../src/MultiLineString";
import Utils from "./Utils";
import LineString from "../src/LineString";

describe('MultiLineString', () => {
    it('constructor', () => {
        let multiLine = new MultiLineString();
        expect(multiLine.children.length).toBe(0);

        let lines = [
            new LineString(Utils.randomLineString(4)),
            new LineString(Utils.randomLineString(4)),
            new LineString(Utils.randomLineString(4))
        ]

        multiLine = new MultiLineString(lines);
        expect(multiLine.children.length).toBe(3);
    });

    it('coordinates', () => {
        let [v1, v2, v3, v4, v5, v6] = [
            Utils.randomPoint(),
            Utils.randomPoint(),
            Utils.randomPoint(),
            Utils.randomPoint(),
            Utils.randomPoint(),
            Utils.randomPoint()
        ];

        let line1 = new LineString([v1, v2, v3]);
        let line2 = new LineString([v3, v4, v5]);
        let line3 = new LineString([v5, v6]);
        let multiLine = new MultiLineString([line1, line2, line3]);
        expect(multiLine.coordinatesFlat().length).toBe(8);
        expect(multiLine.coordinatesFlat()).toEqual([
            v1, v2, v3, v3, v4, v5, v5, v6
        ]);
    });

    it('json', () => {
        let line = new MultiLineString();

        let json = line.json();
        Utils.validateJsonResult(json, 'MultiLineString');
    });

    it('wkt', () => {
        const line1 = new LineString([
            {x: 1, y: 2},
            {x: 10.9, y: -2.88}
        ]);
        const line2 = new LineString([
            {x: -1, y: 20},
            {x: -10.9, y: -2.88}
        ]);

        const ml = new MultiLineString([line1, line2]);
        const wkt = ml.wkt();
        expect(wkt).toEqual('MULTILINESTRING((1 2,10.9 -2.88),(-1 20,-10.9 -2.88))');
    });
});