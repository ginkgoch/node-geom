import Utils from "../shared/Utils";
import Polygon from "../../src/geom/Polygon";
import LinearRing from "../../src/geom/LinearRing";
import GeometryFactory from "../../src/geom/GeometryFactory";

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

        let geom2 = GeometryFactory.create(json);
        expect(geom2).toEqual(geom);
    });

    it('wkt', () => {
        const shell = [[1, 2], [3, 4], [5, 6], [1, 2]];
        const hole = [[2, 2], [4, 4], [6, 6], [2, 2]];

        let polygon = new Polygon(
            new LinearRing(shell.map(c => ({ x: c[0], y: c[1] }))), 
            new LinearRing(hole.map(c => ({ x: c[0], y: c[1] })))); 

        expect(polygon.externalRing.coordinates().length).toBe(4);
        expect(polygon.internalRings.length).toBe(1);

        let wkt = polygon.wkt();
        expect(wkt).toEqual('POLYGON((1 2,3 4,5 6,1 2),(2 2,4 4,6 6,2 2))');

        polygon = new Polygon(
            new LinearRing(shell.map(c => ({ x: c[0], y: c[1] })))
        ); 

        wkt = polygon.wkt();
        expect(wkt).toEqual('POLYGON((1 2,3 4,5 6,1 2))');
    });

    it('wkb', () => {
        const wkt = 'POLYGON((1 2,3 4,5 6,1 2))';
        const wkb = '01030000000100000004000000000000000000f03f00000000000000400000000000000840000000000000104000000000000014400000000000001840000000000000f03f0000000000000040';
        Utils.validateWkbAndWktAreEqual(wkt, wkb);
    });
});