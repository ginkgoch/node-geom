import WkbUtils from "../../src/shared/WkbUtils";
import { GeometryType } from "../../src";

describe('WkbUtils', () => {
    it('geomTypeConversion', () => {
        const utils = WkbUtils as any;

        testGeomConversion(GeometryType.Point, utils);
        testGeomConversion(GeometryType.LineString, utils);
        testGeomConversion(GeometryType.Polygon, utils);
        testGeomConversion(GeometryType.MultiPoint, utils);
        testGeomConversion(GeometryType.MultiPolygon, utils);
        testGeomConversion(GeometryType.MultiLineString, utils);
        testGeomConversion(GeometryType.GeometryCollection, utils);
        testGeomConversion(GeometryType.Unknown, utils);
    });
});

function testGeomConversion(geomType: GeometryType, utils: any) {
    const geomNumb = utils._geomTypeToGeomNum(geomType);
    const expectedType = utils._geomNumToGeomType(geomNumb);
    expect(expectedType).toBe(geomType);
}