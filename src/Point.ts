import _ from "lodash";
import * as jsts from 'jsts';
import Geometry from "./Geometry";
import { GeometryType } from "./GeometryType";
import ICoordinate from "./base/ICoordinate";
import { BufferWriter, BufferReader } from "ginkgoch-buffer-io";
import Constants from "./shared/Constants";
import WkbUtils from "./shared/WkbUtils";

export default class Point extends Geometry {
    x: number = NaN
    y: number = NaN

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

    _ts(): jsts.geom.Geometry {
        const coordinate = new jsts.geom.Coordinate(this.x, this.y);
        return Geometry._factory.createPoint(coordinate);
    }

    static _from(wkb: Buffer): Point;
    static _from(point: jsts.geom.Point): Point; 
    static _from(param: Buffer|jsts.geom.Point): Point{
        if (param instanceof Buffer) {
            return Point._fromWkb(param);
        } else {
            return new Point(param.getX(), param.getY());
        }
    }

    wkb(bigEndian = false): Buffer {
        const size = 1 + Constants.SIZE_POINT;
        const buff = Buffer.alloc(size);
        const writer = new BufferWriter(buff);
        WkbUtils.writeByteEndian(writer, bigEndian);
        WkbUtils.writeDouble(writer, this.x, bigEndian);
        WkbUtils.writeDouble(writer, this.y, bigEndian);
        return buff;
    }

    private static _fromWkb(buff: Buffer) {
        const reader = new BufferReader(buff);
        const bigEndian = WkbUtils.readByteEndian(reader);
        const x = WkbUtils.readDouble(reader, bigEndian);
        const y = WkbUtils.readDouble(reader, bigEndian);
        return new Point(x, y);
    }
}