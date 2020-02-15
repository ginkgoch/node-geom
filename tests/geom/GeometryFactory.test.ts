import Utils from "../shared/Utils";
import Point from "../../src/geom/Point";
import Polygon from "../../src/geom/Polygon";
import Geometry from "../../src/geom/Geometry";
import LineString from "../../src/geom/LineString";
import LinearRing from "../../src/geom/LinearRing";
import MultiPoint from "../../src/geom/MultiPoint";
import MultiPolygon from "../../src/geom/MultiPolygon";
import MultiLineString from "../../src/geom/MultiLineString";
import GeometryFactory from "../../src/geom/GeometryFactory";
import GeometryCollection from "../../src/geom/GeometryCollection";

describe('GeometryFactory', () => {
    it('create point', () => {
        const geom = new Point(34.222, 23.321);
        testCreate(geom);
    });

    it('create line', () => {
        const geom = new LineString(
            Utils.randomLineString(5)
        );

        testCreate(geom);
    });

    it('create ring', () => {
        const geom = new LinearRing(
            Utils.randomLineString(5)
        );

        testCreate(geom);
    });

    it('create polygon', () => {
        const geom = new Polygon(
            new LinearRing(Utils.randomLineString(5)),
            new LinearRing(Utils.randomLineString(7))
        );

        testCreate(geom);
    });

    it('create multi point', () => {
        const geom = new MultiPoint([
            Utils.randomPoint(),
            Utils.randomPoint(),
            Utils.randomPoint(),
            Utils.randomPoint()
        ].map(c => new Point(c.x, c.y)));

        testCreate(geom);
    });

    it('create multi line', () => {
        const geom = new MultiLineString([
            new LineString(Utils.randomLineString(3)),
            new LineString(Utils.randomLineString(5)),
            new LineString(Utils.randomLineString(2))
        ]);

        testCreate(geom);
    });

    it('create multi polygon', () => {
        const geom = new MultiPolygon([
            new Polygon(new LinearRing(Utils.randomRing(6))),
            new Polygon(new LinearRing(Utils.randomRing(5))),
            new Polygon(new LinearRing(Utils.randomRing(9)))
        ]);

        testCreate(geom);
    });

    it('create geometry collection', () => {
        const geom = new GeometryCollection([
            new Polygon(new LinearRing(Utils.randomRing(6))),
            new Point(34.222, 23.321),
            new LineString(Utils.randomLineString(3))
        ]);

        testCreate(geom);
    });

    it('build circle', () => {
        let circle = GeometryFactory.buildCircle({ x: 20, y: 20 }, 10);
        expect(circle.toWKT()).toEqual('POLYGON((30 20,29.84807753012208 18.263518223330696,29.396926207859085 16.579798566743314,28.66025403784439 15,27.66044443118978 13.572123903134607,26.427876096865393 12.33955556881022,25 11.339745962155614,23.42020143325669 10.603073792140917,21.736481776669304 10.15192246987792,20 10,18.263518223330696 10.15192246987792,16.579798566743314 10.603073792140915,15.000000000000002 11.339745962155613,13.572123903134607 12.33955556881022,12.339555568810221 13.572123903134605,11.339745962155613 15,10.603073792140917 16.57979856674331,10.15192246987792 18.263518223330692,10 20,10.151922469877919 21.7364817766693,10.603073792140915 23.420201433256686,11.339745962155611 24.999999999999996,12.33955556881022 26.427876096865393,13.572123903134605 27.66044443118978,14.999999999999996 28.660254037844386,16.579798566743307 29.39692620785908,18.263518223330696 29.84807753012208,19.999999999999996 30,21.7364817766693 29.848077530122083,23.420201433256683 29.396926207859085,25 28.660254037844386,26.427876096865393 27.66044443118978,27.660444431189777 26.427876096865397,28.660254037844382 25.000000000000004,29.39692620785908 23.420201433256693,29.84807753012208 21.736481776669304,30 20))');
    });

    it('build ellipse', () => {
        let ellipse = GeometryFactory.buildEllipse({ x: 20, y: 20 }, 20, 10);
        expect(ellipse.toWKT()).toEqual('POLYGON((40 20,39.69615506024416 18.263518223330696,38.79385241571817 16.579798566743314,37.32050807568878 15,35.32088886237956 13.572123903134607,32.85575219373079 12.33955556881022,30 11.339745962155614,26.840402866513376 10.603073792140917,23.47296355333861 10.15192246987792,20 10,16.527036446661395 10.15192246987792,13.159597133486626 10.603073792140915,10.000000000000004 11.339745962155613,7.144247806269213 12.33955556881022,4.679111137620442 13.572123903134605,2.6794919243112254 15,1.2061475842818332 16.57979856674331,0.3038449397558409 18.263518223330692,0 20,0.3038449397558374 21.7364817766693,1.2061475842818297 23.420201433256686,2.679491924311222 24.999999999999996,4.679111137620438 26.427876096865393,7.14424780626921 27.66044443118978,9.999999999999991 28.660254037844386,13.159597133486614 29.39692620785908,16.527036446661395 29.84807753012208,19.999999999999996 30,23.472963553338598 29.848077530122083,26.840402866513365 29.396926207859085,30 28.660254037844386,32.85575219373079 27.66044443118978,35.320888862379554 26.427876096865397,37.320508075688764 25.000000000000004,38.79385241571816 23.420201433256693,39.69615506024416 21.736481776669304,40 20))');
    });

    it('build star', () => {
        let star = GeometryFactory.buildStar({ x: 20, y: 20 }, 5, 20);
        expect(star.toWKT()).toEqual('POLYGON((40 20,28.090169943749473 14.122147477075268,26.18033988749895 0.9788696740969307,16.909830056250527 10.489434837048464,3.8196601125010545 8.244294954150535,10 20,3.819660112501051 31.75570504584946,16.909830056250524 29.510565162951536,26.180339887498945 39.02113032590307,28.090169943749473 25.877852522924734,40 20))');
        
        star = GeometryFactory.buildStar({ x: 20, y: 20 }, 5, 20, 8);
        expect(star.toWKT()).toEqual('POLYGON((40 20,26.47213595499958 15.297717981660215,26.18033988749895 0.9788696740969307,17.52786404500042 12.39154786963877,3.8196601125010545 8.244294954150535,12 20,3.819660112501051 31.75570504584946,17.52786404500042 27.60845213036123,26.180339887498945 39.02113032590307,26.47213595499958 24.702282018339787,40 20))');
    });

    it('build square', () => {
        let square = GeometryFactory.buildSquare({ x: 20, y: 20 }, 40);
        expect(square.toWKT()).toEqual('POLYGON((40 40,40 0,0 0,0 40,40 40))');
    });

    it('build rectangle', () => {
        let square = GeometryFactory.buildRectangle({ x: 20, y: 20 }, 20, 40);
        expect(square.toWKT()).toEqual('POLYGON((30 40,30 0,10 0,10 40,30 40))');
    });
});

function testCreate(geom: Geometry) {
    const wkt = geom.toWKT();
    const point2 = GeometryFactory.create(wkt);
    const point3 = GeometryFactory.create(geom._ts());

    expect(geom).toEqual(point2);
    expect(geom).toEqual(point3);
}