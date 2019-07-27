import _ from "lodash";
import ICoordinate from "../src/base/ICoordinate";
import Geometry from "../src/Geometry";
import GeometryFactory from "../src/GeometryFactory";

export default class Utils {
    static randomPoint() {
        const [x, y] = [Utils._randomHorizontal(), Utils._randomVertical()];
        return { x, y };
    }

    static randomLineString(count: number) {
        const line = new Array<ICoordinate>();
        _.range(count).forEach(i => line.push(
            Utils.randomPoint()
        ));

        return line;
    }

    static randomRing(count: number) {
        const ring = new Array<ICoordinate>();
        _.range(count - 1).forEach(i => ring.push(
            Utils.randomPoint()
        ));

        ring.push(_.chain(ring).first().clone().value());
        return ring;
    }

    static _randomHorizontal() {
        return _.random(-180, 180, true);
    }

    static _randomVertical() {
        return _.random(-90, 90, true);
    }

    static validateJsonResult<T extends Geometry>(json: any, expectedTypeName: string) {
        expect(json).toHaveProperty('type');
        expect(json).toHaveProperty('coordinates');
        expect(json.type).toEqual(expectedTypeName);
    }

    static validateWkbAndWktAreEqual(wkt: string, wkb: string) {
        const geom1 = GeometryFactory.create(wkt);
        const geom2 = GeometryFactory.create(Buffer.from(wkb, 'hex'));
        expect(geom2).toEqual(geom1);
    }
}