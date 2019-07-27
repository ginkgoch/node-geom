import Utils from "../shared/Utils";
import Point from "../../src/geom/Point";
import Polygon from "../../src/geom/Polygon";
import Geometry from "../../src/geom/Geometry";
import LineString from "../../src/geom/LineString";
import LinearRing from "../../src/geom/LinearRing";
import MultiPoint from "../../src/geom/MultiPoint";
import MultiPolygon from "../../src/geom/MultiPolygon";
import MultiLineString from "../../src/geom/MultiLineString";
import GeometryFactory from "../../src/geom/GeometryFactory";
import GeometryCollection from "../../src/geom/GeometryCollection";

describe('GeometryFactory', () => {
    it('create point', () => {
        const geom = new Point(34.222, 23.321);
        testCreate(geom);
    });

    it('create line', () => {
        const geom = new LineString(
            Utils.randomLineString(5)
        );

        testCreate(geom);
    });

    it('create ring', () => {
        const geom = new LinearRing(
            Utils.randomLineString(5)
        );

        testCreate(geom);
    });

    it('create polygon', () => {
        const geom = new Polygon(
            new LinearRing(Utils.randomLineString(5)),
            new LinearRing(Utils.randomLineString(7))
        );

        testCreate(geom);
    });

    it('create multi point', () => {
        const geom = new MultiPoint([
            Utils.randomPoint(),
            Utils.randomPoint(),
            Utils.randomPoint(),
            Utils.randomPoint()
        ].map(c => new Point(c.x, c.y)));

        testCreate(geom);
    });

    it('create multi line', () => {
        const geom = new MultiLineString([
            new LineString(Utils.randomLineString(3)),
            new LineString(Utils.randomLineString(5)),
            new LineString(Utils.randomLineString(2))
        ]);

        testCreate(geom);
    });

    it('create multi polygon', () => {
        const geom = new MultiPolygon([
            new Polygon(new LinearRing(Utils.randomRing(6))),
            new Polygon(new LinearRing(Utils.randomRing(5))),
            new Polygon(new LinearRing(Utils.randomRing(9)))
        ]);

        testCreate(geom);
    });

    it('create geometry collection', () => {
        const geom = new GeometryCollection([
            new Polygon(new LinearRing(Utils.randomRing(6))),
            new Point(34.222, 23.321),
            new LineString(Utils.randomLineString(3))
        ]);

        testCreate(geom);
    });
});

function testCreate(geom: Geometry) {
    const wkt = geom.wkt();
    const point2 = GeometryFactory.create(wkt);
    const point3 = GeometryFactory.create(geom._ts());

    expect(geom).toEqual(point2);
    expect(geom).toEqual(point3);
}