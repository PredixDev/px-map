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
import '../px-map-marker-static.js';
import '../px-map-popup-data.js';
Polymer({
  _template: Polymer.html`
  <!-- Header -->
  <px-demo-header module-name="px-map-popup-data" parent-name="px-map" description="The px-map-popup-data subcomponent displays a popup box with
      some data on a given marker when that marker is clicked." mobile="" tablet="" desktop="">
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
        <px-map zoom="12" flex-to-size="" fit-to-markers="" disable-scroll-zoom="" disable-touch-zoom="" attribution-prefix="<a href=&quot;http://leafletjs.com&quot; title=&quot;A JS library for interactive maps&quot;>Leaflet</a> | © <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap contributors</a>">
          <px-map-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></px-map-tile-layer>
          <px-map-marker-static lat="37.7673626" lng="-121.9595048" type="info">
            <px-map-popup-data min-width="{{props.minWidth.value}}" max-width="{{props.maxWidth.value}}" title="{{props.title.value}}" data="{{props.data.value}}">
            </px-map-popup-data>
          </px-map-marker-static>
        </px-map>
      </div>
    </px-demo-component>
    <!-- END Component ------------------------------------------------------>

    <px-demo-component-snippet slot="px-demo-component-snippet" element-properties="{{props}}" element-name="px-map-popup-data" links-includes="[&quot;px-map/px-map.html&quot;,&quot;px-map/px-map-tile-layer.html&quot;,&quot;px-map/px-map-popup-data.html&quot;,&quot;px-map/px-map-marker-static.html&quot;]">
    </px-demo-component-snippet>
  </px-demo-interactive>

  <!-- API Viewer -->
  <px-demo-api-viewer source="px-map-popup-data" api-source-file-path="px-map/px-map-api.json" mark-private="[[apiMarkPrivate]]">
  </px-demo-api-viewer>

  <!-- Footer -->
  <px-demo-footer></px-demo-footer>
`,

  is: 'px-map-popup-data-demo',

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
    title: {
      type: String,
      defaultValue: 'GE Digital',
      inputType: 'text'
    },

    data: {
      type: Object,
      defaultValue: { "Employees" : "2000", "Parking" : "Yes", "Snacks" : "Yes", "Gym" : "No" },
      inputType: 'code:JSON'
    },

    minWidth: {
      inputLabel: 'Minimum width (in px)',
      type: Number,
      defaultValue: 350,
      inputType: 'number'
    },

    maxWidth: {
      inputLabel: 'Maximum width (in px)',
      type: Number,
      defaultValue: 500,
      inputType: 'number'
    },

    parentComponent: {
      value: ['<div style="height:400px; width:600px; display:flex"><px-map zoom="12" flex-to-size fit-to-markers disable-scroll-zoom disable-touch-zoom><px-map-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></px-map-tile-layer><px-map-marker-static lat="37.7673626" lng="-121.9595048" type="info">', '</px-map-marker-static></px-map>']
    }
  }
});
