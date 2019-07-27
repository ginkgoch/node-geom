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

export default class WkbUtils {
    static wkbToGeom(buff: Buffer): Geometry {
        const reader = new BufferReader(buff);
        const bigEndian = WkbUtils._readByteEndian(reader);
        const geomType = WkbUtils._readGeomType(reader, bigEndian);
        switch (geomType) {
            case GeometryType.Point:
                return WkbUtils._readPoint(reader, bigEndian);
            case GeometryType.LineString:
                return WkbUtils._readLine(reader, bigEndian);
            case GeometryType.Polygon:
                return WkbUtils._readPolygon(reader, bigEndian);
            case GeometryType.MultiPoint:
                return WkbUtils._readMultiPoint(reader, bigEndian);
            case GeometryType.MultiLineString:
                return WkbUtils._readMultiLine(reader, bigEndian);
            case GeometryType.MultiPolygon:
                return WkbUtils._readMultiPolygon(reader, bigEndian);
            case GeometryType.GeometryCollection:
                return WkbUtils._readGeomCollection(reader, bigEndian);
            default:
                throw new Error('Not supported wkb.');
        }
    }

    static geomToWkb(geom: Geometry, bigEndian = false): Buffer {
        if (geom instanceof Point) {
            return WkbUtils._pointToWkb(geom, bigEndian);
        } else if (geom instanceof LineString) {
            return WkbUtils._lineToWkb(geom, bigEndian);
        } else if (geom instanceof Polygon) {
            return WkbUtils._polygonToWkb(geom, bigEndian);
        } else if (geom instanceof MultiPoint) {
            return WkbUtils._multiPointToWkb(geom, bigEndian);
        } else if (geom instanceof MultiLineString) {
            return WkbUtils._multiLineToWkb(geom, bigEndian);
        } else if (geom instanceof MultiPolygon) {
            return WkbUtils._multiPolygonToWkb(geom, bigEndian);
        } else if (geom instanceof GeometryCollection) {
            return WkbUtils._geomCollectionToWkb(geom, bigEndian);
        } else {
            throw new Error('Unknown geometry.')
        }
    }

    static _geomCollectionToWkb(geom: GeometryCollection, bigEndian: boolean): Buffer {
        const buff = Buffer.alloc(WkbUtils._sizeOfGeomCollection(geom));
        const writer = new BufferWriter(buff);
        WkbUtils._writeGeomCollection(writer, geom, bigEndian);
        return buff;
    }

    static _sizeOfGeomCollection(geom: GeometryCollection) {
        return 1 + Constants.SIZE_GEOM_TYPE +
            Constants.SIZE_INT32 +
            _.sumBy(geom.children, g => WkbUtils._sizeOfGeom(g));
    }

    static _sizeOfGeom(g: Geometry): number {
        if (g instanceof Point) {
            return WkbUtils._sizeOfPoint();
        } else if (g instanceof LineString) {
            return WkbUtils._sizeOfLine(g);
        } else if (g instanceof Polygon) {
            return WkbUtils._sizeOfPolygon(g);
        } else if (g instanceof MultiPoint) {
            return WkbUtils._sizeOfMultiPoint(g);
        } else if (g instanceof MultiLineString) {
            return WkbUtils._sizeOfMultiLine(g);
        } else if (g instanceof MultiPolygon) {
            return WkbUtils._sizeOfMultiPolygon(g);
        } else if (g instanceof GeometryCollection) {
            return WkbUtils._sizeOfGeomCollection(g);
        } else {
            throw new Error('Unsupported geometry.')
        }
    }

    static _writeGeomCollection(writer: BufferWriter, geom: GeometryCollection, bigEndian: boolean) {
        WkbUtils._writeByteEndian(writer, bigEndian);
        WkbUtils._writeGeomType(writer, GeometryType.GeometryCollection, bigEndian);
        WkbUtils._writeInt32(writer, geom.children.length, bigEndian);
        geom.children.forEach(g => WkbUtils._writeGeom(writer, g, bigEndian));
    }

    static _writeGeom(writer: BufferWriter, g: Geometry, bigEndian: boolean) {
        if (g instanceof Point) {
            WkbUtils._writePoint(writer, g, bigEndian);
        } else if (g instanceof LineString) {
            WkbUtils._writeLine(writer, g, bigEndian);
        } else if (g instanceof Polygon) {
            WkbUtils._writePolygon(writer, g, bigEndian);
        } else if (g instanceof MultiPoint) {
            WkbUtils._writeMultiPoint(writer, g, bigEndian);
        } else if (g instanceof MultiLineString) {
            WkbUtils._writeMultiLine(writer, g, bigEndian);
        } else if (g instanceof MultiPolygon) {
            WkbUtils._writeMultiPolygon(writer, g, bigEndian);
        } else if (g instanceof GeometryCollection) {
            WkbUtils._writeGeomCollection(writer, g, bigEndian);
        } else {
            throw new Error('Unsupported geometry.')
        }
    }

    static _readGeomCollection(reader: BufferReader, bigEndian: boolean) {
        const geomCollection = new GeometryCollection();
        const count = WkbUtils._readInt32(reader, bigEndian);
        for (let i = 0; i < count; i++) {
            const geom = WkbUtils._readGeom(reader);
            geomCollection.children.push(geom);
        }

        return geomCollection;
    }

    static _readGeom(reader: BufferReader): Geometry {
        const bigEndian = WkbUtils._readByteEndian(reader);
        const geomType = WkbUtils._readGeomType(reader, bigEndian);
        switch (geomType) {
            case GeometryType.Point:
                return WkbUtils._readPoint(reader, bigEndian);
            case GeometryType.LineString:
                return WkbUtils._readLine(reader, bigEndian);
            case GeometryType.Polygon:
                return WkbUtils._readPolygon(reader, bigEndian);
            case GeometryType.MultiPoint:
                return WkbUtils._readMultiPoint(reader, bigEndian);
            case GeometryType.MultiLineString:
                return WkbUtils._readMultiLine(reader, bigEndian);
            case GeometryType.MultiPolygon:
                return WkbUtils._readMultiPolygon(reader, bigEndian);
            case GeometryType.GeometryCollection:
                return WkbUtils._readGeomCollection(reader, bigEndian);
            default:
                throw new Error('Unsupported geometry type.')
        }
    }

    static _multiPolygonToWkb(geom: MultiPolygon, bigEndian: boolean) {
        const size = WkbUtils._sizeOfMultiPolygon(geom);
        const buff = Buffer.alloc(size);
        const writer = new BufferWriter(buff);
        WkbUtils._writeMultiPolygon(writer, geom, bigEndian);
        return buff;
    }

    static _sizeOfMultiPolygon(geom: MultiPolygon) {
        return 1 + Constants.SIZE_GEOM_TYPE +
            Constants.SIZE_INT32 +
            _.sumBy(geom.children, p => WkbUtils._sizeOfPolygon(p));
    }

    static _writeMultiPolygon(writer: BufferWriter, geom: MultiPolygon, bigEndian: boolean) {
        WkbUtils._writeByteEndian(writer, bigEndian);
        WkbUtils._writeGeomType(writer, GeometryType.MultiPolygon, bigEndian);
        WkbUtils._writeInt32(writer, geom.children.length, bigEndian);
        geom.children.forEach(p => {
            WkbUtils._writePolygon(writer, p, bigEndian);
        });
    }

    static _readMultiPolygon(reader: BufferReader, bigEndian: boolean): Geometry {
        const count = WkbUtils._readInt32(reader, bigEndian);
        const multiPolygon = new MultiPolygon();
        for (let i = 0; i < count; i++) {
            const currentBigEndian = WkbUtils._readByteEndian(reader);
            const currentGeomType = WkbUtils._readGeomType(reader, currentBigEndian);
            assert(currentGeomType === GeometryType.Polygon, 'Non-Polygon in MultiPolygon.')

            const polygon = WkbUtils._readPolygon(reader, bigEndian);
            multiPolygon.children.push(polygon);
        }

        return multiPolygon;
    }

    static _multiLineToWkb(geom: MultiLineString, bigEndian: boolean) {
        const size = WkbUtils._sizeOfMultiLine(geom);

        const buff = Buffer.alloc(size);
        const writer = new BufferWriter(buff);

        WkbUtils._writeMultiLine(writer, geom, bigEndian);

        return buff;
    }

    static _sizeOfMultiLine(geom: MultiLineString) {
        return 1 + Constants.SIZE_GEOM_TYPE +
            Constants.SIZE_INT32 +
            _.sumBy(geom.children, l => WkbUtils._sizeOfLine(l));
    }

    static _writeMultiLine(writer: BufferWriter, geom: MultiLineString, bigEndian: boolean) {
        WkbUtils._writeByteEndian(writer, bigEndian);
        WkbUtils._writeGeomType(writer, GeometryType.MultiLineString, bigEndian);
        WkbUtils._writeInt32(writer, geom.children.length, bigEndian);
        geom.children.forEach(l => {
            WkbUtils._writeByteEndian(writer, bigEndian);
            WkbUtils._writeGeomType(writer, GeometryType.LineString, bigEndian);
            WkbUtils._writeCoordinates(writer, l._coordinates, bigEndian);
        });
    }

    static _readMultiLine(reader: BufferReader, bigEndian: boolean) {
        const multiLine = new MultiLineString();

        const count = WkbUtils._readInt32(reader, bigEndian);
        for (let i = 0; i < count; i++) {
            const currentBigEndian = WkbUtils._readByteEndian(reader);
            const currentGeomType = WkbUtils._readGeomType(reader, currentBigEndian);
            assert(currentGeomType === GeometryType.LineString, 'Non-LineString in MultiLineString.');

            const currentCoordinates = WkbUtils._readCoordinates(reader, currentBigEndian);
            multiLine.children.push(new LineString(currentCoordinates));
        }

        return multiLine;
    }

    static _multiPointToWkb(geom: MultiPoint, bigEndian: boolean): Buffer {
        const size = WkbUtils._sizeOfMultiPoint(geom);
        const buff = Buffer.alloc(size);
        const writer = new BufferWriter(buff);
        WkbUtils._writeMultiPoint(writer, geom, bigEndian);

        return buff;
    }

    static _sizeOfMultiPoint(geom: MultiPoint) {
        return 1 + Constants.SIZE_GEOM_TYPE + WkbUtils._sizeOfPoint() * geom.children.length;
    }

    static _writeMultiPoint(writer: BufferWriter, geom: MultiPoint, bigEndian: boolean) {
        WkbUtils._writeByteEndian(writer, bigEndian);
        WkbUtils._writeGeomType(writer, GeometryType.MultiPoint, bigEndian);
        WkbUtils._writeInt32(writer, geom.children.length, bigEndian);
        geom.children.forEach(p => {
            WkbUtils._writePoint(writer, p, bigEndian);
        });
    }

    static _readMultiPoint(reader: BufferReader, bigEndian: boolean) {
        const count = WkbUtils._readInt32(reader, bigEndian);

        const multiPoint = new MultiPoint();
        for (let i = 0; i < count; i++) {
            const currentBigEndian = WkbUtils._readByteEndian(reader);
            const currentGeomType = WkbUtils._readGeomType(reader, currentBigEndian);
            assert(currentGeomType === GeometryType.Point, 'Non-Point in MultiPoint.')

            const currentCoordinate = WkbUtils._readCoordinate(reader, currentBigEndian);
            multiPoint.children.push(new Point(currentCoordinate.x, currentCoordinate.y));
        }

        return multiPoint;
    }

    static _polygonToWkb(geom: Polygon, bigEndian = false): Buffer {
        const buff = Buffer.alloc(WkbUtils._sizeOfPolygon(geom));
        const writer = new BufferWriter(buff);
        WkbUtils._writePolygon(writer, geom, bigEndian);
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
        WkbUtils._writeByteEndian(writer, bigEndian);
        WkbUtils._writeGeomType(writer, GeometryType.Polygon, bigEndian);
        WkbUtils._writeInt32(writer, geom.internalRings.length + 1, bigEndian);
        WkbUtils._writeCoordinates(writer, geom.externalRing._coordinates, bigEndian);
        geom.internalRings.forEach(r => {
            WkbUtils._writeCoordinates(writer, r._coordinates, bigEndian);
        });
    }

    static _readPolygon(reader: BufferReader, bigEndian: boolean) {
        const ringCount = WkbUtils._readInt32(reader, bigEndian);
        let coordinates = WkbUtils._readCoordinates(reader, bigEndian);
        const polygon = new Polygon(new LinearRing(coordinates));
        for (let i = 1; i < ringCount; i++) {
            coordinates = WkbUtils._readCoordinates(reader, bigEndian);
            polygon.internalRings.push(new LinearRing(coordinates));
        }

        return polygon;
    }

    static _pointToWkb(point: Point, bigEndian = false): Buffer {
        const buff = Buffer.alloc(WkbUtils._sizeOfPoint());
        const writer = new BufferWriter(buff);
        WkbUtils._writePoint(writer, point, bigEndian);
        return buff;
    }

    static _sizeOfPoint() {
        const size = 1 + Constants.SIZE_GEOM_TYPE + Constants.SIZE_POINT;
        return size;
    }

    static _writePoint(writer: BufferWriter, geom: Point, bigEndian: boolean) {
        WkbUtils._writeByteEndian(writer, bigEndian);
        WkbUtils._writeGeomType(writer, GeometryType.Point, bigEndian);
        WkbUtils._writeCoordinate(writer, geom, bigEndian);
    }

    static _readPoint(reader: BufferReader, bigEndian: boolean) {
        const x = WkbUtils._readDouble(reader, bigEndian);
        const y = WkbUtils._readDouble(reader, bigEndian);
        return new Point(x, y);
    }

    static _lineToWkb(line: LineString, bigEndian = false): Buffer {
        const buff = Buffer.alloc(WkbUtils._sizeOfLine(line));
        const writer = new BufferWriter(buff);
        WkbUtils._writeLine(writer, line, bigEndian);

        return buff;
    }

    static _sizeOfLine(geom: LineString) {
        const size = 1 + Constants.SIZE_GEOM_TYPE +
            Constants.SIZE_INT32 +
            Constants.SIZE_POINT * geom._coordinates.length;
        return size;
    }

    static _writeLine(writer: BufferWriter, geom: LineString, bigEndian: boolean) {
        WkbUtils._writeByteEndian(writer, bigEndian);
        WkbUtils._writeGeomType(writer, GeometryType.LineString, bigEndian);
        WkbUtils._writeCoordinates(writer, geom._coordinates, bigEndian);
    }

    static _readLine(reader: BufferReader, bigEndian: boolean) {
        const count = WkbUtils._readInt32(reader, bigEndian);

        const line = new LineString();
        for (let i = 0; i < count; i++) {
            line._coordinates.push(WkbUtils._readCoordinate(reader, bigEndian));
        }

        return line;
    }

    static _writeCoordinates(writer: BufferWriter, coordinates: ICoordinate[], bigEndian: boolean) {
        WkbUtils._writeInt32(writer, coordinates.length, bigEndian);
        coordinates.forEach(c => {
            WkbUtils._writeCoordinate(writer, c, bigEndian);
        });
    }

    static _readCoordinates(reader: BufferReader, bigEndian: boolean) {
        const count = WkbUtils._readInt32(reader, bigEndian);
        const coordinates: ICoordinate[] = [];
        for (let i = 0; i < count; i++) {
            const coordinate = WkbUtils._readCoordinate(reader, bigEndian);
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
        if (bigEndian) {
            writer.writeInt32BE(geomType);
        } else {
            writer.writeInt32LE(geomType);
        }
    }

    static _readGeomType(reader: BufferReader, bigEndian: boolean): GeometryType {
        if (bigEndian) {
            return reader.nextInt32BE();
        } else {
            return reader.nextInt32LE();
        }
    }
}