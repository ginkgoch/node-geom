export default interface IGeoJson {
    type: string,
    coordinates?: any
    geometries?: IGeoJson[]
}