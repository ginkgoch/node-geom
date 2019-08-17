import { Geometry, GeometryFactory } from "..";
import { BufferCaps } from "./BufferCaps";

export class SpatialOps {
    static buffer(geom: Geometry, distance: number, quadrantSegments = 8, endCapStyle: BufferCaps = BufferCaps.default) {
        const tsGeom = geom._ts();
        const tsResult = tsGeom.buffer(distance, quadrantSegments, endCapStyle);
        return GeometryFactory.create(tsResult);
    }

    static convexHull(geom: Geometry): Geometry {
        const tsGeom = geom._ts();
        const tsResult = tsGeom.convexHull();
        return GeometryFactory.create(tsResult);
    }

    static diff(geom1: Geometry, geom2: Geometry) {
        const tsGeom1 = geom1._ts();
        const tsGeom2 = geom2._ts();
        const result = tsGeom1.difference(tsGeom2);
        return GeometryFactory.create(result);
    }

    static intersection(geom1: Geometry, geom2: Geometry) {
        const tsGeom1 = geom1._ts();
        const tsGeom2 = geom2._ts();
        const result = tsGeom1.intersection(tsGeom2);
        return GeometryFactory.create(result);
    }

    static union(geom1: Geometry, geom2: Geometry) {
        const tsGeom1 = geom1._ts();
        const tsGeom2 = geom2._ts();
        const result = tsGeom1.union(tsGeom2);
        return GeometryFactory.create(result);
    }

    static normalize(geom: Geometry) {
        const tsGeom = geom._ts();
        const tsGeomNorm = tsGeom.norm();
        return GeometryFactory.create(tsGeomNorm);
    }
}