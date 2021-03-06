import _ from "lodash";
import * as jsts from 'jsts';
import LinearRing from "./LinearRing";
import Geometry from "./Geometry";
import ICoordinate from "../base/ICoordinate";
import { GeometryType } from "./GeometryType";
import Validators from "../shared/Validators";

/** @category Geometries */
export default class Polygon extends Geometry {
    externalRing: LinearRing;
    internalRings: Array<LinearRing>;
    
    constructor(externalRing?: LinearRing, ...internalRings: LinearRing[]) {
        super();
        
        this.externalRing = new LinearRing(externalRing && externalRing.coordinatesFlat());
        this.internalRings = new Array<LinearRing>();
        internalRings.forEach(r => this.internalRings.push(r));
    }
    
    get type(): GeometryType {
        return GeometryType.Polygon;
    }
    
    coordinatesFlat(): ICoordinate[] {
        return _.flatMap([this.externalRing, ...this.internalRings], r => r.coordinatesFlat());
    }

    coordinates(): number[][][] {
        return [this.externalRing, ...this.internalRings].map(r => r.coordinates());
    }

    _ts(): jsts.geom.Geometry {
        return Geometry._factory.createPolygon(
            this.externalRing._ts() as jsts.geom.LinearRing, 
            this.internalRings.map(r => r._ts() as jsts.geom.LinearRing)
        );
    }

    protected _clone(convert?: (coordinate: ICoordinate) => ICoordinate): Geometry {
        let rings = [ this.externalRing, ...this.internalRings ];
        rings = rings.map(r => r.clone(convert) as LinearRing);
        let tmpRing = rings.shift();
        return new Polygon(tmpRing, ...rings);
    }

    forEachCoordinates(callback: (coordinate: ICoordinate) => void): void {
        [this.externalRing].concat(this.internalRings).forEach(r => r.forEachCoordinates(callback));
    }

    static fromNumbers(...coordinates: number[][]): Polygon {
        Validators.validateCoordinateNumbers(coordinates, 1);

        let rings = coordinates.map(cs => LinearRing.fromNumbers(...cs));
        let polygon = new Polygon(rings[0]);
        for (let i = 1; i < rings.length; i++) {
            polygon.internalRings.push(rings[i]);
        }

        return polygon;
    }

    static _from(polygon: jsts.geom.Polygon): Polygon {
        const geom = new Polygon(
            LinearRing._from(polygon.getExteriorRing())
        );

        const innerRingCount = polygon.getNumInteriorRing();
        for (let i = 0; i < innerRingCount; i++) {
            geom.internalRings.push(LinearRing._from(<jsts.geom.LinearRing>polygon.getInteriorRingN(i)));
        }

        return geom;
    }
}