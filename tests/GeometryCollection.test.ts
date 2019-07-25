import GeometryCollection from "../src/GeometryCollection";
import { GeometryType } from "../src/GeometryType";
import Point from "../src/Point";
import Utils from "./Utils";
import LineString from "../src/LineString";

describe('GeometryCollection', () => {
    it('constructor', () => {
        let gc = new GeometryCollection();
        expect(gc.children.length).toBe(0);
        expect(gc.type).toBe(GeometryType.GeometryCollection);

        gc.children.push(new Point());
        expect(gc.children.length).toBe(1);
    });

    it('json', () => {
        let gc = new GeometryCollection();
        let json = gc.json();
        Utils.validateJsonResult(json, 'GeometryCollection');
    });

    it('wkt', () => {
        const geom = new GeometryCollection([
            new Point(1, 2),
            new LineString([
                { x: 23.4, y: -87 },
                { x: -23.4, y: 87 }
            ])
        ]);

        const wkt = geom.wkt();
        expect(wkt).toEqual('GEOMETRYCOLLECTION(POINT(1 2),LINESTRING(23.4 -87,-23.4 87))');
    });
});