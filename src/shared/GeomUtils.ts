import { GeometryType } from "../GeometryType";

export default class GeomUtils {
    static geomTypeName(geomType: GeometryType): string {
        const enumType = GeometryType as any;
        for (let key in enumType) {
            if (enumType[key] === geomType) {
                return key;
            }
        }

        return "Unknown";
    }

    // static toTSGeom(geom: Geometry): jsts.geom.Geometry {
    //     const geomWkt = geom.wkt();
    //     return new jsts.io.WKTReader().read(geomWkt)
    // }

    // static fromTSGeom(geom: jsts.geom.Geometry): Geometry {

    // }
}