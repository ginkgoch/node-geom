import { GeometryType } from "./GeometryType"
import ICoordinate from "./base/ICoordinate"
import Envelope from "./Envelope";
import GeomUtils from "./shared/GeomUtils";
import * as jsts from 'jsts';
import Point from "./Point";
import LineString from "./LineString";
import Ring from "./Ring";
import Polygon from "./Polygon";
import MultiLineString from "./MultiLineString";
import MultiPoint from "./MultiPoint";
import GeometryCollection from "./GeometryCollection";

export default abstract class Geometry {
    static _factory = new jsts.geom.GeometryFactory();

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

    json(): { type: string, coordinates: any } {
        return {
            type: GeomUtils.geomTypeName(this.type),
            coordinates: this.coordinates()
        }
    }

    abstract _ts(): jsts.geom.Geometry;

    wkt(): string {
        const geomTS = this._ts();
        const writer = new jsts.io.WKTWriter();
        const wkt = writer.write(geomTS);
        return wkt;
    }
}