import { Geometry } from "..";

export default interface IFeature {
    id: number;
    geometry: Geometry;
    properties: Map<string, any>;
    type?: string;
}