import Polygon from "../src/Polygon";
import Utils from "./Utils";
import Ring from "../src/Ring";

describe('Polygon', () => {
    it('constructor', () => {
        let p = new Polygon();
        expect(p.externalRing).not.toBeUndefined();
        expect(p.externalRing).not.toBeNull();
        expect(p.externalRing.coordinatesFlat().length).toBe(0);
        expect(p.internalRings.length).toBe(0);
    });

    it('json', () => {
        let geom = new Polygon();
        let json = geom.json();
        Utils.validateJsonResult(json, 'Polygon');
    });

    it('wkt', () => {
        const shell = [[1, 2], [3, 4], [5, 6], [1, 2]];
        const hole = [[2, 2], [4, 4], [6, 6], [2, 2]];

        let polygon = new Polygon(
            new Ring(shell.map(c => ({ x: c[0], y: c[1] }))), 
            new Ring(hole.map(c => ({ x: c[0], y: c[1] })))); 

        expect(polygon.externalRing.coordinates().length).toBe(4);
        expect(polygon.internalRings.length).toBe(1);

        let wkt = polygon.wkt();
        expect(wkt).toEqual('POLYGON((1 2,3 4,5 6,1 2),(2 2,4 4,6 6,2 2))');

        polygon = new Polygon(
            new Ring(shell.map(c => ({ x: c[0], y: c[1] })))
        ); 

        wkt = polygon.wkt();
        expect(wkt).toEqual('POLYGON((1 2,3 4,5 6,1 2))');
    });
});