import Utils from "../shared/Utils";
import Point from "../../src/geom/Point";
import LineString from "../../src/geom/LineString";
import ICoordinate from "../../src/base/ICoordinate";
import Polygon from "../../src/geom/Polygon";
import MultiPoint from "../../src/geom/MultiPoint";
import MultiLineString from "../../src/geom/MultiLineString";
import MultiPolygon from "../../src/geom/MultiPolygon";

describe('Geometry clone', () => {
    it('point - clone', () => {
        const p1 = Utils.randomPointGeometry();
        const p2 = p1.clone() as Point;
        expect(p2).toEqual(p1);

        const p3 = p1.clone(convert) as Point;
        expect(p3.x).toBe(p1.x + 1);
        expect(p3.y).toBe(p1.y + 1);
    });

    it('line - clone', () => {
        const l1 = Utils.randomLineStringGeometry(15);
        expect(l1.coordinates().length).toBe(15);

        const l2 = l1.clone() as LineString;
        expect(l2).toEqual(l1);

        const l3 = l1.clone(convert) as LineString;
        for(let i = 0; i < l1.coordinates().length; i++) {
            expect(l3._coordinates[i].x).toBe(l1._coordinates[i].x + 1);
            expect(l3._coordinates[i].y).toBe(l1._coordinates[i].y + 1);
        }
    });

    it('polygon - clone', () => {
        const p1 = Utils.randomPolygonGeometry();

        const p2 = p1.clone() as Polygon;
        expect(p2).toEqual(p1);

        const p3 = p1.clone(convert) as Polygon;

        const rings1 = [p1.externalRing, ...p1.internalRings];
        const rings3 = [p3.externalRing, ...p3.internalRings];
        expect(rings1.length).toBe(rings3.length);

        for (let i = 0; i < rings1.length; i++) {
            for (let j = 0; j < rings1[i]._coordinates.length; j++) {
                expect(rings3[i]._coordinates[j].x).toBe(rings1[i]._coordinates[j].x + 1);
                expect(rings3[i]._coordinates[j].y).toBe(rings1[i]._coordinates[j].y + 1)
            }
        }
    });

    it('multi point - clone', () => {
        const geom1 = Utils.randomMultiPointGeometry(3);
        expect(geom1.children.length).toBe(3);

        const geom2 = geom1.clone() as MultiPoint;
        expect(geom2).toEqual(geom1);

        const geom3 = geom1.clone(convert) as MultiPoint;
        expect(geom3.children.length).toBe(geom1.children.length);

        for(let i = 0; i < geom1.children.length; i++) {
            expect(geom3.children[i].x).toBe(geom1.children[i].x + 1);
            expect(geom3.children[i].y).toBe(geom1.children[i].y + 1);
        }
    });

    it('multi line - clone', () => {
        const geom1 = Utils.randomMultiLineStringGeometry(3);
        expect(geom1.children.length).toBe(3);

        const geom2 = geom1.clone() as MultiLineString;
        expect(geom2).toEqual(geom1);

        const geom3 = geom1.clone(convert) as MultiLineString;
        expect(geom3.children.length).toBe(geom1.children.length);

        for(let i = 0; i < geom1.children.length; i++) {
            expect(geom3.children[i]._coordinates.length).toBe(geom1.children[i]._coordinates.length);
            for (let j = 0; j < geom1.children[i]._coordinates.length; j++) {
                expect(geom3.children[i]._coordinates[j].x).toBe(geom1.children[i]._coordinates[j].x + 1);
                expect(geom3.children[i]._coordinates[j].y).toBe(geom1.children[i]._coordinates[j].y + 1);
            }
        }
    });

    it('multi polygon - clone', () => {
        const geom1 = Utils.randomMultiPolygonGeometry(3);
        expect(geom1.children.length).toBe(3);

        const geom2 = geom1.clone() as MultiPolygon;
        expect(geom2).toEqual(geom1);

        const geom3 = geom1.clone(convert) as MultiPolygon;
        expect(geom3.children.length).toBe(geom1.children.length);

        for(let i = 0; i < geom1.children.length; i++) {
            const rings1 = [geom1.children[1].externalRing, ...geom1.children[1].internalRings];
            const rings3 = [geom3.children[1].externalRing, ...geom3.children[1].internalRings];
            expect(rings3.length).toBe(rings1.length);
            for (let j = 0; j < rings1.length; j++) {
                expect(rings3[j]._coordinates.length).toBe(rings1[j]._coordinates.length);
                for (let k = 0; k < rings1[j]._coordinates.length; k++) {
                    expect(rings3[j]._coordinates[k].x).toBe(rings1[j]._coordinates[k].x + 1);
                    expect(rings3[j]._coordinates[k].y).toBe(rings1[j]._coordinates[k].y + 1);
                }
            }
        }
    });
});

function convert(c: ICoordinate): ICoordinate {
    return { x: c.x + 1, y: c.y + 1 }
} 