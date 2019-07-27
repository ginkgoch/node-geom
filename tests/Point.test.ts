import Point from "../src/Point";
import Utils from "./Utils";
import { GeometryType } from "../src/GeometryType";
import GeometryFactory from "../src/GeometryFactory";

describe('Point', () => {
    it('constructor', () => {
        let point = new Point();
        expect(point.type).toBe(GeometryType.Point);

        expect(point.x).toBeNaN();
        expect(point.y).toBeNaN();

        let randX = Utils._randomHorizontal();
        let randY = Utils._randomVertical();

        point = new Point(randX);
        expect(point.x).toBe(randX);
        expect(point.y).toBeNaN();

        point = new Point(randX, randY);
        expect(point.x).toBe(randX);
        expect(point.y).toBe(randY);
    });

    it('centroid', () => {
        const r = Utils.randomPoint();
        const p = new Point(r.x, r.y);
        const c = p.centroid();
        expect(c.x).toBe(p.x);
        expect(c.y).toBe(p.y);
    });

    it('coordinates', () => {
        const r = Utils.randomPoint();
        const p = new Point(r.x, r.y);
        expect(p.coordinatesFlat().length).toBe(1);
    });

    it('envelope', () => {
        const r = Utils.randomPoint();
        const p = new Point(r.x, r.y);

        expect(p.envelope()).toEqual({
            minx: p.x,
            miny: p.y,
            maxx: p.x,
            maxy: p.y
        });
    });

    it('json', () => {
        let point = new Point();
        let json = point.json();
        Utils.validateJsonResult(json, 'Point');
    });

    it('wkt', () => {
        const p = new Point(23.4, 45.6);
        const wkt = p.wkt();
        expect(wkt).toEqual('POINT(23.4 45.6)');
    });

    it('wkb', () => {
        const p1 = new Point(23.4, 45.6);
        let wkb = p1.wkb();
        
        const p2 = GeometryFactory.create(wkb);
        expect(p2).toEqual(p1);

        wkb = Buffer.from('AQEAAAAAAAAAAAAkQAAAAAAAACRA', 'base64');
        const p3 = GeometryFactory.create(wkb);
        const p4 = new Point(10, 10);
        expect(p3).toEqual(p4);
    })
});