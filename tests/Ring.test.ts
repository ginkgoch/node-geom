import _ from "lodash";
import Utils from "./Utils";
import Ring from "../src/Ring";
import Envelope from "../src/Envelope";
import { GeometryType } from "../src/GeometryType";

describe('Ring', () => {
    it('constructor', () => {
        let ring = new Ring();
        expect(ring.type).toBe(GeometryType.Polygon);
        expect(ring.coordinatesFlat().length).toBe(0);

        let [v1, v2, v3, v4] = [
            Utils.randomPoint(),
            Utils.randomPoint(),
            Utils.randomPoint(),
            Utils.randomPoint()
        ];
        
        ring = new Ring([v1, v2, v3, v4, v1]);
        expect(ring.coordinatesFlat().length).toBe(5);
    });

    it('coordinates - 1', () => {
        let [v1, v2, v3, v4] = [
            Utils.randomPoint(),
            Utils.randomPoint(),
            Utils.randomPoint(),
            Utils.randomPoint()
        ];

        let r = [v1, v2, v3, v4];
        
        let ring = new Ring(r);
        expect(ring.coordinatesFlat().length).toBe(5);
        for (let i = 0; i < r.length; i++) {
            expect(ring.coordinatesFlat()[i]).toEqual(r[i]);
        }

        expect(ring.coordinatesFlat()[4]).toEqual(r[0]);
    });

    it('coordinates - 2', () => {
        let [v1, v2, v3, v4] = [
            Utils.randomPoint(),
            Utils.randomPoint(),
            Utils.randomPoint(),
            Utils.randomPoint()
        ];

        let r = [v1, v2, v3, v4, v1];
        
        let ring = new Ring(r);
        expect(ring.coordinatesFlat().length).toBe(5);
        for (let i = 0; i < r.length; i++) {
            expect(ring.coordinatesFlat()[i]).toEqual(r[i]);
        }
    });

    it('isClosed', () => {
        let [v1, v2, v3, v4] = [
            Utils.randomPoint(),
            Utils.randomPoint(),
            Utils.randomPoint(),
            Utils.randomPoint()
        ];
        
        let ring = new Ring([v1, v2, v3, v4]);
        expect(ring.closed()).toBeTruthy();

        ring = new Ring([v1, v2, v3, v4, v1]);
        expect(ring.closed()).toBeTruthy();

        ring._coordinates.splice(4, 1);
        expect(ring.closed()).toBeFalsy();
    });

    it('centroid/envelope', () => {
        const r = Utils.randomRing(5);
        const ring = new Ring(r);

        const env1 = Envelope.from(ring.coordinatesFlat());
        const c1 = env1.centroid();
        const c2 = ring.centroid();

        expect(c1).toEqual(c2);
    });

    it('json', () => {
        let geom = new Ring();
        let json = geom.json();
        Utils.validateJsonResult(json, 'Polygon');
    });

    it('wkt', () => {
        const [v1, v2, v3, v4] = [
            {x: 1.2, y: 4.5},
            {x: 2, y: 3.99},
            {x: 22, y: 32.111},
            {x: 43.4, y: 78.222}
        ];
        
        const ring = new Ring([v1, v2, v3, v4]);
        const wkt = ring.wkt();
        expect(wkt).toEqual('LINEARRING(1.2 4.5,2 3.99,22 32.111,43.4 78.222,1.2 4.5)');
    });
});