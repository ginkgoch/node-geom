import _ from "lodash";
import IEnvelope from "../base/IEnvelope";
import ICoordinate from "../base/ICoordinate";

/** @category shared */
export default class Envelope implements IEnvelope {
    minx: number;
    miny: number;
    maxx: number;
    maxy: number;

    constructor(minx: number, miny: number, maxx: number, maxy: number) {
        this.minx = minx;
        this.miny = miny;
        this.maxx = maxx;
        this.maxy = maxy;
    }

    get width(): number {
        return Math.abs(this.maxx - this.minx);
    }

    get height(): number {
        return Math.abs(this.maxy - this.miny);
    }

    centroid(): ICoordinate {
        return { x: (this.minx + this.maxx) * .5, y: (this.miny + this.maxy) * .5 };
    }

    expand(envelope: IEnvelope) {
        this.minx = Math.min(this.minx, envelope.minx);
        this.miny = Math.min(this.miny, envelope.miny);
        this.maxx = Math.max(this.maxx, envelope.maxx);
        this.maxy = Math.max(this.maxy, envelope.maxy);
    }

    area() {
        const width = Math.abs(this.maxx - this.minx);
        const height = Math.abs(this.maxy - this.miny);
        return width * height;
    }

    perimeter() {
        const width = Math.abs(this.maxx - this.minx);
        const height = Math.abs(this.maxy - this.miny);
        return width * 2 + height * 2;
    }

    static from(coordinates: any): Envelope
    static from(coordinates: ICoordinate[]): Envelope
    static from(param: ICoordinate[] | any): Envelope {
        const flatten = _.flattenDeep(param);
        if (flatten.length === 0) {
            throw new Error('Invalid coordinates. Must be an array of ICoordinates or numbers.');
        }

        let coordinates: ICoordinate[];
        if (typeof _.first(flatten) === 'number') {
            const flattenNumbers = flatten as number[];
            coordinates = new Array<ICoordinate>();
            for (let i = 0; i < flattenNumbers.length; i += 2) {
                coordinates.push({ x: flattenNumbers[i], y: flattenNumbers[i + 1] });
            }
        } else {
            coordinates = param as Array<ICoordinate>;
        }

        let [minx, miny, maxx, maxy] = [
            Number.POSITIVE_INFINITY,
            Number.POSITIVE_INFINITY,
            Number.NEGATIVE_INFINITY,
            Number.NEGATIVE_INFINITY];

        for (let c of coordinates) {
            minx = Math.min(minx, c.x);
            miny = Math.min(miny, c.y);
            maxx = Math.max(maxx, c.x);
            maxy = Math.max(maxy, c.y);
        }

        return new Envelope(minx, miny, maxx, maxy);
    }

    static union(env1: IEnvelope, env2: IEnvelope): Envelope {
        let minx = Math.min(env1.minx, env2.minx);
        let miny = Math.min(env1.miny, env2.miny);
        let maxx = Math.max(env1.maxx, env2.maxx);
        let maxy = Math.max(env1.maxy, env2.maxy);
        return new Envelope(minx, miny, maxx, maxy);
    }

    static intersection(env1: IEnvelope | undefined, env2: IEnvelope | undefined): Envelope | undefined {
        if (Envelope.disjoined(env1, env2)) {
            return undefined;
        }

        let minx = Math.max(env1!.minx, env2!.minx);
        let maxx = Math.min(env1!.maxx, env2!.maxx);
        let miny = Math.max(env1!.miny, env2!.miny);
        let maxy = Math.min(env1!.maxy, env2!.maxy);
        return new Envelope(minx, miny, maxx, maxy);
    }

    static unionAll(envelopes: IEnvelope[]): Envelope {
        let envelope = Envelope.init();
        envelopes.forEach(e => envelope.expand(e));

        return envelope;
    }

    static disjoined(envelope1: IEnvelope | undefined, envelope2: IEnvelope | undefined): boolean {
        if (envelope1 === undefined || envelope2 === undefined) return true;

        return envelope1.maxx < envelope2.minx || envelope1.minx > envelope2.maxx
            || envelope1.miny > envelope2.maxy || envelope1.maxy < envelope2.miny;
    }

    static contains(envelope1: IEnvelope | undefined, envelope2: IEnvelope | undefined): boolean {
        if (envelope1 === undefined || envelope2 === undefined) {
            return false;
        }

        return envelope1.minx <= envelope2.minx && envelope1.maxx >= envelope2.maxx &&
            envelope1.miny <= envelope2.miny && envelope1.maxy >= envelope2.maxy;
    }

    static intersects(envelope1: IEnvelope | undefined, envelope2: IEnvelope | undefined): boolean {
        if (envelope1 === undefined || envelope2 === undefined) {
            return false;
        }

        let p1 = { x: envelope1.minx, y: envelope1.miny };
        let p2 = { x: envelope1.maxx, y: envelope1.maxy };
        let q1 = { x: envelope2.minx, y: envelope2.miny };
        let q2 = { x: envelope2.maxx, y: envelope2.maxy };

        let min1 = Math.min(q1.x, q2.x);
        let max1 = Math.max(q1.x, q2.x);
        let min2 = Math.min(p1.x, p2.x);
        let max2 = Math.max(p1.x, p2.x);
        if (min2 > max1) {
            return false;
        }
        if (max2 < min1) {
            return false;
        }
        min1 = Math.min(q1.y, q2.y);
        max1 = Math.max(q1.y, q2.y);
        min2 = Math.min(p1.y, p2.y);
        max2 = Math.max(p1.y, p2.y);
        if (min2 > max1) {
            return false;
        }
        if (max2 < min1) {
            return false;
        }
        return true;
    }

    static equals(envelope1: IEnvelope | undefined, envelope2: IEnvelope | undefined, tolerance: number = 0) {
        if (envelope1 === undefined && envelope2 === undefined) {
            return true;
        }

        if (envelope1 === undefined || envelope2 === undefined) {
            return false;
        }

        return Math.abs(envelope1.minx - envelope2.minx) <= tolerance &&
            Math.abs(envelope1.miny - envelope2.miny) <= tolerance &&
            Math.abs(envelope1.maxx - envelope2.maxx) <= tolerance &&
            Math.abs(envelope1.maxy - envelope2.maxy) <= tolerance;
    }

    static init(): Envelope {
        return new Envelope(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
    }

    static overlaps(envelope1: IEnvelope | undefined, envelope2: IEnvelope | undefined): boolean {
        if (envelope1 === undefined || envelope2 === undefined) {
            return false;
        }

        if (((envelope1.minx >= envelope2.minx && envelope1.minx <= envelope2.maxx) 
            || (envelope1.maxx >= envelope2.minx && envelope1.maxx <= envelope2.maxx)
            || (envelope2.minx >= envelope1.minx && envelope2.minx <= envelope1.maxx)
            || (envelope2.maxx >= envelope1.minx && envelope2.maxx <= envelope1.maxx))
            && 
            ((envelope1.miny >= envelope2.miny && envelope1.miny <= envelope2.maxy)
            || (envelope1.maxy >= envelope2.miny && envelope1.maxy <= envelope2.maxy)
            || (envelope2.miny >= envelope1.miny && envelope2.miny <= envelope1.maxy)
            || (envelope2.maxy >= envelope1.miny && envelope2.maxy <= envelope1.maxy))) {
                return true;
        }

        return false;
    }
}