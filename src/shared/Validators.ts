export default class Validators {
    /** coordinates type could by number[] or number[][] */
    static validateCoordinateNumbers(coordinates: any[], validLength: number) {
        if (coordinates.length < validLength) {
            throw new Error(`Coordinates must have at least ${validLength} numbers.`);
        }
    }
}