# px-map

See demos and API documentation on the [Predix UI](https://www.predix-ui.com/#/components/px-map/) website.

## Overview

`px-map` is a lightweight framework for building interactive maps with web components and Polymer. The framework includes a base mapping component (`<px-map>`) that can be used with many different subcomponents to solve common mapping UI problems, like plotting geographic data.

### Usage

#### Example: Basic map

Below is a simple example with little configuration that will display a map centered on Tokyo, Japan:

    <px-map lat="35.6895" lng="139.6917" zoom="12" style="width: 500px; height: 300px;">
      <px-map-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></px-map-tile-layer>
      <px-map-control-zoom position="bottomright"></px-map-control-zoom>
    </px-map>

This example uses the `<px-map>` base component to draw a map and center it on a specific location when it first loads.

If we stopped there and didn't add any subcomponents, the map would load, draw itself, and center on Tokyo, but we would only see a gray background. The map needs a base layer — some underlying imagery that shows road networks or satellite imagery or terrain information. In this example, we use the `<px-map-tile-layer>` subcomponent to load imagery from an OpenStreetMap tile layer service showing the road network and other points of interest.

Finally, we use the `<px-map-control-zoom>` subcomponent to add a zoom control that lets the user click or tap buttons to zoom in and out of the map.

#### Example: Visualizing geospatial data

Plotting geospatial data on the map is easy — just choose the right subcomponent to show the information you have. For example, we can plot two points-of-interest in Tokyo using static markers:

    <px-map fit-to-markers style="width: 500px; height: 300px;">
      <px-map-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></px-map-tile-layer>
      <px-map-control-zoom position="bottomright"></px-map-control-zoom>

      <px-map-layer-group name="Landmarks">
        <px-map-marker-static lat="35.6763976" lng="35.6763976">
          <px-map-popup-info title="Meiji Jingu" description="Shinto shrine dedicated to the Emperor Meiji and Empress Shoken."></px-map-popup-info>
        </px-map-marker-static>
        <px-map-marker-static lat="35.6654861" lng="139.7706668">
          <px-map-popup-info title="Tsukiji Market" description="Sprawling wholesale fish market with an array of seafood & viewing areas for a popular tuna auction."></px-map-popup-info>
        </px-map-marker-static>
      </px-map-layer-group>
    </px-map>

This example sets up a `<px-map>` base component that will automatically set its location and zoom level to fit the markers we added. It adds a basic tile layer (`<px-map-tile-layer>`) and zoom control (`<px-map-zoom-control>`).

To plot related points of interest, we use the `<px-map-layer-group>` and give it a descriptive name. We add markers with geographic data that describes their location using `<px-map-marker-static>`. To give users more information about each point, we add popups to both markers with the name and description of the place they represent using `<px-map-popup-info>`.

### What you can do with px-map

Out of the box, `px-map` includes the basic things needed to draw and plot data on an interactive map. It is also extensible — development teams are encouraged to build their own subcomponents that add features needed for their application.

The following components are available:

Base map

- `<px-map>`: Draws the underlying map, sets location/zoom and notifies updates when the user interacts with the map, enables and disables interactions, orchestrates subcomponents

Tile layers

- `<px-map-tile-layer>`: Calls a tile service API to fetch underlying tile images for the map

Overlay/visualization layers

- `<px-map-layer-group>`: Groups related overlays together to allow for bulk interactions (e.g. hide all in the group)
- `<px-map-marker-static>`: Creates a marker that shows the state of a point/asset (e.g. with color)
- `<px-map-marker-symbol>`: Creates a marker with an icon that shows the state of a point/asset
- `<px-map-marker-locate>`: Creates a marker that represents the user's location
- `<px-map-marker-group>`: Draws many markers in clusters, useful for visualizing thousands of points that can be dynamically updated

UI components

- `<px-map-popup-info>`: Binds a popup that can include text or an image to markers
- `<px-map-popup-data>`: Binds a popup that can include text and key/value data to markers

Controls

- `<px-map-control-zoom>`: Adds zoom buttons the user can tap to zoom in or out
- `<px-map-control-scale>`: Adds a scale that shows the distance of an area on the map in miles/kilometers
- `<px-map-control-locate>`: Adds a button the user can tap to locate themselves on the map and center the map on their location

The current major release (v1.X) is focused on providing essential controls, tile layer API support, and on plotting point-based data (e.g. markers) and updating the point data in real time. Support for drawing lines, polygons, and other geospatial data representations hasn't been added to the framework and will require some extensions if needed. New subcomponents will be added over time.

### What's under the hood

The current major release of `px-map` uses the open source Leaflet library to support displaying a map with base tiles and geospatial overlays. Future iterations of the component may offer the ability to use a different library in place of Leaflet, while keeping the same basic API.

### Prerequisites
1. node.js
2. npm
3. bower
4. [webcomponents-lite.js polyfill](https://github.com/webcomponents/webcomponentsjs)

Node, npm and bower are necessary to install the component and dependencies. webcomponents.js adds support for web components and custom elements to your application.

## Getting Started

First, install the component via bower on the command line.

```
bower install px-map --save
```

Second, import the component to your application with the following tag in your head.

```
<link rel="import" href="/bower_components/px-map/px-map.html" />
<link rel="import" href="/bower_components/px-map/px-map-tile-layer.html" />
```

Finally, use the component in your application:

```
<px-map lat="35.6895" lng="139.6917" zoom="12">
  <px-map-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></px-map-tile-layer>
</px-map>
```

<br />
<hr />

## Documentation

Read the full API and view the demo [here](https://www.predix-ui.com/#/components/px-map).

The documentation in this repository is supplemental to the official Predix documentation, which is continuously updated and maintained by the Predix documentation team. Go to [http://predix.io](http://predix.io)  to see the official Predix documentation.


## Local Development

From the component's directory...

```
$ npm install
$ bower install
$ gulp sass
```

From the component's directory, to start a local server run:

```
$ gulp serve
```

Navigate to the root of that server (e.g. http://localhost:8080/) in a browser to open the API documentation page, with link to the "Demo" / working examples.

### GE Coding Style Guide
[GE JS Developer's Guide](https://github.com/GeneralElectric/javascript)

<br />
<hr />

## Known Issues

Please use [Github Issues](https://github.com/predixdesignsystem/px-map/issues) to submit any bugs you might find.
