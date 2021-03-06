import _ from "lodash";
import * as jsts from 'jsts';
import Geometry from "./Geometry";
import ICoordinate from "../base/ICoordinate";
import { GeometryType } from "./GeometryType";
import Polygon from "./Polygon";
import IGeoJSON from "../base/IGeoJSON";
import Validators from "../shared/Validators";

/** @category Geometries */
export default class LinearRing extends Geometry {
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
    
    toJSON(): IGeoJSON {
        return new Polygon(this).toJSON();
    }

    closed() {
        const first = _.first(this._coordinates);
        const last = _.last(this._coordinates);
        return _.isEqual(first, last);
    }

    _ts(): jsts.geom.Geometry {
        return Geometry._factory.createLinearRing(this._coordinates.map(c => new jsts.geom.Coordinate(c.x, c.y)));
    }

    protected _clone(convert?: (coordinate: ICoordinate) => ICoordinate): Geometry {
        let tmpCoordinate = this._coordinates.map(c => {
            let tmp = _.clone(c);
            if (convert !== undefined) {
                tmp = convert(tmp);
            }

            return tmp;
        });

        return new LinearRing(tmpCoordinate);
    }

    static fromNumbers(...coordinates: number[]): LinearRing {
        Validators.validateCoordinateNumbers(coordinates, 6);
        let ring = new LinearRing(_.chunk(coordinates, 2).map(c => ({x: c[0], y: c[1]})));
        return ring;
    }

    static _from(ring: jsts.geom.LinearRing): LinearRing {
        return new LinearRing(ring.getCoordinates().map(c => ({ x: c.x, y: c.y })));
    }

    counterClockwise(): boolean {
        let topPoint = { x: Number.NEGATIVE_INFINITY, y: Number.NEGATIVE_INFINITY };
        let topPointIndex = 0;
        let pointCount = this._coordinates.length;

        for (let i = 0; i < pointCount; i++) {
            if (this._coordinates[i].y > topPoint.y) {
                topPoint = this._coordinates[i];
                topPointIndex = i;
            }
        }

        let previousPointIndex = topPointIndex - 1;
        if (previousPointIndex < 0) {
            previousPointIndex = pointCount - 2;
        }
        let previousPoint = this._coordinates[previousPointIndex];
        
        let nextPointIndex = topPointIndex + 1;
        if (nextPointIndex >= pointCount) {
            nextPointIndex = 1;
        }
        let nextPoint = this._coordinates[nextPointIndex];

        const previousDistanceX = previousPoint.x - topPoint.x;
        const previousDistanceY = previousPoint.y - topPoint.y;
        const nextDistanceX = nextPoint.x - topPoint.x;
        const nextDistanceY = nextPoint.y - topPoint.y;
        const distance = nextDistanceX * previousDistanceY - nextDistanceY * previousDistanceX;

        if (distance === 0) {
            return previousPoint.x > nextPoint.x;
        } else {
            return distance > 0;
        }
    }

    forEachCoordinates(callback: (coordinate: ICoordinate) => void): void {
        this._coordinates.forEach(callback);
    }
}