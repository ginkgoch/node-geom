import _ from "lodash";
import * as jsts from 'jsts';
import Geometry from "./Geometry";
import ICoordinate from "../base/ICoordinate";
import { GeometryType } from "./GeometryType";

export default class LineString extends Geometry {
    _coordinates: Array<ICoordinate>;

    constructor(coordinates?: Array<ICoordinate>) {
        super();

        this._coordinates = new Array<ICoordinate>();
        if (!_.isUndefined(coordinates)) {
            coordinates.forEach(c => this._coordinates.push(c));
        }
    }

    get type(): GeometryType {
        return GeometryType.LineString;
    }

    coordinatesFlat(): Array<ICoordinate> {
        return this._coordinates;
    }

    coordinates(): number[][] {
        return this._coordinates.map(c => [c.x, c.y]);
    }

    _ts(): jsts.geom.Geometry {
        return Geometry._factory.createLineString(this._coordinates.map(c => new jsts.geom.Coordinate(c.x, c.y)));
    }

    protected _clone(convert?: (coordinate: ICoordinate) => ICoordinate): Geometry {
        const tmpCoordinates = this._coordinates.map(c => {
            let tmp = _.clone(c);
            if (convert !== undefined) {
                tmp = convert(tmp);
            }

            return tmp;
        });

        return new LineString(tmpCoordinates);
    }

    static _from(line: jsts.geom.LineString): LineString {
        return new LineString(line.getCoordinates().map(c => ({ x: c.x, y: c.y })));
    }

    static fromNumbers(...numbers: number[]) {
        let line = new LineString();
        for (let i = 0; i < numbers.length - 1; i += 2) {
            line._coordinates.push({ x: numbers[i], y: numbers[i + 1] });
        }

        return line;
    }

    static fromPoints(...points: ICoordinate[]) {
        let line = new LineString();
        for (let p of points) {
            line._coordinates.push(p);
        }
        return line;
    }
}