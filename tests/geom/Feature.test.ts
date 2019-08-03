import { Feature, Point } from "../../src/index";

describe('Feature', () => {
    it('Feature - constructor 1', () => {
        let point = new Point(34.5, 89.4);
        let feature = new Feature(point);
        feature.properties.set('name', 'Nelson');
        feature.properties.set('age', 40);

        const json = {
            id: 0,
            type: 'feature',
            geometry: { type: 'Point', coordinates: [34.5, 89.4] },
            properties: { name: 'Nelson', age: 40 }
        }

        const json_ = feature.json();
        expect(json_).toEqual(json);
    });

    it('Feature - constructor 2', () => {
        let point = new Point(34.5, 89.4);
        let id = 24;
        let props = new Map<string, any>();
        props.set('RECID', 1);
        props.set('NAME', 'Nelson');

        let feature = new Feature(point, props, id);

        const json = {
            id,
            type: 'feature',
            geometry: { type: 'Point', coordinates: [34.5, 89.4] },
            properties: { RECID: 1, NAME: 'Nelson' }
        };

        const json_ = feature.json();
        expect(json_).toEqual(json);
    });

    it('Feature - constructor 3', () => {
        let feature = new Feature({ type: 'Point', coordinates: [34.5, 89.4] }, { RECID: 1, NAME: 'Nelson' }, 52);
        expect(feature.id).toBe(52);
        expect(feature.geometry).toEqual(new Point(34.5, 89.4));
        expect(feature.properties.get('RECID')).toBe(1);
        expect(feature.properties.get('NAME')).toEqual('Nelson');

        feature = new Feature({ type: 'Point', coordinates: [34.5, 89.4] }, { RECID: 1, NAME: 'Nelson' });
        expect(feature.id).toBe(0);
    });
});