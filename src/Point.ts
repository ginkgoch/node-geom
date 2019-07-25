import _ from "lodash";
import * as jsts from 'jsts';
import Geometry from "./Geometry";
import { GeometryType } from "./GeometryType";
import ICoordinate from "./base/ICoordinate";

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
}