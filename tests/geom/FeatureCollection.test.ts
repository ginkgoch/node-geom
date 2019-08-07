import { Feature, Point, LineString, FeatureCollection } from "../../src";

describe('FeatureCollection', () => {
    it('json', () => {
        const f1 = new Feature(new Point(90, 70), { 'name': 'Samuel', 'age': 18 });
        const f2 = new Feature(new LineString([
            { x: 0, y: 0 },
            { x: 40, y: 40 },
            { x: 50, y: -90 },
        ]), { 'name': 'Sofia', 'age': 16 });

        const fc = new FeatureCollection([f1, f2]);
        const expectedJson = { "id": 0, "type": "FeatureCollection", "features": [{ "id": 0, "type": "Feature", "geometry": { "type": "Point", "coordinates": [90, 70] }, "properties": { "name": "Samuel", "age": 18 } }, { "id": 0, "type": "Feature", "geometry": { "type": "LineString", "coordinates": [[0, 0], [40, 40], [50, -90]] }, "properties": { "name": "Sofia", "age": 16 } }] };
        expect(fc.json()).toEqual(expectedJson);

        const fc2 = FeatureCollection.create(expectedJson);
        expect(fc2).toEqual(fc);
    });
});