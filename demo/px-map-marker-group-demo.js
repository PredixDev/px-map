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
/* Common imports */
/* Common demo imports */
/* Imports for this component */
/* Demo DOM module */
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import 'px-demo/px-demo-header.js';
import 'px-demo/px-demo-api-viewer.js';
import 'px-demo/px-demo-footer.js';
import 'px-demo/px-demo-configs.js';
import 'px-demo/px-demo-props.js';
import 'px-demo/px-demo-interactive.js';
import 'px-demo/px-demo-component-snippet.js';
import 'px-demo/px-demo-code-editor.js';
import '../px-map.js';
import '../px-map-tile-layer.js';
import '../px-map-marker-group.js';
Polymer({
  _template: Polymer.html`
  <!-- Header -->
  <px-demo-header module-name="px-map-marker-group" parent-name="px-map" description="The px-map-marker-group subcomponent lets you load a large number of markers onto your map." mobile="" tablet="" desktop="">
  </px-demo-header>

  <!-- Interactive -->
  <px-demo-interactive>
    <!-- Configs -->
    <px-demo-configs slot="px-demo-configs" configs="[[configs]]" props="{{props}}" chosen-config="{{chosenConfig}}"></px-demo-configs>

    <!-- Props -->
    <px-demo-props slot="px-demo-props" props="{{props}}" config="[[chosenConfig]]"></px-demo-props>

    <px-demo-code-editor slot="px-demo-code-editor" props="{{props}}" config="[[chosenConfig]]"></px-demo-code-editor>

    <!-- Component ---------------------------------------------------------->
    <px-demo-component slot="px-demo-component">
      <div style="height:400px;width:600px;display:flex">
        <px-map flex-to-size="" fit-to-markers="" disable-scroll-zoom="" disable-touch-zoom="" attribution-prefix="<a href=&quot;http://leafletjs.com&quot; title=&quot;A JS library for interactive maps&quot;>Leaflet</a> | © <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap contributors</a>">
          <px-map-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></px-map-tile-layer>
          <px-map-marker-group name="Bus stop data" data="{{props.data.value}}"></px-map-marker-group>
        </px-map>
      </div>
    </px-demo-component>
    <!-- END Component ------------------------------------------------------>

    <px-demo-component-snippet slot="px-demo-component-snippet" element-properties="{{props}}" element-name="px-map-marker-group" links-includes="[&quot;px-map/px-map.html&quot;,&quot;px-map/px-map-tile-layer.html&quot;,&quot;px-map/px-map-marker-group.html&quot;,&quot;px-d3-imports/px-polygit-imports-d3.html&quot;]">
    </px-demo-component-snippet>
  </px-demo-interactive>

  <!-- API Viewer -->
  <px-demo-api-viewer source="px-map-marker-group" api-source-file-path="px-map/px-map-api.json" mark-private="[[apiMarkPrivate]]">
  </px-demo-api-viewer>

  <!-- Footer -->
  <px-demo-footer></px-demo-footer>
`,

  is: 'px-map-marker-group-demo',

  properties: {

    /**
     * Note: The actual data/values for `props` are placed in `this.demoProps`
     * to create a static reference that Polymer shouldn't overwrite.
     *
     * @property props
     * @type {Object}
     */
    props: {
      type: Object,
      value: function(){ return this.demoProps; }
    },



    /**
     * An array of pre-configured `props` that can be used to provide the user
     * with a set of common examples. These configs will be made available
     * as a set of tabs the user can click that will automatically change
     * the `props` to specific values.
     *
     * @property configs
     * @type {Array}
     */
    configs: {
      type: Array,
      value: function(){
        return [
          { configName: "Basic",
            configReset: true },
          ]
      }
    },

    apiMarkPrivate: {
      type: Array,
      value: function() {
        return [
          "notifyInstReady",
          "notifyInstReady",
          "canAddInst",
          "shouldAddInst",
          "addInst",
          "shouldRemoveInst",
          "removeInst",
          "shouldUpdateInst",
          "updateInst",
          "createInst",
          "getInstOptions",
          "bindEvents",
          "unbindAllEvents",
          "addProperties",
          "extendObj",
          "getShadyScope",
          "isShadyScoped"
        ]
      }
    }
  },

  /**
   * A reference for `this.props`. Read the documentation there.
   *
   * @property demoProps
   * @type {Object}
   */
  demoProps: {
    name: {
      type: String,
      defaultValue: 'Bus stop data',
      inputType: 'text'
    },

    data: {
      type: Object,
      inputType: 'code:JSON',
      defaultValue: {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                "-117.24042573",
                "32.67445793"
              ]
            },
            "properties": {
              "title": "Cabrillo National Monument",
              "marker-icon": {
                "icon-base": "static-icon",
                "icon-type": "warning",

              }
            },
            "id": "10001"
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                "-117.27618677",
                "32.83957829"
              ]
            },
            "properties": {
              "title": "Pearl St & Draper Av",
              "marker-icon": {
                "icon-base": "static-icon",
                "icon-type": "info",

              }
            },
            "id": "10003"
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                "-117.2738099",
                "32.84012848"
              ]
            },
            "properties": {
              "title": "Pearl St & Fay Av",
              "marker-icon": {
                "icon-base": "static-icon",
                "icon-type": "unknown",

              }
            },
            "id": "10004"
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                "-117.26867322",
                "32.8458467"
              ]
            },
            "properties": {
              "title": "Torrey Pines Rd & Exchange Pl",
              "marker-icon": {
                "icon-base": "static-icon",
                "icon-type": "important",

              }
            },
            "id": "10006"
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                "-117.26175158",
                "32.84931178"
              ]
            },
            "properties": {
              "title": "Torrey Pines Rd & Hillside Dr",
              "marker-icon": {
                "icon-base": "static-icon",
                "icon-type": "unknown",

              }
            },
            "id": "10007"
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                "-117.24825013",
                "32.79810093"
              ]
            },
            "properties": {
              "title": "Garnet Av & Everts St",
              "marker-icon": {
                "icon-base": "static-icon",
                "icon-type": "unknown",

              }
            },
            "id": "10011"
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                "-117.24583394",
                "32.79652904"
              ]
            },
            "properties": {
              "title": "Grand Av & Fanuel St",
              "marker-icon": {
                "icon-base": "static-icon",
                "icon-type": "warning",

              }
            },
            "id": "10012"
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                "-117.24277358",
                "32.79929398"
              ]
            },
            "properties": {
              "title": "Garnet Av & Haines St",
              "marker-icon": {
                "icon-base": "static-icon",
                "icon-type": "info",

              }
            },
            "id": "10013"
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                "-117.24120249",
                "32.79965017"
              ]
            },
            "properties": {
              "title": "Garnet Av & Ingraham St",
              "marker-icon": {
                "icon-base": "static-icon",
                "icon-type": "important",

              }
            },
            "id": "10015"
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                "-117.23906319",
                "32.80012359"
              ]
            },
            "properties": {
              "title": "Garnet Av & Jewell St",
              "marker-icon": {
                "icon-base": "static-icon",
                "icon-type": "unknown",

              }
            },
            "id": "10016"
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                "-117.23574899",
                "32.74506671"
              ]
            },
            "properties": {
              "title": "Voltaire St & Mendocino St",
              "marker-icon": {
                "icon-base": "static-icon",
                "icon-type": "warning",

              }
            },
            "id": "10020"
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                "-117.23556667",
                "32.80087716"
              ]
            },
            "properties": {
              "title": "Garnet Av & Lamont St",
              "marker-icon": {
                "icon-base": "static-icon",
                "icon-type": "warning",

              }
            },
            "id": "10023"
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                "-117.23353563",
                "32.74286905"
              ]
            },
            "properties": {
              "title": "Voltaire St & San Clemente St",
              "marker-icon": {
                "icon-base": "static-icon",
                "icon-type": "warning",

              }
            },
            "id": "10024"
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                "-117.23174882",
                "32.8017129"
              ]
            },
            "properties": {
              "title": "Garnet Av & Noyes St",
              "marker-icon": {
                "icon-base": "static-icon",
                "icon-type": "warning",

              }
            },
            "id": "10025"
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                "-117.22970402",
                "32.73814733"
              ]
            },
            "properties": {
              "title": "Chatsworth Bl & Tennyson St",
              "marker-icon": {
                "icon-base": "static-icon",
                "icon-type": "warning",

              }
            },
            "id": "10026"
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                "-117.22929493",
                "32.74025595"
              ]
            },
            "properties": {
              "title": "Voltaire St & Poinsettia Dr",
              "marker-icon": {
                "icon-base": "static-icon",
                "icon-type": "unknown",

              }
            },
            "id": "10027"
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                "-117.22673314",
                "32.75266115"
              ]
            },
            "properties": {
              "title": "West Point Loma Bl & Adrian St",
              "marker-icon": {
                "icon-base": "static-icon",
                "icon-type": "unknown",

              }
            },
            "id": "10029"
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                "-117.2265353",
                "32.72894288"
              ]
            },
            "properties": {
              "title": "Nimitz Bl & Rosecrans St",
              "marker-icon": {
                "icon-base": "static-icon",
                "icon-type": "warning",

              }
            },
            "id": "10031"
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                "-117.22584945",
                "32.80091313"
              ]
            },
            "properties": {
              "title": "Grand Av & Culver St",
              "marker-icon": {
                "icon-base": "static-icon",
                "icon-type": "info",

              }
            },
            "id": "10032"
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                "-117.22407745",
                "32.75340225"
              ]
            },
            "properties": {
              "title": "West Point Loma Bl & Loma Riviera Dr",
              "marker-icon": {
                "icon-base": "static-icon",
                "icon-type": "unknown",

              }
            },
            "id": "10033"
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                "-117.22518324",
                "32.86829317"
              ]
            },
            "properties": {
              "title": "Nobel Dr & Lebon Dr",
              "marker-icon": {
                "icon-base": "static-icon",
                "icon-type": "unknown",

              }
            },
            "id": "10034"
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                "-117.22121375",
                "32.805504"
              ]
            },
            "properties": {
              "title": "Garnet Av & Bond St",
              "marker-icon": {
                "icon-base": "static-icon",
                "icon-type": "warning",

              }
            },
            "id": "10036"
          }
        ]
      }
    },

    parentComponent: {
      value: ['<div style="height:400px; width:600px; display:flex"><px-map fit-to-markers flex-to-size disable-scroll-zoom disable-touch-zoom>', '</px-map></div>']
    },

    siblingElement: {
      value: "<px-map-tile-layer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'></px-map-tile-layer>"
    }
  }
});
