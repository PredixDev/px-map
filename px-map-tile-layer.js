/*
Copyright (c) 2018, General Electric

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/*
    Relative paths assume component is being run from inside an app or another component, where dependencies are flat
    siblings. When this component is run from its own repo (e.g. tests, examples), we assume the server is started with
    'gulp serve' (or similar server setup) to enable correct finding of bower dependencies for local runs.
*/
/* Load required PxMapBehaviors */
/**
This subcomponent provides the baselayer for a px-map. The baselayer calls a
tile service, which loads tiles, i.e. square images, that together create a
full map. The title layer includes information like streets, buildings, national
parks, etc. Tile layers are mutually exclusive (there should be only one tile
layer per map).

### Choosing a tile server

Most px-map demos use the OpenStreetMap public tile service to serve map tiles
(e.g. `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`). This tile service is
used for demo purposes only. You should not use this tile service for production
applications; you will need to implement or purchase your own tile service.

The [OpenStreetMap Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/)
details specific restrictions for developers using their public tile service.
These restrictions include the following provision: "Heavy use (e.g. distributing
an app that uses tiles from openstreetmap.org) is forbidden without prior
permission". If you choose to use the OpenStreetMap service for demos or development,
you should likely replace the service URLs when your app is shipped to production.

The following list of companies provide tile service APIs that may be free or
paid and should be compatible with the px-map-tile-layer (note that these are
not endorsed, but just offered as options):

- [Mapbox](https://www.mapbox.com/help/how-mapbox-data-works/)
- [Carto](https://carto.com/location-data-services/basemaps/)
- [Mapzen](https://mapzen.com/products/maps/)

Any tile service that can be formatted using the z/x/y URL string template (see
the `url` attribute in this component's API docs section) should work. You can
also use the px-map-tile-layer-bing component to load map tiles from the Bing API.

### Usage

    <px-map>
      <px-map-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></px-map-tile-layer>
    </px-map>

@element px-map-tile-layer
@blurb Provides the baselayer for a px-map
@homepage index.html
@demo index.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import './px-map-behavior-tile-layer.js';
Polymer({
  _template: Polymer.html`
    <style>
      :host { display: none }
    </style>
`,

  is: 'px-map-tile-layer',
  behaviors: [PxMapBehavior.TileLayer]
});