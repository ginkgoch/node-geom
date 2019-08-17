# Ginkgoch Geometries for Node.js
This project provides the basic functions for geometries. It allows to convert between `wkt`, `wkb`, `json` and our `well formatted geometry classes` to construct `Point`, `LineString`, `Polygon`, `MultiPoint`, `MultiLineString`, `MultiPolygon` and `GeometryCollection`. It is also a baseline project for building the entire `Ginkgoch Ecosystem`. 

## Install
```
yarn add ginkgoch-geom
```

## Docs
Visit [https://ginkgoch.github.io/node-geom](https://ginkgoch.github.io/node-geom) for detail.

## Demo
<script src="https://embed.runkit.com" data-element-id="my-element"></script>

<!-- anywhere else on your page -->
<div id="my-element">
    const geom = require("ginkgoch-geom")
    const point = new geom.Point(-119.698189, 34.420830);
    point.toJSON();
</div>

Full demo, please try on RunKit at: https://runkit.com/ginkgoch/geometry-demo
