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
import '../px-map.js';
import '../px-map-tile-layer.js';
import '../px-map-control-locate.js';
Polymer({
  _template: Polymer.html`
  <!-- Header -->
  <px-demo-header module-name="px-map-control-locate" parent-name="px-map" description="The px-map-control-locate subcomponent places a button on
      the map that the user can tap to detect and center the map on their
      current location." mobile="" tablet="" desktop="">
  </px-demo-header>

  <!-- Interactive -->
  <px-demo-interactive>
    <!-- Configs -->
    <px-demo-configs slot="px-demo-configs" configs="[[configs]]" props="{{props}}" chosen-config="{{chosenConfig}}"></px-demo-configs>

    <!-- Props -->
    <px-demo-props slot="px-demo-props" props="{{props}}" config="[[chosenConfig]]"></px-demo-props>

    <!-- Component ---------------------------------------------------------->
    <px-demo-component slot="px-demo-component">
      <div style="height:400px;width:600px;display:flex">
        <px-map flex-to-size="" disable-scroll-zoom="" disable-touch-zoom="" attribution-prefix="<a href=&quot;http://leafletjs.com&quot; title=&quot;A JS library for interactive maps&quot;>Leaflet</a> | © <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap contributors</a>">
          <px-map-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></px-map-tile-layer>
          <px-map-control-locate position="{{props.position.value}}" locate-title="{{props.locateTitle.value}}" move-max-zoom="{{props.moveMaxZoom.value}}" move-to-location="{{props.moveToLocation.value}}">
          </px-map-control-locate>
        </px-map>
      </div>
    </px-demo-component>
    <!-- END Component ------------------------------------------------------>

    <px-demo-component-snippet slot="px-demo-component-snippet" element-properties="{{props}}" element-name="px-map-control-locate" links-includes="[&quot;px-map/px-map.html&quot;,&quot;px-map/px-map-tile-layer.html&quot;,&quot;px-map/px-map-control-locate.html&quot;]">
    </px-demo-component-snippet>
  </px-demo-interactive>

  <!-- API Viewer -->
  <px-demo-api-viewer source="px-map-control-locate" api-source-file-path="px-map/px-map-api.json" mark-private="[[apiMarkPrivate]]">
  </px-demo-api-viewer>

  <!-- Footer -->
  <px-demo-footer></px-demo-footer>
`,

  is: 'px-map-control-locate-demo',

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
    position: {
      type: String,
      defaultValue: 'bottomright',
      inputType: 'dropdown',
      inputChoices: ['topleft', 'topright', 'bottomleft', 'bottomright']
    },

    locateTitle: {
      inputLabel: 'Button Title',
      type: String,
      defaultValue: 'Zoom to your location',
      inputType: 'text'
    },

    moveMaxZoom: {
      type: Number,
      defaultValue: 12,
      inputType: 'text'
    },

    moveToLocation: {
      type: Boolean,
      defaultValue: true,
      inputType: 'toggle'
    },

    parentComponent: {
      value: ['<div style="height:400px; width:600px; display:flex"><px-map flex-to-size disable-scroll-zoom disable-touch-zoom>', '</px-map></div>']
    },

    siblingElement: {
      value: '<px-map-tile-layer url=\'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png\'></px-map-tile-layer>'
    }
  }
});