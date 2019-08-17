import { Feature, Point, IFeature } from "../../src/index";
import Utils from '../shared/Utils';
import Constants from "../../src/shared/Constants";

describe('Feature', () => {
    it('Feature - constructor 1', () => {
        let point = new Point(34.5, 89.4);
        let feature = new Feature(point);
        feature.properties.set('name', 'Nelson');
        feature.properties.set('age', 40);

        const json = {
            id: 0,
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [34.5, 89.4] },
            properties: { name: 'Nelson', age: 40 }
        }

        const json_ = feature.toJSON();
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
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [34.5, 89.4] },
            properties: { RECID: 1, NAME: 'Nelson' }
        };

        const json_ = feature.toJSON();
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

    it('envelope', () => {
        const geom = Utils.randomLineStringGeometry(20);
        const feature = new Feature(geom);
        const envelope1 = feature.envelope();
        const envelope2 = geom.envelope();
        expect(envelope1).toEqual(envelope2);
    });

    it('clone', () => {
        const feature = new Feature(new Point(23, 45), { 'name': 'Samuel', 'age': 57, 'gender': 'male' }, 20);

        let f = feature.clone();
        expect(f.id).toBe(20);
        expect(f.geometry).toEqual(new Point(23, 45));
        expect(f.properties.get('name')).toEqual('Samuel');
        expect(f.properties.get('age')).toEqual(57);
        expect(f.properties.get('gender')).toEqual('male');

        f = feature.clone('all');
        expect(f.id).toBe(20);
        expect(f.geometry).toEqual(new Point(23, 45));
        expect(f.properties.get('name')).toEqual('Samuel');
        expect(f.properties.get('age')).toEqual(57);
        expect(f.properties.get('gender')).toEqual('male');

        f = feature.clone(undefined);
        expect(f.id).toBe(20);
        expect(f.geometry).toEqual(new Point(23, 45));
        expect(f.properties.get('name')).toEqual('Samuel');
        expect(f.properties.get('age')).toEqual(57);
        expect(f.properties.get('gender')).toEqual('male');

        f = feature.clone('none');
        expect(f.id).toBe(20);
        expect(f.geometry).toEqual(new Point(23, 45));
        expect(f.properties.size).toBe(0);

        f = feature.clone(['name', 'noColumn']);
        expect(f.id).toBe(20);
        expect(f.geometry).toEqual(new Point(23, 45));
        expect(f.properties.size).toEqual(1);
        expect(f.properties.get('name')).toEqual('Samuel');
    });

    it('create', () => {
        const geom = new Point(23, 34);
        const props = { name: 'Samuel', age: 35 };
        const id = 78;
        const feature1 = new Feature(geom, props, id);
        const json1 = feature1.toJSON();

        const feature2 = Feature.create(json1);
        expect(feature2).toEqual(feature1);

        const f = { type: Constants.TYPE_FEATURE, id, geometry: geom, properties: new Map<string, any>([['name', 'Samuel'], ['age', 35]]) };
        const feature3 = Feature.create(f);
        expect(feature3).toEqual(feature1);
    });

    it('parseJSON', () => {
        const geom = new Point(23, 34);
        const props = { name: 'Samuel', age: 35 };
        const id = 78;
        const feature1 = new Feature(geom, props, id);
        const json1 = feature1.toJSON();

        const feature2 = Feature.parseJSON(json1);
        expect(feature2).toEqual(feature1);
    });
});