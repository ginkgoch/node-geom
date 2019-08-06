import Envelope from "../../src/geom/Envelope";
import IEnvelope from "../../src/base/IEnvelope";

describe('envelope helper test', () => {
    test('disjoined test', () => {
        let env1 = new Envelope(0, 0, 10, 10);
        let env2: IEnvelope = new Envelope(-20, -20, -10, -10);
        expect(Envelope.disjoined(env1, env2)).toBeTruthy();

        env2 = new Envelope(20, 0, 30, 10);
        expect(Envelope.disjoined(env1, env2)).toBeTruthy();

        env2 = new Envelope(-5, 0, 5, 10);
        expect(Envelope.disjoined(env1, env2)).toBeFalsy();

        env2 = { minx: -5, miny: 0, maxx: 5, maxy: 10 };
        expect(Envelope.disjoined(env1, env2)).toBeFalsy();

        expect(Envelope.disjoined(env1, undefined)).toBeFalsy();
        
        expect(Envelope.disjoined(undefined, undefined)).toBeFalsy();
    });

    test('equals', () => {
        let env1 = {minx: -20, miny: -20, maxx: 20, maxy: 20};
        let env2 = {minx: -20, miny: -20, maxx: 20, maxy: 20};
        let result = Envelope.equals(env1, env2);
        expect(result).toBeTruthy();

        env1 = {minx: -40, miny: -20, maxx: 20, maxy: 20};
        env2 = {minx: -20, miny: -20, maxx: 20, maxy: 20};
        result = Envelope.equals(env1, env2);
        expect(result).toBeFalsy();

        env1 = {minx: -20.0001, miny: -20, maxx: 20, maxy: 20};
        env2 = {minx: -20, miny: -20, maxx: 20, maxy: 20};
        result = Envelope.equals(env1, env2);
        expect(result).toBeFalsy();

        env1 = {minx: -20.0001, miny: -20, maxx: 20, maxy: 20};
        env2 = {minx: -20, miny: -20, maxx: 20, maxy: 20};
        result = Envelope.equals(env1, env2, 0.001);
        expect(result).toBeTruthy();
    });

    it('contains', () => {
        let envelope1 = { minx: -180, miny: -90, maxx: 180, maxy: 90 };
        let envelope2 = { minx: -90, miny: -40, maxx: 90, maxy: 40 };
        let rel = Envelope.contains(envelope1, envelope2);
        expect(rel).toBeTruthy();

        envelope2 = { minx: -190, miny: -40, maxx: -181, maxy: 40 };
        rel = Envelope.contains(envelope1, envelope2);
        expect(rel).toBeFalsy();

        envelope2 = { minx: -190, miny: -40, maxx: -9, maxy: 40 };
        rel = Envelope.contains(envelope1, envelope2);
        expect(rel).toBeFalsy();
    });

    it('unionAll', () => {
        const envelope1 = { minx: -20, miny: 0, maxx: 0, maxy: 20 };
        const envelope2 = { minx: 0, miny: 0, maxx: 20, maxy: 20 };
        const envelope3 = { minx: -20, miny: -20, maxx: 0, maxy: 0 };
        const envelope4 = { minx: 0, miny: -20, maxx: 20, maxy: 0 };

        const result = Envelope.unionAll([ envelope1, envelope2, envelope3, envelope4 ]);
        expect(result).toEqual({ minx: -20, miny: -20, maxx: 20, maxy: 20 });
    });
});