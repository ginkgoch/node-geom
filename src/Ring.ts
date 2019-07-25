import _ from "lodash";
import * as jsts from 'jsts';
import Geometry from "./Geometry";
import ICoordinate from "./base/ICoordinate";
import { GeometryType } from "./GeometryType";

export default class Ring extends Geometry {
    _coordinates: ICoordinate[];

    constructor(coordinates?: ICoordinate[]) {
        super();

        this._coordinates = new Array<ICoordinate>();
        if (!_.isUndefined(coordinates)) {
            coordinates.forEach(c => this._coordinates.push(c));
        }

        if (!this.closed()) {
            const first = _.chain(coordinates).first().clone().value();
            this._coordinates.push(first);
        }
    }
    
    get type(): GeometryType {
        return GeometryType.Polygon;
    }

    coordinatesFlat(): ICoordinate[] {
        return this._coordinates;
    }

    coordinates(): number[][] {
        return this._coordinates.map(c => [c.x, c.y]);
    }

    closed() {
        const first = _.first(this._coordinates);
        const last = _.last(this._coordinates);
        return _.isEqual(first, last);
    }

    _ts(): jsts.geom.Geometry {
        return Geometry._factory.createLinearRing(this._coordinates.map(c => new jsts.geom.Coordinate(c.x, c.y)));
    }
}