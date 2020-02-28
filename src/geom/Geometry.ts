import * as jsts from 'jsts';
import Envelope from "./Envelope";
import IGeoJSON from "../base/IGeoJSON";
import { GeometryType } from "./GeometryType"
import ICoordinate from "../base/ICoordinate"

/** 
 * The base class of all geometries. 
 * @category Geometries
 */
export default abstract class Geometry {
    static _factory = new jsts.geom.GeometryFactory();

    /** The id of geometry. */
    id: number = 0;

    /** Gets the geometry type. */
    get type(): GeometryType {
        return GeometryType.Unknown;
    }

    /** Gets a flatten coordinates array. */
    abstract coordinatesFlat(): Array<ICoordinate>;

    /** Gets the coordinates array. */
    abstract coordinates(): any;

    /** Gets the centroid of this geometry. */
    centroid(): ICoordinate {
        return this.envelope().centroid();
    }

    /** Gets the envelope of this geometry. */
    envelope(): Envelope {
        const coordinates = this.coordinatesFlat()
        let [minx, miny, maxx, maxy] = [
            Number.POSITIVE_INFINITY,
            Number.POSITIVE_INFINITY,
            Number.NEGATIVE_INFINITY,
            Number.NEGATIVE_INFINITY];

        for (let coordinate of coordinates) {
            if (minx > coordinate.x) minx = coordinate.x;
            if (miny > coordinate.y) miny = coordinate.y;
            if (maxx < coordinate.x) maxx = coordinate.x;
            if (maxy < coordinate.y) maxy = coordinate.y;
        }

        return new Envelope(minx, miny, maxx, maxy);
    }

    /** Gets the area of this geometry. */
    area() {
        const tsGeom1 = this._ts();
        return tsGeom1.getArea();
    }

    /** Gets the perimeter of this geometry. */
    perimeter() {
        const tsGeom1 = this._ts();
        return tsGeom1.getLength();
    }

    /** Gets the interior point of this geometry. */
    interiorPoint(): ICoordinate {
        const tsGeom1 = this._ts();
        const interiorPoint = tsGeom1.getInteriorPoint();
        return { x: interiorPoint.getX(), y: interiorPoint.getY() };
    }

    /** Converts this geometry to GeoJSON format. */
    toJSON(): IGeoJSON {
        return {
            type: this.type,
            coordinates: this.coordinates()
        }
    }

    abstract _ts(): jsts.geom.Geometry;

    /** Clones this geometry as a new one. */
    clone(convert?: (coordinate: ICoordinate) => ICoordinate): Geometry {
        const geom = this._clone(convert);
        geom.id = this.id;
        return geom;
    }

    protected abstract _clone(convert?: (coordinate: ICoordinate) => ICoordinate): Geometry;

    /** Converts this geometry to WKT format. */
    toWKT(): string {
        const geomTS = this._ts();
        const writer = new jsts.io.WKTWriter();
        const wkt = writer.write(geomTS);
        return wkt;
    }

    /** Converts this geometry to WKB format. */
    toWKB(bigEndian = false): Buffer {
        const WkbUtils = require("../shared/WkbUtils").default;
        return WkbUtils.geomToWKB(this, bigEndian);
    }

    /** Loops all coordinates in this geometry. */
    abstract forEachCoordinates(callback: (coordinate: ICoordinate) => void): void;

    /** Move coordinates by the specified offset. */
    move(offsetX: number, offsetY: number) {
        this.forEachCoordinates(c => {
            c.x += offsetX;
            c.y += offsetY;
        });
    }

    /** Rotates this geometry by the specified angle and origin point. */
    rotate(angle: number, origin?: ICoordinate) {
        if (origin === undefined) {
            origin = this.centroid();
        }

        this.forEachCoordinates(c => {
            let radius = Math.sqrt(Math.pow(c.x - origin!.x, 2) + Math.pow(c.y - origin!.y, 2));
            if (radius === 0) {
                return;
            }

            let currentAngle = Math.atan2(c.y - origin!.y, c.x - origin!.x);
            let newAngle = currentAngle + angle;
            c.x = origin!.x + Math.round(radius * Math.cos(newAngle) * 1e8) / 1e8;
            c.y = origin!.y - Math.round(radius * Math.sin(newAngle) * 1e8) / 1e8;
        });
    }

    //#region 
    /** Detects whether this geometry contains with the specified geometry. */
    contains(geom: Geometry) {
        const tsGeom1 = this._ts();
        const tsGeom2 = geom._ts();
        return tsGeom1.contains(tsGeom2);
    }

    /** Detects whether this geometry covers with the specified geometry. */
    covers(geom: Geometry) {
        const tsGeom1 = this._ts();
        const tsGeom2 = geom._ts();
        return tsGeom1.covers(tsGeom2);
    }

    /** Detects whether this geometry crosses with the specified geometry. */
    crosses(geom: Geometry) {
        const tsGeom1 = this._ts();
        const tsGeom2 = geom._ts();
        return tsGeom1.crosses(tsGeom2);
    }

    /** Detects whether this geometry is disjoint with the specified geometry. */
    disjoint(geom: Geometry) {
        const tsGeom1 = this._ts();
        const tsGeom2 = geom._ts();
        return !tsGeom1.intersects(tsGeom2);
    }

    /** Calculates distance between this and the specified geometry. */
    distance(geom: Geometry) {
        const tsGeom1 = this._ts();
        const tsGeom2 = geom._ts();
        return tsGeom1.distance(tsGeom2);
    }

    /** Detects whether this geometry intersects with the specified geometry. */
    intersects(geom: Geometry) {
        const tsGeom1 = this._ts();
        const tsGeom2 = geom._ts();
        return tsGeom1.intersects(tsGeom2);
    }

    /** Detects whether this geometry overlaps on the specified geometry. */
    overlaps(geom: Geometry) {
        const tsGeom1 = this._ts();
        const tsGeom2 = geom._ts();
        return tsGeom1.overlaps(tsGeom2);
    }

    /** Detects whether this geometry is within the specified geometry. */
    within(geom: Geometry) {
        const tsGeom1 = this._ts();
        const tsGeom2 = geom._ts();
        return tsGeom1.within(tsGeom2);
    }

    /** Detects whether this geometry touches on the specified geometry. */
    touches(geom: Geometry) {
        const tsGeom1 = this._ts();
        const tsGeom2 = geom._ts();
        return tsGeom1.touches(tsGeom2);
    }
    //#endregion
}