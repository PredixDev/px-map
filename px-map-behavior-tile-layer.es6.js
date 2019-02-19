/**
 * @license
 * Copyright (c) 2018, General Electric
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function() {
  'use strict';

  /****************************************************************************
   * BEHAVIORS
   ****************************************************************************/

  /* Ensures the behavior namespace is created */
  window.PxMapBehavior = (window.PxMapBehavior || {});

  /**
   *
   * @polymerBehavior PxMapBehavior.TileLayer
   */
  PxMapBehavior.TileLayerImpl = {
    properties: {
      /**
       * A template string that will be converted into a URL used to call the tile
       * service. Should be in the following format:
       *
       *    `http://{s}.somedomain.com/blabla/{z}/{x}/{y}.png`
       *
       * The following values will be substituted for letters in `{}` brackets:
       *
       * - `{s}`: a subdomain to call to allow the browser to make many parallel requests
       * - `{z}`: the map zoom level
       * - `{x}` and `{y}`: the coordinates for the tile
       *
       * @type {String}
       */
      url: {
        type: String,
        observer: 'shouldUpdateInst'
      },

      /**
       * Forces the component to call decodeURI on the `url` attribute before
       * passing it to the tile service. Use this if your `url` is getting
       * encoded by the browser before requests are sent (this can happen if
       * you set the URL attribute with a string instead of data binding).
       *
       * @type {Boolean}
       */
      decodeUrl: {
        type: Boolean,
        value: false,
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

    canAddInst() {
      return (typeof this.url === 'string') && this.url.length;
    },

    createInst(options) {
      return L.tileLayer(options.url);
    },

    updateInst(lastOptions, nextOptions) {
      if (lastOptions.url !== nextOptions.url) {
        this.elementInst.setUrl(nextOptions.url);
      }
      if (lastOptions.opacity !== nextOptions.opacity) {
        this.elementInst.setOpacity(nextOptions.opacity);
      }
    },

    getInstOptions() {
      return {
        url: this.decodeUrl ? decodeURI(this.url) : this.url,
        opacity: this.opacity
      };
    }
  };
  /* Bind TileLayer behavior */
  /** @polymerBehavior */
  PxMapBehavior.TileLayer = [
    PxMapBehavior.Layer,
    PxMapBehavior.TileLayerImpl
  ];
})();
