declare module jsts {
    module geom {
        export class MultiPoint extends jsts.geom.GeometryCollection { }

        export class MultiLineString extends jsts.geom.GeometryCollection { }

        export class MultiPolygon extends jsts.geom.GeometryCollection { }

        export interface GeometryFactory {
            createLinearRing(coordinates: jsts.geom.Coordinate[]): jsts.geom.LinearRing;
            createPolygon(shell: jsts.geom.LinearRing, holes: jsts.geom.LinearRing[]): jsts.geom.Polygon;
            createMultiPoint(points: jsts.geom.Point[]): jsts.geom.MultiPoint;
            createMultiLineString(lines: jsts.geom.LineString[]): jsts.geom.MultiLineString;
            createMultiPolygon(polygons: jsts.geom.Polygon[]): jsts.geom.MultiPolygon;
            createGeometryCollection(geometries: jsts.geom.Geometry[]): jsts.geom.GeometryCollection;
        }
    }

    module io {
        export interface WKTWriter {
            write(geom: jsts.geom.Geometry): string;
        }
    }
}