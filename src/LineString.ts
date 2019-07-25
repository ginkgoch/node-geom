import _ from "lodash";
import * as jsts from 'jsts';
import Geometry from "./Geometry";
import ICoordinate from "./base/ICoordinate";
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
}