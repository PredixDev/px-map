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
   * @polymerBehavior PxMapBehavior.Popup
   */
  PxMapBehavior.PopupImpl = {
    properties: {
      /**
       * If set to `true`, the popup will be automatically closed when the user
       * interacts with any control buttons (e.g. zoom buttons or locate button).
       * By default, the popup only closes when the user clicks the map.
       */
      closeOnControlInteract: {
        type: Boolean,
        value: false
      },

      /**
       * Max width of popup container
       */
      maxWidth: {
        type: Number,
        value: 400,
        observer: 'shouldUpdateInst'
      },

      /**
       * Min width of popup container
       */
      minWidth: {
        type: Number,
        value: 300,
        observer: 'shouldUpdateInst'
      },

      /**
       * Programatically opens and closes the popup. Is updated when the popup
       * is opened by the user through DOM interaction.
       */
      opened: {
        type: Boolean,
        value: false,
        observer: 'shouldUpdateInst',
        notify: true
      }
    },

    addInst(parent) {
      if (parent && parent.getPopup && (parent.getPopup() !== this.elementInst)) {
        parent.bindPopup(this.elementInst);

        if (this.opened) {
          parent.openPopup();
        }

        // Bind custom events for this popup. Events will be unbound automatically.
        const controlClickFn = this._handleControlClick.bind(this, parent);
        this.bindEvents({
          'controlclick' : controlClickFn
        }, parent._mapToAdd);

        const popupOpenFn = this._handlePopupOpenChange.bind(this, true);
        const popupCloseFn = this._handlePopupOpenChange.bind(this, false);
        this.bindEvents({
          'popupopen' : popupOpenFn,
          'popupclose' : popupCloseFn
        }, parent);
      }
    },

    _handlePopupOpenChange(opened) {
      this.opened = opened;
    },

    removeInst(parent) {
      if (parent && parent.getPopup && (parent.getPopup() === this.elementInst)) {
        parent.unbindPopup(this.elementInst);
      }
    },

    updateInst(lastOptions, nextOptions) {
      if (lastOptions.opened !== nextOptions.opened) {
        if (nextOptions.opened && !this.elementInst.isOpen()) {
          this.elementInst._source.openPopup();
        } else if (!nextOptions.opened && this.elementInst.isOpen()) {
          this.elementInst._source.closePopup();
        }
      }
      if (nextOptions.minWidth !== lastOptions.minWidth || nextOptions.maxWidth !== lastOptions.maxWidth) {
        const minWidth = nextOptions.minWidth || lastOptions.minWidth;
        const maxWidth = nextOptions.maxWidth || lastOptions.maxWidth;
        
        this.elementInst.updateSettings({minWidth, maxWidth})
      }
    },

    getInstOptions() {
      return {
        opened: this.opened,
        minWidth: this.minWidth,
        maxWidth: this.maxWidth,
      };
    },

    _handleControlClick(parent) {
      if (this.closeOnControlInteract && parent && parent.closePopup) {
        parent.closePopup();
      }
    }
  };
  /* Bind Popup behavior */
  /** @polymerBehavior */
  PxMapBehavior.Popup = [
    PxMapBehavior.Layer,
    PxMapBehavior.PopupImpl
  ];

  /**
   *
   * @polymerBehavior PxMapBehavior.InfoPopup
   */
  PxMapBehavior.InfoPopupImpl = {
    properties: {
      /**
       * Title text to display in bold at the top of the popup. Should be kept
       * relatively short (25 characters or less) to keep the popup from
       * growing too large.
       *
       * @type {String}
       */
      title: {
        type: String,
        observer: 'shouldUpdateInst'
      },

      /**
       * Description text to place in the body of the popup. Try to keep the
       * description to a reasonable size to keep the popup from growing
       * too large.
       *
       * To display more information, bind to the popup's parent layer (e.g. a marker)
       * tapped event and display more information in the UI of your application.
       *
       * @type {String}
       */
      description: {
        type: String,
        observer: 'shouldUpdateInst'
      },

      /**
       * The URL for an image to be placed inside the popup. Use a small, square
       * thumbnail-style image (e.g. 75px by 75px). You may use any image type
       * that you would put in an html
       * <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img"
       * target="_blank">`<img>`</a> tag.
       *
       * @type {String}
       */
      imgSrc: {
        type: String,
        observer: 'shouldUpdateInst'
      }
    },

    createInst(options) {
      return new PxMap.InfoPopup(options);
    },

    updateInst(lastOptions, nextOptions) {
      PxMapBehavior.PopupImpl.updateInst.call(this, lastOptions, nextOptions);
      let updates = {};

      if (lastOptions.title !== nextOptions.title) {
        updates.title = nextOptions.title;
      }
      if (lastOptions.description !== nextOptions.description) {
        updates.description = nextOptions.description;
      }
      if (lastOptions.imgSrc !== nextOptions.imgSrc) {
        updates.imgSrc = nextOptions.imgSrc;
      }

      if (Object.keys(updates).length) {
        this.elementInst.updateSettings(updates);
      }
    },

    getInstOptions() {
      const opts = PxMapBehavior.PopupImpl.getInstOptions.call(this);
      return Object.assign({}, opts, {
        title: this.title,
        description: this.description,
        imgSrc: this.imgSrc,
        styleScope: this.isShadyScoped() ? this.getShadyScope() : undefined
      });
    }
  };
  /* Bind InfoPopup behavior */
  /** @polymerBehavior */
  PxMapBehavior.InfoPopup = [
    PxMapBehavior.Popup,
    PxMapBehavior.InfoPopupImpl
  ];

  /**
   *
   * @polymerBehavior PxMapBehavior.DataPopup
   */
  PxMapBehavior.DataPopupImpl = {
    properties: {
      /**
       * Title text to display in bold at the top of the popup. Should be kept
       * relatively short (25 characters or less) to keep the popup from
       * growing too large.
       */
      title: {
        type: String,
        observer: 'shouldUpdateInst'
      },

      /**
       * A list of key/value pairs to display in a data table. Must be in the
       * format of an object with human-readable keys and associated values.
       *
       * For example, to show the name and location of a place, set this
       * attribute to:
       * '{ "Name" : "Tokyo", "Location" : "Japan" }'
       *
       * @type {Object}
       */
      data: {
        type: Object,
        value: function() { return {}; },
        observer: 'shouldUpdateInst'
      }
    },

    canAddInst() {
      return this.data && typeof this.data === 'object' && Object.keys(this.data).length;
    },

    createInst(options) {
      return new PxMap.DataPopup(options);
    },

    updateInst(lastOptions, nextOptions) {
      PxMapBehavior.PopupImpl.updateInst.call(this, lastOptions, nextOptions);
      let updates = {};

      if (lastOptions.title !== nextOptions.title) {
        updates.title = nextOptions.title;
      }
      if (lastOptions.dataHash !== nextOptions.dataHash) {
        updates.data = nextOptions.data;
      }

      if (Object.keys(updates).length) {
        this.elementInst.updateSettings(updates);
      }
    },

    getInstOptions() {
      const opts = PxMapBehavior.PopupImpl.getInstOptions.call(this);
      let data = this._getValidData();
      return Object.assign({}, opts, {
        title: this.title,
        data: data,
        dataHash: JSON.stringify(data),
        styleScope: this.isShadyScoped() ? this.getShadyScope() : undefined
      });
    },

    _getValidData() {
      if (typeof this.data !== 'object') {
        console.log(`PX-MAP CONFIGURATION ERROR:
          You entered an invalid \`data\` attribute for ${this.is}. You must pass a valid object.
          An attribute of type \`${typeof this.data}\` was passed.`);

        return {};
      }

      return this.data;
    }
  };
  /* Bind DataPopup behavior */
  /** @polymerBehavior */
  PxMapBehavior.DataPopup = [
    PxMapBehavior.Popup,
    PxMapBehavior.DataPopupImpl
  ];

  /****************************************************************************
   * KLASSES
   ****************************************************************************/

  /* Ensures the klass namespace is created */
  window.PxMap = (window.PxMap || {});

  /**
   *
   * @class PxMap.InfoPopup
   */
  class InfoPopup extends L.Popup {
    constructor(settings={}) {
      super();
      this._createPopup(settings);
      return this;
    }

    onAdd(map) {
      if (map.__addShadyScope && !Polymer.Element) {
        // We need to monkey patch the node returned by `getPane().appendChild`
        // so we can ensure that we apply the right CSS scope if we are in
        // shady DOM. By doing this, we effectively wrap the node (which is
        // fetched in the L.DivOverlay.onAdd method) in a function that scopes
        // the child nodes before they are added to the map. If we don't do this,
        // Leaflet will measure the popup before its CSS classes are applied and
        // pan the map far too much to fit it. This is lame. :(
        // @TODO: Remove when shady DOM support is deprecated
        var srcPane = this.getPane();
        var srcFn = srcPane.appendChild;
        srcPane.appendChild = function(el) {
          map.__addShadyScope(el, false);
          let d = Polymer.dom(srcPane);
          d.appendChild(el);
        }
      }

      L.Popup.prototype.onAdd.call(this, map);

      if (map.__addShadyScope && !Polymer.Element) {
        // Restore monkey patched function
        srcPane.appendChild = srcFn;
      }
    }

    _updateContent() {
      if (this._map && this._map.__addShadyScope && this._content.length) {
        // We need to monkey patch the srcNode's `innerHTML` setter to ensure
        // that our popup is scoped before it is drawn if we are in shady DOM.
        // If we don't do this, Leaflet will measure the popup before its CSS
        // classes are applied and pan the map far too much to fit it.
        // This is also lame. :(
        // @TODO: Remove when shady DOM support is deprecated
        var srcNode = this._contentNode;
        var fakeNode = {
          innerHTML: null
        };
        this._contentNode = fakeNode;
      }

      L.DivOverlay.prototype._updateContent.call(this);

      if (this._map && this._map.__addShadyScope && this._content.length) {
        if (typeof fakeNode.innerHTML === 'string') {
          Polymer.dom(srcNode).innerHTML = fakeNode.innerHTML;
        }
        // Restore monkey patched function
        this._contentNode = srcNode;
      }
    }

    // Note `createPopup` is an internet explorer native method, but deprecated
    // so hopefully it won't cause grief
    _createPopup({title = null,
                  description = null,
                  imgSrc = null,
                  styleScope = null,
                  minWidth = PxMapBehavior.PopupImpl.properties.minWidth.value,
                  maxWidth = PxMapBehavior.PopupImpl.properties.maxWidth.value}={}) {
      // Assign settings and create content
      this.settings = { title, description, imgSrc, styleScope, minWidth, maxWidth };
      const content = this._generatePopupContent(title, description, imgSrc);
      const className = `map-popup-info ${styleScope||''}`

      this.initialize({ className, maxWidth, minWidth });
      this.setContent(content);
    }

    _generatePopupContent(title, description, imgSrc) {
      let tmplFnIf = (fn, ...vals) =>
        vals.length && vals[0] != null ? fn.call(this, ...vals) : '';

      let imgTmpl = (imgSrc) => `
        <div class="map-box-info__image">
          <img src="${imgSrc}" />
        </div>
      `;
      let titleTmpl = (title) => `
        <p class="map-box-info__title">${title}</p>
      `;
      let descriptionTmpl = (description) => `
        <p class="map-box-info__description">${description}</p>
      `;

      return `
        <section class="map-box-info">
          ${tmplFnIf(imgTmpl, imgSrc)}
          <div class="map-box-info__content">
            ${tmplFnIf(titleTmpl, title)}
            ${tmplFnIf(descriptionTmpl, description)}
          </div>
        </section>
      `;
    }

    updateSettings(settings={}) {
      Object.assign(this.settings, settings);
      const { title, description, imgSrc, minWidth, maxWidth } = this.settings;
      Object.assign(this.options, { minWidth, maxWidth });
      const content = this._generatePopupContent(title, description, imgSrc);

      this.setContent(content);
      this.update();
    }
  };
  /* Bind InfoPopup klass */
  PxMap.InfoPopup = InfoPopup;

  /**
   *
   * @class PxMap.DataPopup
   */
  class DataPopup extends L.Popup {
    constructor(settings={}) {
      super();
      this._createPopup(settings);
      return this;
    }

    onAdd(map) {
      // Don't open empty data popups
      if (typeof this.settings.data !== 'object' || Object.keys(this.settings.data).length === 0) {
        return;
      }

      if (map.__addShadyScope && !Polymer.Element) {
        // We need to monkey patch the node returned by `getPane().appendChild`
        // so we can ensure that we apply the right CSS scope if we are in
        // shady DOM. By doing this, we effectively wrap the node (which is
        // fetched in the L.DivOverlay.onAdd method) in a function that scopes
        // the child nodes before they are added to the map. If we don't do this,
        // Leaflet will measure the popup before its CSS classes are applied and
        // pan the map far too much to fit it. This is lame. :(
        // @TODO: Remove when shady DOM support is deprecated
        var srcPane = this.getPane();
        var srcFn = srcPane.appendChild;
        srcPane.appendChild = function(el) {
          map.__addShadyScope(el, false);
          Polymer.dom(srcPane).appendChild(el);
        }
      }

      L.Popup.prototype.onAdd.call(this, map);

      if (map.__addShadyScope && !Polymer.Element) {
        // Restore monkey patched function
        srcPane.appendChild = srcFn;
      }
    }

    _updateContent() {
      if (this._map && this._map.__addShadyScope && this._content.length) {
        // We need to monkey patch the srcNode's `innerHTML` setter to ensure
        // that our popup is scoped before it is drawn if we are in shady DOM.
        // If we don't do this, Leaflet will measure the popup before its CSS
        // classes are applied and pan the map far too much to fit it.
        // This is also lame. :(
        // @TODO: Remove when shady DOM support is deprecated
        var srcNode = this._contentNode;
        var fakeNode = {
          innerHTML: null
        };
        this._contentNode = fakeNode;
      }

      L.DivOverlay.prototype._updateContent.call(this);

      if (this._map && this._map.__addShadyScope && this._content.length) {
        if (typeof fakeNode.innerHTML === 'string') {
          Polymer.dom(srcNode).innerHTML = fakeNode.innerHTML;
        }
        // Restore monkey patched function
        this._contentNode = srcNode;
      }
    }

    // Note `createPopup` is an internet explorer native method, but deprecated
    // so hopefully it won't cause grief
    _createPopup({title = null,
                  data = null,
                  styleScope = null,
                  minWidth = PxMapBehavior.PopupImpl.properties.minWidth.value,
                  maxWidth = PxMapBehavior.PopupImpl.properties.maxWidth.value}={}) {
      // Merge defaults into settings param
      this.settings = { title, data, styleScope, minWidth, maxWidth };
      const content = this._generatePopupContent(title, data);

      const className = `map-popup-data ${styleScope||''}`

      this.initialize({ className, maxWidth, minWidth });
      this.setContent(content);
    }

    _generatePopupContent(title, data) {
      let tmplFnIf = (fn, ...vals) =>
        vals.length && vals[0] != null ? fn.call(this, ...vals) : '';

      let titleTmpl = (title) => `
        <div class="map-data-box__header">
          <h3 class="map-data-box__header__text">${title}</h3>
        </div>
      `;
      let dataTmpl = (data) => {
        let dataList = Object.keys(data).reduce((accum, key) => {
          return accum.concat([dataItemTmpl(key, data[key])]);
        }, []).join('');

        return `
          <div class="map-data-box__table">
            ${dataList}
          </div>
        `;
      };
      let dataItemTmpl = (label, value) => `
        <div class="map-data-box__table__cell"><p>${label}</p></div>
        <div class="map-data-box__table__cell"><p>${value}</p></div>
      `;

      return `
        <section class="map-box-data">
          ${tmplFnIf(titleTmpl, title)}
          ${tmplFnIf(dataTmpl, data)}
        </section>
      `;
    }

    updateSettings(settings={}) {
      Object.assign(this.settings, settings);
      const { title, data, minWidth, maxWidth } = this.settings;
      Object.assign(this.options, { minWidth, maxWidth });
      const content = this._generatePopupContent(title, data);

      if (this.isOpen() && Object.keys(data).length === 0) {
        this._close();
      }

      this.setContent(content);
      this.update();
    }
  };
  /* Bind DataPopup klass */
  PxMap.DataPopup = DataPopup;
})();
