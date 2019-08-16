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
        expect(fc.toJSON()).toEqual(expectedJson);

        const fc2 = FeatureCollection.create(expectedJson);
        expect(fc2).toEqual(fc);
    });

    it('constructor', () => {
        const f1 = { id: 0, geometry: new Point(1, 2), properties: new Map([['name', 'Samuel']]) };
        const f2 = { id: 0, geometry: new Point(5, 6), properties: new Map([['name', 'Joe']]) };
        const geom = new FeatureCollection([f1, f2], 20);
        expect(geom.id).toBe(20);
        expect(geom.features.length).toBe(2);
        
        expect(geom.features[0] instanceof Feature).toBeTruthy();
        expect(geom.features[0].geometry).toEqual(new Point(1, 2));
        expect(geom.features[0].properties.get('name')).toEqual('Samuel');

        expect(geom.features[1] instanceof Feature).toBeTruthy();
        expect(geom.features[1].geometry).toEqual(new Point(5, 6));
        expect(geom.features[1].properties.get('name')).toEqual('Joe');
    });
});