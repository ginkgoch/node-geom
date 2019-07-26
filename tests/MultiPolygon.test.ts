import LinearRing from "../src/LinearRing";
import Utils from "./Utils";
import Polygon from "../src/Polygon";
import MultiPolygon from "../src/MultiPolygon";

describe('MultiPolygon', () => {
    it('constructor', () => {
        let mp = new MultiPolygon();
        expect(mp.children.length).toBe(0);

        let rings = [
            new LinearRing(Utils.randomRing(6)),
            new LinearRing(Utils.randomRing(6)),
            new LinearRing(Utils.randomRing(6))
        ];
        let p1 = new Polygon(rings[0], ...rings.slice(1));
        expect(p1.externalRing.coordinatesFlat().length).toBe(6);
        expect(p1.internalRings.length).toBe(2);

        mp.children.push(p1);
        expect(mp.children.length).toBe(1);
    });

    it('json', () => {
        let multiPolygon = new MultiPolygon();

        let json = multiPolygon.json();
        Utils.validateJsonResult(json, 'MultiPolygon');
    });

    it('wkt', () => {
        const mp = new MultiPolygon([
            new Polygon(new LinearRing([{ x: 0, y: 0 }, { x: 30, y: 0 }, { x: 30, y: 30 }, { x: 0, y: 0 }])),
            new Polygon(new LinearRing([{ x: 10, y: 10 }, { x: 130, y: 10 }, { x: 130, y: 130 }, { x: 10, y: 10 }]))
        ]);

        const wkt = mp.wkt();
        expect(wkt).toEqual('MULTIPOLYGON(((0 0,30 0,30 30,0 0)),((10 10,130 10,130 130,10 10)))');
    });
});