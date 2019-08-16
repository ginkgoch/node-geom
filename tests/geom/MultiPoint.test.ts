import Utils from "../shared/Utils";
import Point from "../../src/geom/Point";
import MultiPoint from "../../src/geom/MultiPoint";
import GeometryFactory from "../../src/geom/GeometryFactory";

describe('MultiPoint', () => {
    it('constructor', () => {
        let mp = new MultiPoint();
        expect(mp.coordinatesFlat().length).toBe(0);

        let ccs = [
            Utils.randomPoint(),
            Utils.randomPoint(),
            Utils.randomPoint(),
            Utils.randomPoint()
        ];

        mp = new MultiPoint(ccs.map(c => new Point(c.x, c.y)));
        expect(mp.coordinatesFlat().length).toBe(4);
        
        for (let index = 0; index < ccs.length; index++) {
            const element = ccs[index];
            expect(mp.coordinatesFlat()[index]).toEqual(element);
        }
    });

    it('center', () => {
        let mp = new MultiPoint([
            new Point(0, 0),
            new Point(25, 25),
            new Point(0, 25),
            new Point(25, 0),
        ]);

        let c = mp.centroid();
        expect(c.x).toBe(12.5);
        expect(c.y).toBe(12.5);
    });

    it('envelope', () => {
        let mp = new MultiPoint([
            new Point(0, 0),
            new Point(25, 25),
            new Point(0, 25),
            new Point(25, 0),
        ]);

        let env = mp.envelope();
        expect(env).toEqual({
            minx: 0,
            miny: 0,
            maxx: 25,
            maxy: 25
        })
    });

    it('json', () => {
        let geom = new MultiPoint();
        let json = geom.toJSON();
        Utils.validateJsonResult(json, 'MultiPoint');

        let geom2 = GeometryFactory.create(json);
        expect(geom2).toEqual(geom);
    });

    it('wkt', () => {
        const mp = new MultiPoint([
            new Point(0, 0),
            new Point(25, 25),
            new Point(0, 25),
            new Point(25, 0),
        ]);

        const wkt = mp.toWKT();
        expect(wkt).toEqual('MULTIPOINT((0 0),(25 25),(0 25),(25 0))');
    });

    it('wkb', () => {
        const wkt = 'MULTIPOINT((0 0),(25 25),(0 25),(25 0))';
        const wkb = '010400000004000000010100000000000000000000000000000000000000010100000000000000000039400000000000003940010100000000000000000000000000000000003940010100000000000000000039400000000000000000';
        Utils.validateWkbAndWktAreEqual(wkt, wkb);
    });
});