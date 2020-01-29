import _ from "lodash";
import * as jsts from 'jsts';
import Geometry from "./Geometry";
import { GeometryType } from "./GeometryType";
import ICoordinate from "../base/ICoordinate";
import { MultiLineString, Envelope, LineString } from "..";

const radianFactor = Math.PI / 180.0;
const degreeFactor = 180.0 / Math.PI;

export default class Point extends Geometry {
    x: number = 0
    y: number = 0

    constructor(x?: number, y?: number) {
        super();

        !_.isUndefined(x) && (this.x = x);
        !_.isUndefined(y) && (this.y = y);
    }

    get type(): GeometryType {
        return GeometryType.Point;
    }

    coordinatesFlat(): ICoordinate[] {
        return [{ x: this.x, y: this.y }];
    }

    coordinates(): number[] {
        return [this.x, this.y];
    }

    geocentricLine(point: ICoordinate, segmentCount: number = 300): MultiLineString | undefined {
        const ddEnvelope = new Envelope(-180, -90, 180, 90);
        const targetPoint = new Point(point.x, point.y);

        if (Envelope.disjoined(ddEnvelope, targetPoint.envelope()) || Envelope.disjoined(ddEnvelope, this.envelope())) {
            return undefined;
        }

        let [lng1, lat1, lng2, lat2] = [this.x, this.y, targetPoint.x, targetPoint.y].map(n => n * radianFactor);
        let [x1, x2] = [[lng1, lat1], [lng2, lat2]].map(c => Math.cos(c[0]) * Math.cos(c[1]));
        let [y1, y2] = [[lng1, lat1], [lng2, lat2]].map(c => Math.sin(c[0]) * Math.cos(c[1]));
        let [z1, z2] = [lat1, lat2].map(lat => Math.sin(lat));
        let alpha = Math.acos((x1 * x2) + (y1 * y2) + (z1 * z2));

        if (alpha === 0) {
            return new MultiLineString([LineString.fromPoints(this, point)]);
        }

        let [x3, y3, z3] = [[x1, x2], [y1, y2], [z1, z2]]
            .map(n => (n[1] - (n[0] * Math.cos(alpha))) / Math.sin(alpha));
        let result = new MultiLineString();
        let line1 = new LineString();
        let line2 = new LineString();
        line1._coordinates.push({ x: this.x, y: this.y });
        let disconnected = false;
        let [newX, newY] = [0, 0];
        for (let i = 1; i <= segmentCount; i++) {
            let currentAlpha = i * alpha / (segmentCount + 1);
            let [xbm, ybm, zbm] = [[x1, x3], [y1, y3], [z1, z3]]
                .map(n => n[0] * Math.cos(currentAlpha) + n[1] * Math.sin(currentAlpha));

            newX = Math.atan(ybm / xbm) * degreeFactor;
            if (xbm < 0 && ybm < 0) {
                newX -= 180;
            } else if (ybm > 0 && xbm < 0) {
                newX += 180;
            }

            newY = Math.asin(zbm) * degreeFactor;
            if (i > 2 && !disconnected) {
                let lastDistance = Point._distance(line1._coordinates[i - 3], line1._coordinates[i - 2]);
                let currDistance = Point._distance({ x: newX, y: newY }, line1._coordinates[i - 2]);
                if (currDistance > lastDistance * 6) {
                    disconnected = true;
                }
            }

            if (!disconnected) {
                line1._coordinates.push({ x: newX, y: newY });
            } else {
                line2._coordinates.push({ x: newX, y: newY });
            }
        }

        if (!disconnected) {
            line1._coordinates.push({ x: point.x, y: point.y });
            result.children.push(line1);
        } else {
            line2._coordinates.push({ x: point.x, y: point.y });
            result.children.push(line1);
            result.children.push(line2);
        }

        return result;
    }

    _ts(): jsts.geom.Geometry {
        const coordinate = new jsts.geom.Coordinate(this.x, this.y);
        return Geometry._factory.createPoint(coordinate);
    }

    protected _clone(convert?: (coordinate: ICoordinate) => ICoordinate): Geometry {
        let tmp = { x: this.x, y: this.y };
        if (convert !== undefined) {
            tmp = convert(tmp);
        }

        return new Point(tmp.x, tmp.y);
    }

    static _from(point: jsts.geom.Point): Point {
        return new Point(point.getX(), point.getY());
    }

    private static _distance(p1: ICoordinate, p2: ICoordinate) {
        let distance = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
        return distance;
    }
}