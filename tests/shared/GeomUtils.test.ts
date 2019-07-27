import GeomUtils from '../../src/shared/GeomUtils'
import { GeometryType } from '../../src/geom/GeometryType';

describe('GeomUtils', () => {
    it('geomTypeName', () => {
        expect(GeomUtils.geomTypeName(GeometryType.Unknown)).toEqual('Unknown')
        expect(GeomUtils.geomTypeName(GeometryType.Point)).toEqual('Point')
        expect(GeomUtils.geomTypeName(GeometryType.LineString)).toEqual('LineString')
        expect(GeomUtils.geomTypeName(GeometryType.Polygon)).toEqual('Polygon')
        expect(GeomUtils.geomTypeName(GeometryType.MultiPoint)).toEqual('MultiPoint')
        expect(GeomUtils.geomTypeName(GeometryType.MultiLineString)).toEqual('MultiLineString')
        expect(GeomUtils.geomTypeName(GeometryType.GeometryCollection)).toEqual('GeometryCollection')
    })
})