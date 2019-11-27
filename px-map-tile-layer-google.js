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
/* Load external dependencies */
/* Load required PxMapBehaviors */
/**
Adds a Google Maps Tile layer. Google tiles are requested by authenticating with a
valid Google Maps Tile API key and choosing the type of imagery to display.

Note that a Google Maps Tile API key is not provided by this component. You will need
to [obtain your own API key](https://developers.google.com/maps/documentation/tile/#api-key).

If you do not provide an API key, the map will not load any tiles.

### Usage

    <px-map>
      <px-map-tile-layer-google key="XXXXXXXXXXXXXXXXXXXXX"></px-map-tile-layer-google>
    </px-map>

@element px-map-tile-layer-google
@blurb Loads base layer tiles from the Google Maps API
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
import 'leaflet-google-tiles/leaflet-google-layer.js';
Polymer({
  _template: Polymer.html`
    <style>
      :host { display: none }
    </style>
`,

  is: 'px-map-tile-layer-google',
  behaviors: [PxMapBehavior.Layer],

  properties: {
    /**
     * A valid Google Maps Tile API key. Required to fetch the tiles - if it is not
     * provided, no tiles will be loaded.
     */
    key: {
      type: String,
      observer: 'shouldUpdateInst'
    },

    /**
     * The map type to use. Choose from the following options:
     *
     * - 'roadmap' - (default) The standard Google Maps painted map tiles.
     * - 'satellite' - Satellite imagery.
     *
     * The following Google imagery sets are not supported: 'terrain, streetview'
     */
    imagery: {
      type: String,
      value: 'roadmap',
      observer: 'shouldUpdateInst'
    },

    /**
     * A region identifier representing the physical location of the user to whom
     * the tiles are shown.
     * Google Maps applies a default bias for application behavior towards the United States.
     * If you want to alter your application to serve different map tiles you can override
     * this default behavior by specifying a region.
     * Accepts Unicode region subtag identifiers which (generally) have a one-to-one
     * mapping to country code Top-Level Domains (ccTLDs).
     */
    region: {
      type: String,
      value: 'us',
      observer: 'shouldUpdateInst'
    },

    /**
     * A Common Locale Data Repository language identifier indicating the
     * language information on the tiles should be presented in.
     * For a list of supported languages, see: https://developers.google.com/maps/faq#languagesupport
     */
    language: {
      type: String,
      value: 'en-US',
      observer: 'shouldUpdateInst'
    },

    /**
     * Optional custom styling for the map.
     * To learn more about map stying options, see:
     * https://developers.google.com/maps/documentation/javascript/styling.
     */
    mapStyle: {
      type: Array,
      value: function() {return [];},
      observer: 'shouldUpdateInst'
    },

    /**
     * Opacity of the layer. Particularly useful for reducing the intensity
     * of color from satellite imagery. Accepts values between 0.0 and 1.0.
     */
    opacity: {
      type: Number,
      value: 1.0,
      observer: 'shouldUpdateInst'
    }
  },

  canAddInst: function() {
    return (typeof this.key === 'string') && this.key.length;
  },

  createInst: function(options) {
    return L.tileLayer.google(options);
  },

  updateInst: function(lastOptions, nextOptions) {
    if (lastOptions.GoogleTileAPIKey !== nextOptions.GoogleTileAPIKey) {
      this.elementInst.setKey(nextOptions.GoogleTileAPIKey);
    }
    if (lastOptions.imagery !== nextOptions.imagery) {
      this.elementInst.setMapType(nextOptions.imagery);
    }
    if (lastOptions.language !== nextOptions.language) {
      this.elementInst.setLanguage(nextOptions.language);
    }
    if (lastOptions.region !== nextOptions.region) {
      this.elementInst.setRegion(nextOptions.region);
    }
    if (lastOptions.mapStyleHash !== nextOptions.mapStyleHash) {
      this.elementInst.setMapStyle(nextOptions.mapStyle);
    }
    if (lastOptions.opacity !== nextOptions.opacity) {
      this.elementInst.setOpacity(nextOptions.opacity);
    }
  },

  getInstOptions: function() {
    return {
      GoogleTileAPIKey: this.key,
      imagery: this.imagery,
      language: this.language,
      region: this.region,
      mapStyle: this.mapStyle,
      mapStyleHash: JSON.stringify(this.mapStyle || []),
      opacity: this.opacity
    };
  }
});
