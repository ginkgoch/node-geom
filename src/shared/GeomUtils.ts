import { GeometryType } from "../geom/GeometryType";

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
}