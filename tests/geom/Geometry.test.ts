import { Point, LineString, GeometryFactory, Polygon } from "../../src";

describe('Geometry', () => {
    it('interior point 1', () => {
        let geom = new Point(20, 20);
        let interior = geom.interiorPoint();

        expect(interior).toEqual({ x: 20, y: 20 });
    });

    it('interior point 2', () => {
        let geom = new LineString([{ x: 0, y: 0 }, {x:10, y: 10}]);
        let interior = geom.interiorPoint();

        expect(interior).toEqual({ x: 0, y: 0 });
    });

    it('interior point 3', () => {
        let geom = GeometryFactory.create('POLYGON((20 10, 30 0, 40 10, 30 20, 20 10))') as Polygon;
        let interior = geom.interiorPoint();

        expect(interior).toEqual({ x: 30, y: 15 });
    });

    it('disjoint', () => {
        let geom1 = GeometryFactory.envelopeAsPolygon({ minx: -10, miny: -10, maxx: 10, maxy: 10 });
        let geom2 = GeometryFactory.envelopeAsPolygon({ minx: -30, miny: -10, maxx: -20, maxy: 10 });
        let disjoint = geom1.disjoint(geom2);
        expect(disjoint).toBeTruthy();
    });
});