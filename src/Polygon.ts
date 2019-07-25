import _ from "lodash";
import * as jsts from 'jsts';
import Ring from "./Ring";
import Geometry from "./Geometry";
import ICoordinate from "./base/ICoordinate";
import { GeometryType } from "./GeometryType";

export default class Polygon extends Geometry {
    externalRing: Ring;
    internalRings: Array<Ring>;
    
    constructor(externalRing?: Ring, ...internalRings: Ring[]) {
        super();
        
        this.externalRing = new Ring(externalRing && externalRing.coordinatesFlat());
        this.internalRings = new Array<Ring>();
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
}