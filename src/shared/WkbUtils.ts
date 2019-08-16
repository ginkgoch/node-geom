import _ from "lodash";
import assert from "assert";
import { BufferWriter, BufferReader } from "ginkgoch-buffer-io";

import Point from "../geom/Point";
import Constants from "./Constants";
import Polygon from "../geom/Polygon";
import Geometry from "../geom/Geometry";
import LineString from "../geom/LineString";
import LinearRing from "../geom/LinearRing";
import MultiPoint from "../geom/MultiPoint";
import MultiPolygon from "../geom/MultiPolygon";
import ICoordinate from "../base/ICoordinate";
import { GeometryType } from "../geom/GeometryType";
import MultiLineString from "../geom/MultiLineString";
import GeometryCollection from "../geom/GeometryCollection";

export default class WKBUtils {
    static wkbToGeom(buff: Buffer): Geometry {
        const reader = new BufferReader(buff);
        const bigEndian = WKBUtils._readByteEndian(reader);
        const geomType = WKBUtils._readGeomType(reader, bigEndian);
        switch (geomType) {
            case GeometryType.Point:
                return WKBUtils._readPoint(reader, bigEndian);
            case GeometryType.LineString:
                return WKBUtils._readLine(reader, bigEndian);
            case GeometryType.Polygon:
                return WKBUtils._readPolygon(reader, bigEndian);
            case GeometryType.MultiPoint:
                return WKBUtils._readMultiPoint(reader, bigEndian);
            case GeometryType.MultiLineString:
                return WKBUtils._readMultiLine(reader, bigEndian);
            case GeometryType.MultiPolygon:
                return WKBUtils._readMultiPolygon(reader, bigEndian);
            case GeometryType.GeometryCollection:
                return WKBUtils._readGeomCollection(reader, bigEndian);
            default:
                throw new Error('Not supported wkb.');
        }
    }

    static geomToWKB(geom: Geometry, bigEndian = false): Buffer {
        if (geom instanceof Point) {
            return WKBUtils._pointToWKB(geom, bigEndian);
        } else if (geom instanceof LineString) {
            return WKBUtils._lineToWKB(geom, bigEndian);
        } else if (geom instanceof Polygon) {
            return WKBUtils._polygonToWKB(geom, bigEndian);
        } else if (geom instanceof MultiPoint) {
            return WKBUtils._multiPointToWKB(geom, bigEndian);
        } else if (geom instanceof MultiLineString) {
            return WKBUtils._multiLineToWKB(geom, bigEndian);
        } else if (geom instanceof MultiPolygon) {
            return WKBUtils._multiPolygonToWKB(geom, bigEndian);
        } else if (geom instanceof GeometryCollection) {
            return WKBUtils._geomCollectionToWKB(geom, bigEndian);
        } else {
            throw new Error('Unknown geometry.')
        }
    }

    static _geomCollectionToWKB(geom: GeometryCollection, bigEndian: boolean): Buffer {
        const buff = Buffer.alloc(WKBUtils._sizeOfGeomCollection(geom));
        const writer = new BufferWriter(buff);
        WKBUtils._writeGeomCollection(writer, geom, bigEndian);
        return buff;
    }

    static _sizeOfGeomCollection(geom: GeometryCollection) {
        return 1 + Constants.SIZE_GEOM_TYPE +
            Constants.SIZE_INT32 +
            _.sumBy(geom.children, g => WKBUtils._sizeOfGeom(g));
    }

    static _sizeOfGeom(g: Geometry): number {
        if (g instanceof Point) {
            return WKBUtils._sizeOfPoint();
        } else if (g instanceof LineString) {
            return WKBUtils._sizeOfLine(g);
        } else if (g instanceof Polygon) {
            return WKBUtils._sizeOfPolygon(g);
        } else if (g instanceof MultiPoint) {
            return WKBUtils._sizeOfMultiPoint(g);
        } else if (g instanceof MultiLineString) {
            return WKBUtils._sizeOfMultiLine(g);
        } else if (g instanceof MultiPolygon) {
            return WKBUtils._sizeOfMultiPolygon(g);
        } else if (g instanceof GeometryCollection) {
            return WKBUtils._sizeOfGeomCollection(g);
        } else {
            throw new Error('Unsupported geometry.')
        }
    }

    static _writeGeomCollection(writer: BufferWriter, geom: GeometryCollection, bigEndian: boolean) {
        WKBUtils._writeByteEndian(writer, bigEndian);
        WKBUtils._writeGeomType(writer, GeometryType.GeometryCollection, bigEndian);
        WKBUtils._writeInt32(writer, geom.children.length, bigEndian);
        geom.children.forEach(g => WKBUtils._writeGeom(writer, g, bigEndian));
    }

    static _writeGeom(writer: BufferWriter, g: Geometry, bigEndian: boolean) {
        if (g instanceof Point) {
            WKBUtils._writePoint(writer, g, bigEndian);
        } else if (g instanceof LineString) {
            WKBUtils._writeLine(writer, g, bigEndian);
        } else if (g instanceof Polygon) {
            WKBUtils._writePolygon(writer, g, bigEndian);
        } else if (g instanceof MultiPoint) {
            WKBUtils._writeMultiPoint(writer, g, bigEndian);
        } else if (g instanceof MultiLineString) {
            WKBUtils._writeMultiLine(writer, g, bigEndian);
        } else if (g instanceof MultiPolygon) {
            WKBUtils._writeMultiPolygon(writer, g, bigEndian);
        } else if (g instanceof GeometryCollection) {
            WKBUtils._writeGeomCollection(writer, g, bigEndian);
        } else {
            throw new Error('Unsupported geometry.')
        }
    }

    static _readGeomCollection(reader: BufferReader, bigEndian: boolean) {
        const geomCollection = new GeometryCollection();
        const count = WKBUtils._readInt32(reader, bigEndian);
        for (let i = 0; i < count; i++) {
            const geom = WKBUtils._readGeom(reader);
            geomCollection.children.push(geom);
        }

        return geomCollection;
    }

    static _readGeom(reader: BufferReader): Geometry {
        const bigEndian = WKBUtils._readByteEndian(reader);
        const geomType = WKBUtils._readGeomType(reader, bigEndian);
        switch (geomType) {
            case GeometryType.Point:
                return WKBUtils._readPoint(reader, bigEndian);
            case GeometryType.LineString:
                return WKBUtils._readLine(reader, bigEndian);
            case GeometryType.Polygon:
                return WKBUtils._readPolygon(reader, bigEndian);
            case GeometryType.MultiPoint:
                return WKBUtils._readMultiPoint(reader, bigEndian);
            case GeometryType.MultiLineString:
                return WKBUtils._readMultiLine(reader, bigEndian);
            case GeometryType.MultiPolygon:
                return WKBUtils._readMultiPolygon(reader, bigEndian);
            case GeometryType.GeometryCollection:
                return WKBUtils._readGeomCollection(reader, bigEndian);
            default:
                throw new Error('Unsupported geometry type.')
        }
    }

    static _multiPolygonToWKB(geom: MultiPolygon, bigEndian: boolean) {
        const size = WKBUtils._sizeOfMultiPolygon(geom);
        const buff = Buffer.alloc(size);
        const writer = new BufferWriter(buff);
        WKBUtils._writeMultiPolygon(writer, geom, bigEndian);
        return buff;
    }

    static _sizeOfMultiPolygon(geom: MultiPolygon) {
        return 1 + Constants.SIZE_GEOM_TYPE +
            Constants.SIZE_INT32 +
            _.sumBy(geom.children, p => WKBUtils._sizeOfPolygon(p));
    }

    static _writeMultiPolygon(writer: BufferWriter, geom: MultiPolygon, bigEndian: boolean) {
        WKBUtils._writeByteEndian(writer, bigEndian);
        WKBUtils._writeGeomType(writer, GeometryType.MultiPolygon, bigEndian);
        WKBUtils._writeInt32(writer, geom.children.length, bigEndian);
        geom.children.forEach(p => {
            WKBUtils._writePolygon(writer, p, bigEndian);
        });
    }

    static _readMultiPolygon(reader: BufferReader, bigEndian: boolean): Geometry {
        const count = WKBUtils._readInt32(reader, bigEndian);
        const multiPolygon = new MultiPolygon();
        for (let i = 0; i < count; i++) {
            const currentBigEndian = WKBUtils._readByteEndian(reader);
            const currentGeomType = WKBUtils._readGeomType(reader, currentBigEndian);
            assert(currentGeomType === GeometryType.Polygon, 'Non-Polygon in MultiPolygon.')

            const polygon = WKBUtils._readPolygon(reader, bigEndian);
            multiPolygon.children.push(polygon);
        }

        return multiPolygon;
    }

    static _multiLineToWKB(geom: MultiLineString, bigEndian: boolean) {
        const size = WKBUtils._sizeOfMultiLine(geom);

        const buff = Buffer.alloc(size);
        const writer = new BufferWriter(buff);

        WKBUtils._writeMultiLine(writer, geom, bigEndian);

        return buff;
    }

    static _sizeOfMultiLine(geom: MultiLineString) {
        return 1 + Constants.SIZE_GEOM_TYPE +
            Constants.SIZE_INT32 +
            _.sumBy(geom.children, l => WKBUtils._sizeOfLine(l));
    }

    static _writeMultiLine(writer: BufferWriter, geom: MultiLineString, bigEndian: boolean) {
        WKBUtils._writeByteEndian(writer, bigEndian);
        WKBUtils._writeGeomType(writer, GeometryType.MultiLineString, bigEndian);
        WKBUtils._writeInt32(writer, geom.children.length, bigEndian);
        geom.children.forEach(l => {
            WKBUtils._writeByteEndian(writer, bigEndian);
            WKBUtils._writeGeomType(writer, GeometryType.LineString, bigEndian);
            WKBUtils._writeCoordinates(writer, l._coordinates, bigEndian);
        });
    }

    static _readMultiLine(reader: BufferReader, bigEndian: boolean) {
        const multiLine = new MultiLineString();

        const count = WKBUtils._readInt32(reader, bigEndian);
        for (let i = 0; i < count; i++) {
            const currentBigEndian = WKBUtils._readByteEndian(reader);
            const currentGeomType = WKBUtils._readGeomType(reader, currentBigEndian);
            assert(currentGeomType === GeometryType.LineString, 'Non-LineString in MultiLineString.');

            const currentCoordinates = WKBUtils._readCoordinates(reader, currentBigEndian);
            multiLine.children.push(new LineString(currentCoordinates));
        }

        return multiLine;
    }

    static _multiPointToWKB(geom: MultiPoint, bigEndian: boolean): Buffer {
        const size = WKBUtils._sizeOfMultiPoint(geom);
        const buff = Buffer.alloc(size);
        const writer = new BufferWriter(buff);
        WKBUtils._writeMultiPoint(writer, geom, bigEndian);

        return buff;
    }

    static _sizeOfMultiPoint(geom: MultiPoint) {
        return 1 + Constants.SIZE_GEOM_TYPE + WKBUtils._sizeOfPoint() * geom.children.length;
    }

    static _writeMultiPoint(writer: BufferWriter, geom: MultiPoint, bigEndian: boolean) {
        WKBUtils._writeByteEndian(writer, bigEndian);
        WKBUtils._writeGeomType(writer, GeometryType.MultiPoint, bigEndian);
        WKBUtils._writeInt32(writer, geom.children.length, bigEndian);
        geom.children.forEach(p => {
            WKBUtils._writePoint(writer, p, bigEndian);
        });
    }

    static _readMultiPoint(reader: BufferReader, bigEndian: boolean) {
        const count = WKBUtils._readInt32(reader, bigEndian);

        const multiPoint = new MultiPoint();
        for (let i = 0; i < count; i++) {
            const currentBigEndian = WKBUtils._readByteEndian(reader);
            const currentGeomType = WKBUtils._readGeomType(reader, currentBigEndian);
            assert(currentGeomType === GeometryType.Point, 'Non-Point in MultiPoint.')

            const currentCoordinate = WKBUtils._readCoordinate(reader, currentBigEndian);
            multiPoint.children.push(new Point(currentCoordinate.x, currentCoordinate.y));
        }

        return multiPoint;
    }

    static _polygonToWKB(geom: Polygon, bigEndian = false): Buffer {
        const buff = Buffer.alloc(WKBUtils._sizeOfPolygon(geom));
        const writer = new BufferWriter(buff);
        WKBUtils._writePolygon(writer, geom, bigEndian);
        return buff;
    }

    static _sizeOfPolygon(geom: Polygon) {
        const size = 1 + Constants.SIZE_GEOM_TYPE +
            Constants.SIZE_INT32 +                                                              // ring count
            Constants.SIZE_INT32 +                                                              // exterior ring coordinates count
            geom.externalRing._coordinates.length * Constants.SIZE_POINT +                      // exterior ring coordinates
            Constants.SIZE_INT32 * geom.internalRings.length +                                  // all interior ring coordinates count
            _.sumBy(geom.internalRings, r => r._coordinates.length * Constants.SIZE_POINT);     // all interior ring coordinates
        return size;
    }

    static _writePolygon(writer: BufferWriter, geom: Polygon, bigEndian: boolean) {
        WKBUtils._writeByteEndian(writer, bigEndian);
        WKBUtils._writeGeomType(writer, GeometryType.Polygon, bigEndian);
        WKBUtils._writeInt32(writer, geom.internalRings.length + 1, bigEndian);
        WKBUtils._writeCoordinates(writer, geom.externalRing._coordinates, bigEndian);
        geom.internalRings.forEach(r => {
            WKBUtils._writeCoordinates(writer, r._coordinates, bigEndian);
        });
    }

    static _readPolygon(reader: BufferReader, bigEndian: boolean) {
        const ringCount = WKBUtils._readInt32(reader, bigEndian);
        let coordinates = WKBUtils._readCoordinates(reader, bigEndian);
        const polygon = new Polygon(new LinearRing(coordinates));
        for (let i = 1; i < ringCount; i++) {
            coordinates = WKBUtils._readCoordinates(reader, bigEndian);
            polygon.internalRings.push(new LinearRing(coordinates));
        }

        return polygon;
    }

    static _pointToWKB(point: Point, bigEndian = false): Buffer {
        const buff = Buffer.alloc(WKBUtils._sizeOfPoint());
        const writer = new BufferWriter(buff);
        WKBUtils._writePoint(writer, point, bigEndian);
        return buff;
    }

    static _sizeOfPoint() {
        const size = 1 + Constants.SIZE_GEOM_TYPE + Constants.SIZE_POINT;
        return size;
    }

    static _writePoint(writer: BufferWriter, geom: Point, bigEndian: boolean) {
        WKBUtils._writeByteEndian(writer, bigEndian);
        WKBUtils._writeGeomType(writer, GeometryType.Point, bigEndian);
        WKBUtils._writeCoordinate(writer, geom, bigEndian);
    }

    static _readPoint(reader: BufferReader, bigEndian: boolean) {
        const x = WKBUtils._readDouble(reader, bigEndian);
        const y = WKBUtils._readDouble(reader, bigEndian);
        return new Point(x, y);
    }

    static _lineToWKB(line: LineString, bigEndian = false): Buffer {
        const buff = Buffer.alloc(WKBUtils._sizeOfLine(line));
        const writer = new BufferWriter(buff);
        WKBUtils._writeLine(writer, line, bigEndian);

        return buff;
    }

    static _sizeOfLine(geom: LineString) {
        const size = 1 + Constants.SIZE_GEOM_TYPE +
            Constants.SIZE_INT32 +
            Constants.SIZE_POINT * geom._coordinates.length;
        return size;
    }

    static _writeLine(writer: BufferWriter, geom: LineString, bigEndian: boolean) {
        WKBUtils._writeByteEndian(writer, bigEndian);
        WKBUtils._writeGeomType(writer, GeometryType.LineString, bigEndian);
        WKBUtils._writeCoordinates(writer, geom._coordinates, bigEndian);
    }

    static _readLine(reader: BufferReader, bigEndian: boolean) {
        const count = WKBUtils._readInt32(reader, bigEndian);

        const line = new LineString();
        for (let i = 0; i < count; i++) {
            line._coordinates.push(WKBUtils._readCoordinate(reader, bigEndian));
        }

        return line;
    }

    static _writeCoordinates(writer: BufferWriter, coordinates: ICoordinate[], bigEndian: boolean) {
        WKBUtils._writeInt32(writer, coordinates.length, bigEndian);
        coordinates.forEach(c => {
            WKBUtils._writeCoordinate(writer, c, bigEndian);
        });
    }

    static _readCoordinates(reader: BufferReader, bigEndian: boolean) {
        const count = WKBUtils._readInt32(reader, bigEndian);
        const coordinates: ICoordinate[] = [];
        for (let i = 0; i < count; i++) {
            const coordinate = WKBUtils._readCoordinate(reader, bigEndian);
            coordinates.push(coordinate);
        }

        return coordinates;
    }

    static _writeByteEndian(writer: BufferWriter, bigEndian: boolean) {
        const be = bigEndian ? 0 : 1;
        writer.writeInt8(be);
    }

    static _readByteEndian(reader: BufferReader) {
        return reader.nextInt8() === 0;
    }

    static _writeInt32(writer: BufferWriter, n: number, bigEndian: boolean) {
        if (bigEndian) {
            writer.writeInt32BE(n);
        } else {
            writer.writeInt32LE(n);
        }
    }

    static _readInt32(reader: BufferReader, bigEndian: boolean) {
        if (bigEndian) {
            return reader.nextInt32BE();
        } else {
            return reader.nextInt32LE();
        }
    }

    static _writeDouble(writer: BufferWriter, n: number, bigEndian: boolean) {
        if (bigEndian) {
            writer.writeDoubleBE(n);
        } else {
            writer.writeDoubleLE(n);
        }
    }

    static _readDouble(reader: BufferReader, bigEndian: boolean) {
        if (bigEndian) {
            return reader.nextDoubleBE();
        } else {
            return reader.nextDoubleLE();
        }
    }

    static _writeCoordinate(writer: BufferWriter, coordinate: ICoordinate, bigEndian: boolean) {
        if (bigEndian) {
            writer.writeDoubleBE(coordinate.x);
            writer.writeDoubleBE(coordinate.y);
        } else {
            writer.writeDoubleLE(coordinate.x);
            writer.writeDoubleLE(coordinate.y);
        }
    }

    static _readCoordinate(reader: BufferReader, bigEndian: boolean) {
        if (bigEndian) {
            const x = reader.nextDoubleBE();
            const y = reader.nextDoubleBE();
            return { x, y };
        } else {
            const x = reader.nextDoubleLE();
            const y = reader.nextDoubleLE();
            return { x, y };
        }
    }

    static _writeGeomType(writer: BufferWriter, geomType: GeometryType, bigEndian: boolean) {
        const geomNum = this._geomTypeToGeomNum(geomType);
        if (bigEndian) {
            writer.writeInt32BE(geomNum);
        } else {
            writer.writeInt32LE(geomNum);
        }
    }

    static _readGeomType(reader: BufferReader, bigEndian: boolean): GeometryType {
        let geomNum: number;
        if (bigEndian) {
            geomNum = reader.nextInt32BE();
        } else {
            geomNum = reader.nextInt32LE();
        }

        return this._geomNumToGeomType(geomNum);
    }

    private static _geomTypeToGeomNum(geomType: GeometryType): number {
        switch (geomType) {
            case GeometryType.Point:
                return 1;
            case GeometryType.LineString:
                return 2;
            case GeometryType.Polygon:
                return 3;
            case GeometryType.MultiPoint:
                return 4;
            case GeometryType.MultiLineString:
                return 5;
            case GeometryType.MultiPolygon:
                return 6;
            case GeometryType.GeometryCollection:
                return 7;
            case GeometryType.Unknown:
            default:
                return 0;
        }
    }

    private static _geomNumToGeomType(num: number): GeometryType {
        switch (num) {
            case 1:
                return GeometryType.Point;
            case 2:
                return GeometryType.LineString;
            case 3:
                return GeometryType.Polygon;
            case 4:
                return GeometryType.MultiPoint;
            case 5:
                return GeometryType.MultiLineString;
            case 6:
                return GeometryType.MultiPolygon;
            case 7:
                return GeometryType.GeometryCollection;
            case 0:
            default:
                return GeometryType.Unknown;
        }
    }
}