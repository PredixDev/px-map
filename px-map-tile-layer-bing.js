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
Adds a Bing Maps tile layer. Bing tiles are requested by authenticating with a
valid Bing Maps API key and choosing the type of imagery to display.

Note that a Bing Maps API key is not provided by this component. You will need
to [sign up and create your own API key](https://msdn.microsoft.com/en-us/library/ff428642.aspx).

If you do not provide an API key, the map will not load any tiles.

### Usage

    <px-map>
      <px-map-tile-layer-bing key="XXXXXXXXXXXXXXXXXXXXX"></px-map-tile-layer-bing>
    </px-map>

@element px-map-tile-layer-bing
@blurb Loads base layer tiles from the Bing Maps API
@homepage index.html
@demo index.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import 'leaflet-bing-tiles/leaflet-bing-tiles.js';
import './px-map-behavior-tile-layer.js';
Polymer({
  _template: Polymer.html`
    <style>
      :host { display: none }
    </style>
`,

  is: 'px-map-tile-layer-bing',
  behaviors: [PxMapBehavior.Layer],

  properties: {
    /**
     * A valid Bing Maps API key. Required to fetch the tiles - if it is not
     * provided, no tiles will be loaded.
     */
    key: {
      type: String,
      observer: 'shouldUpdateInst'
    },

    /**
     * The imagery set to use. Choose from the following options:
     *
     * - 'Aerial' - (default) Aerial imagery
     * - 'AerialWithLabels' - Aerial imagery with a road overlay.
     * - 'Roads' - Roads without additional imagery
     *
     * The following Bing imagery sets are not supported: 'Birdseye',
     * 'BirdseyeWithLabels', 'OrdnanceSurvey'.
     */
    imagery: {
      type: String,
      value: 'Aerial',
      observer: 'shouldUpdateInst'
    },

    /**
     * Set to disable adding attribution information to the map for this
     * tile layer.
     *
     * @type {Boolean}
     */
    disableAttribution: {
      type: Boolean,
      value: false,
      observer: 'shouldUpdateInst'
    },

    /**
     * Language code for map labels. For a list of acceptable codes, see:
     * https://msdn.microsoft.com/en-us/library/hh441729.aspx
     */
    languageCode: {
      type: String,
      value: 'en-US',
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
    return L.tileLayer.bing(options);
  },

  updateInst: function(lastOptions, nextOptions) {
    if (lastOptions.bingMapsKey !== nextOptions.bingMapsKey) {
      this.elementInst.setKey(nextOptions.bingMapsKey);
    }
    if (lastOptions.imagerySet !== nextOptions.imagerySet) {
      this.elementInst.setImagery(nextOptions.imagerySet);
    }
    if (lastOptions.culture !== nextOptions.culture) {
      this.elementInst.setCulture(nextOptions.culture);
    }
    if (lastOptions.noAttribution !== nextOptions.noAttribution) {
      if (nextOptions.noAttribution) {
        this.elementInst.disableAttribution();
      } else {
        this.elementInst.enableAttribution();
      }
    }
    if (lastOptions.opacity !== nextOptions.opacity) {
      this.elementInst.setOpacity(nextOptions.opacity);
    }
  },

  getInstOptions: function() {
    return {
      bingMapsKey: this.key,
      imagerySet: this.imagery,
      culture: this.languageCode,
      noAttribution: this.disableAttribution,
      opacity: this.opacity
    };
  }
});
