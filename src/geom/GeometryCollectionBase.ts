import _ from "lodash";
import Geometry from "./Geometry";
import ICoordinate from "../base/ICoordinate";

/** @category Geometries */
export default abstract class GeometryCollectionBase<T extends Geometry> extends Geometry {
    _geometries: Array<T>;

    constructor(geometries?: Array<T>) {
        super();

        this._geometries = new Array<T>();

        if(!_.isUndefined(geometries)) {
            geometries.forEach(geom => this._geometries.push(geom));
        }
    }

    get children() {
        return this._geometries;
    }

    coordinates(): any {
        return this.children.map(c => c.coordinates());
    }

    coordinatesFlat(): ICoordinate[] {
        const coordinates = _.flatMap(this._geometries, geom => geom.coordinatesFlat())
        return coordinates;
    }
    
    forEachCoordinates(callback: (coordinate: ICoordinate) => void): void {
        this._geometries.forEach(g => g.forEachCoordinates(callback));
    }

    protected _cloneChildren<T extends Geometry>(convert?: (coordinate: ICoordinate) => ICoordinate) {
        return this.children.map(c => c.clone(convert) as T);
    }
}