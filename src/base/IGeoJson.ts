export default interface IGeoJson {
    type: string,
    id?: number,
    coordinates?: any
    geometries?: IGeoJson[],
    features?: IGeoJson[],
    geometry?: IGeoJson,
    properties?: any
}