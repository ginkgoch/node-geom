import { Feature, Point } from "../../src/index";

describe('Feature', () => {
    it('Feature', () => {
        let point = new Point(34.5, 89.4);
        let feature = new Feature(point);
        feature.properties.set('name', 'Nelson');
        feature.properties.set('age', 40);

        const json = { id: 0,
            type: 'feature',
            geometry: { type: 'Point', coordinates: [ 34.5, 89.4 ] },
            properties: { name: 'Nelson', age: 40 } 
        }

        const json_ = feature.json();
        expect(json_).toEqual(json);
    });
});