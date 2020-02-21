import * as jsts from 'jsts';
import Envelope from "./Envelope";
import IGeoJSON from "../base/IGeoJSON";
import { GeometryType } from "./GeometryType"
import ICoordinate from "../base/ICoordinate"

/**
 * @category geom
 */
export default abstract class Geometry {
    static _factory = new jsts.geom.GeometryFactory();

    id: number = 0;

    get type(): GeometryType {
        return GeometryType.Unknown;
    }

    abstract coordinatesFlat(): Array<ICoordinate>;

    abstract coordinates(): any;

    centroid(): ICoordinate {
        return this.envelope().centroid();
    }

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

    area() {
        const tsGeom1 = this._ts();
        return tsGeom1.getArea();
    }

    perimeter() {
        const tsGeom1 = this._ts();
        return tsGeom1.getLength();
    }

    interiorPoint(): ICoordinate {
        const tsGeom1 = this._ts();
        const interiorPoint = tsGeom1.getInteriorPoint();
        return { x: interiorPoint.getX(), y: interiorPoint.getY() };
    }

    toJSON(): IGeoJSON {
        return {
            type: this.type,
            coordinates: this.coordinates()
        }
    }

    abstract _ts(): jsts.geom.Geometry;

    clone(convert?: (coordinate: ICoordinate) => ICoordinate): Geometry {
        const geom = this._clone(convert);
        geom.id = this.id;
        return geom;
    }

    protected abstract _clone(convert?: (coordinate: ICoordinate) => ICoordinate): Geometry;

    toWKT(): string {
        const geomTS = this._ts();
        const writer = new jsts.io.WKTWriter();
        const wkt = writer.write(geomTS);
        return wkt;
    }

    toWKB(bigEndian = false): Buffer {
        const WkbUtils = require("../shared/WkbUtils").default;
        return WkbUtils.geomToWKB(this, bigEndian);
    }

    abstract forEachCoordinates(callback: (coordinate: ICoordinate) => void): void;

    move(offsetX: number, offsetY: number) {
        this.forEachCoordinates(c => {
            c.x += offsetX;
            c.y += offsetY;
        });
    }

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
    contains(geom: Geometry) {
        const tsGeom1 = this._ts();
        const tsGeom2 = geom._ts();
        return tsGeom1.contains(tsGeom2);
    }

    covers(geom: Geometry) {
        const tsGeom1 = this._ts();
        const tsGeom2 = geom._ts();
        return tsGeom1.covers(tsGeom2);
    }

    crosses(geom: Geometry) {
        const tsGeom1 = this._ts();
        const tsGeom2 = geom._ts();
        return tsGeom1.crosses(tsGeom2);
    }

    disjoint(geom: Geometry) {
        const tsGeom1 = this._ts();
        const tsGeom2 = geom._ts();
        return !tsGeom1.intersects(tsGeom2);
    }

    distance(geom: Geometry) {
        const tsGeom1 = this._ts();
        const tsGeom2 = geom._ts();
        return tsGeom1.distance(tsGeom2);
    }

    intersects(geom: Geometry) {
        const tsGeom1 = this._ts();
        const tsGeom2 = geom._ts();
        return tsGeom1.intersects(tsGeom2);
    }

    overlaps(geom: Geometry) {
        const tsGeom1 = this._ts();
        const tsGeom2 = geom._ts();
        return tsGeom1.overlaps(tsGeom2);
    }

    within(geom: Geometry) {
        const tsGeom1 = this._ts();
        const tsGeom2 = geom._ts();
        return tsGeom1.within(tsGeom2);
    }

    touches(geom: Geometry) {
        const tsGeom1 = this._ts();
        const tsGeom2 = geom._ts();
        return tsGeom1.touches(tsGeom2);
    }
    //#endregion
}