/** @category BaseTypes */
export default interface IGeoJSON {
    type: string,
    id?: number,
    coordinates?: any
    geometries?: IGeoJSON[],
    features?: IGeoJSON[],
    geometry?: IGeoJSON,
    properties?: any
}