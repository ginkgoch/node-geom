import Utils from "../shared/Utils";
import Point from "../../src/geom/Point";
import LineString from "../../src/geom/LineString";
import { GeometryType } from "../../src/geom/GeometryType";
import GeometryFactory from "../../src/geom/GeometryFactory";
import GeometryCollection from "../../src/geom/GeometryCollection";

describe('GeometryCollection', () => {
    it('constructor', () => {
        let gc = new GeometryCollection();
        expect(gc.children.length).toBe(0);
        expect(gc.type).toBe(GeometryType.GeometryCollection);

        gc.children.push(new Point());
        expect(gc.children.length).toBe(1);
    });

    it('json', () => {
        let geom = new GeometryCollection([
            new Point(1, 2),
            new LineString([
                { x: 23.4, y: -87 },
                { x: -23.4, y: 87 }
            ])
        ]);
        let json = geom.toJSON();
        Utils.validateJsonResult(json, 'GeometryCollection');

        let geom2 = GeometryFactory.create(json);
        expect(geom2).toEqual(geom);
    });

    it('wkt', () => {
        const geom = new GeometryCollection([
            new Point(1, 2),
            new LineString([
                { x: 23.4, y: -87 },
                { x: -23.4, y: 87 }
            ])
        ]);

        const wkt = geom.toWKT();
        expect(wkt).toEqual('GEOMETRYCOLLECTION(POINT(1 2),LINESTRING(23.4 -87,-23.4 87))');
    });

    it('wkb', () => {
        const wkt = 'GEOMETRYCOLLECTION(POINT(1 2),LINESTRING(23.4 -87,-23.4 87))';
        const wkb = '0107000000020000000101000000000000000000f03f000000000000004001020000000200000066666666666637400000000000c055c066666666666637c00000000000c05540';
        Utils.validateWkbAndWktAreEqual(wkt, wkb);
    });
});