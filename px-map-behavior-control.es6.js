(function() {
  'use strict';

  /****************************************************************************
   * BEHAVIORS
   ****************************************************************************/

  /* Ensures the behavior namespace is created */
  const namespace = (window.PxMapBehavior = window.PxMapBehavior || {});

  /**
   *
   * @polymerBehavior PxMapBehavior.Control
   */
  const ControlImpl = {
    properties: {
      /**
       * Positions the control in one of the map corners. Choose from 'topright',
       * 'topleft', 'bottomright', or 'bottomleft'.
       *
       * @type {String}
       */
      position: {
        type: String,
        value: 'bottomright',
        observer: 'shouldUpdateInst'
      }
    },

    addInst(parent) {
      this.elementInst.addTo(parent);
    },

    removeInst(parent) {
      this.elementInst.remove();
    }
  };
  /* Bind Control behavior */
  namespace.Control = [
    namespace.Layer,
    ControlImpl
  ];

  /**
   *
   * @polymerBehavior PxMapBehavior.ZoomControl
   */
  const ZoomControlImpl = {
    properties: {
      /**
       * Sets the icon for zoom in button
       * This is not dynamic and can only be set at run time
       *
       * @type {String}
       */
      zoomInText: {
        type: String,
        value: '<i class="fa fa-plus"></i>',
      },

      /**
       * Sets the icon for zoom out button
       * This is not dynamic and can only be set at run time
       *
       * @type {String}
       */
      zoomOutText: {
        type: String,
        value: '<i class="fa fa-minus"></i>',
      }
    },

    createInst(options) {
      // return new PxMap.ZoomControl(options);
      return L.control.zoom(options);
    },

    updateInst(lastOptions, nextOptions) {
      if (lastOptions.position !== nextOptions.position) {
        this.elementInst.setPosition(nextOptions.position);
      }
    },

    getInstOptions() {
      return {
        position: this.position,
        zoomInText: this.zoomInText,
        zoomOutText: this.zoomOutText
      };
    }
  };
  /* Bind ZoomControl behavior */
  namespace.ZoomControl = [
    namespace.Control,
    ZoomControlImpl
  ];

  /**
   *
   * @polymerBehavior PxMapBehavior.ScaleControl
   */
  const ScaleControlImpl = {
    properties: {
      /**
       * Shows a imperial unit scale (ft/mi) line if enabled. Multiple unit scales
       * can be enabled to show multiple scales. If no units are enabled,
       * the scale cannot be drawn.
       *
       * @type {Boolean}
       */
      imperialUnits: {
        type: Boolean,
        value: false,
        observer: 'shouldUpdateInst'
      },

      /**
       * Shows a metric unit scale (m/km) line if enabled. Multiple unit scales
       * can be enabled to show multiple scales. If no units are enabled,
       * the scale cannot be drawn.
       *
       * @type {Boolean}
       */
      metricUnits: {
        type: Boolean,
        value: false,
        observer: 'shouldUpdateInst'
      },

      /**
       * Enable to reverse the the scale's colors, making it easier to read
       * against a dark tile layer.
       *
       * @type {Boolean}
       */
      reverseColors: {
        type: Boolean,
        value: false,
        observer: 'shouldUpdateInst'
      }
    },

    createInst(options) {
      return new PxMap.ScaleControl(options);
    },

    updateInst(lastOptions, nextOptions) {
      if (lastOptions.position !== nextOptions.position) {
        this.elementInst.setPosition(nextOptions.position);
      }
      if (lastOptions.reverseColors !== nextOptions.reverseColors) {
        this.elementInst.setReverseColors(nextOptions.reverseColors);
      }
      if (lastOptions.metric !== nextOptions.metric) {
        this.elementInst.showMetric(nextOptions.metric);
      }
      if (lastOptions.imperial !== nextOptions.imperial) {
        this.elementInst.showImperial(nextOptions.imperial);
      }
    },

    getInstOptions() {
      return {
        imperial: this.imperialUnits,
        metric: this.metricUnits,
        reverseColors: this.reverseColors,
        position: this.position
      };
    }
  };
  /* Bind ScaleControl behavior */
  namespace.ScaleControl = [
    namespace.Control,
    ScaleControlImpl
  ];

  /**
   *
   * @polymerBehavior PxMapBehavior.LocateControl
   */
  const LocateControlImpl = {
    properties: {
      /**
       * A string of HTML that will be used as the locate button text.
       *
       * @type {String}
       */
      locateText: {
        type: String,
        value: '<i class="fa fa-crosshairs"></i>',
        observer: 'shouldUpdateInst'
      },

      /**
       * A title for the locate text button. Will be used to inform users with
       * screen reading devices what the button does.
       *
       * @type {String}
       */
      locateTitle: {
        type: String,
        value: 'Zoom to your location',
        observer: 'shouldUpdateInst'
      },

      /**
       * If enabled, the map will set its view center to the user's current
       * location after a successful locate browser API call.
       *
       * @type {Boolean}
       */
      moveToLocation: {
        type: Boolean,
        value: false
      },

      /**
       * The maximum zoom level to set when the map moves to the user's location.
       * The `moveToLocation` attribute must be set for the map to move to
       * after a location event.
       *
       * @type {Number}
       */
      moveMaxZoom: {
        type: Number
      }
    },

    createInst(options) {
      return new PxMap.LocateControl(options);
    },

    updateInst(lastOptions, nextOptions) {
      if (lastOptions.position !== nextOptions.position) {
        this.elementInst.setPosition(nextOptions.position);
      }
    },

    getInstOptions() {
      return {
        position: this.position,
        locateText: this.locateText,
        locateTitle: this.locateTitle,
        moveToLocation: this.moveToLocation,
        moveMaxZoom: this.moveMaxZoom
      };
    }
  };
  /* Bind LocateControl behavior */
  namespace.LocateControl = [
    namespace.Control,
    LocateControlImpl
  ];

  /****************************************************************************
   * KLASSES
   ****************************************************************************/

  /* Ensures the klass namespace is created */
  const klass = (window.PxMap = window.PxMap || {});

  /**
   *
   * @class PxMap.ScaleControl
   */
  class ScaleControl extends L.Control.Scale {
    initialize(options) {
      super.initialize(options);
    }

    onAdd(map) {
      // Call default `onAdd` for scale to get the container
      this.__scaleContainer = super.onAdd(map);

      // Determine if we should add the reverse modifier CSS class
      if (this.options.reverseColors === true) {
        L.DomUtil.addClass(this.__scaleContainer, 'leaflet-control-scale--reverse');
      }

      return this.__scaleContainer;
    }

    onRemove(map) {
      super.onRemove(map);

      // Clean up scaleContainer reference
      this.__scaleContainer = null;
    }

    /**
     * Updates the `reverseColors` setting for the scale control. If the
     * `shouldReverse` param doesn't match the current classes on the
     * scale, updates the scale with the necessary classes.
     *
     * @param {Boolean} shouldReverse - If `true`, scale should be reversed. If `false`, it should not be.
     */
    setReverseColors(shouldReverse) {
      if (!this.__scaleContainer) return;

      if (shouldReverse && !this.options.reverseColors) {
        this.options.reverseColors = true;
        L.DomUtil.addClass(this.__scaleContainer, 'leaflet-control-scale--reverse');
      }

      if (!shouldReverse && this.options.reverseColors) {
        this.options.reverseColors = false;
        L.DomUtil.removeClass(this.__scaleContainer, 'leaflet-control-scale--reverse');
      }
    }

    /**
     * Shows or hides the imperial unit scale.
     *
     * @param {Boolean} shouldShowImperial - If `true`, ensures imperial unit scale is visible.
     */
    showImperial(shouldShowImperial) {
      if (!this.__scaleContainer) return;

      // No imperial scale exists, create one
      if (shouldShowImperial && !this.options.imperial && !this._iScale) {
        this._iScale = L.DomUtil.create('div', 'leaflet-control-scale-line', this.__scaleContainer);
        this.options.imperial = true;
      }

      // We should remove the existing imperial scale
      if (!shouldShowImperial && this.options.imperial && this._iScale) {
        this.options.imperial = false;
        L.DomUtil.remove(this._iScale);
        this._iScale = null;
      }

      // Update the scale
      this._update();
    }

    /**
     * Shows or hides the metric unit scale.
     *
     * @param {Boolean} shouldShowMetric - If `true`, ensures metric unit scale is visible.
     */
    showMetric(shouldShowMetric) {
      if (!this.__scaleContainer) return;

      // No metric scale exists, create one
      if (shouldShowMetric && !this.options.metric && !this._mScale) {
        this._mScale =  L.DomUtil.create('div', 'leaflet-control-scale-line', this.__scaleContainer);
        this.options.metric = true;
      }

      // We should remove the existing metric scale
      if (!shouldShowMetric && this.options.metric && this._mScale) {
        this.options.metric = false;
        L.DomUtil.remove(this._mScale);
        this._mScale = null;
      }

      // Update the scale
      this._update();
    }

  };
  /* Bind ScaleControl klass */
  klass.ScaleControl = ScaleControl;

  /**
   *
   * @class PxMap.LocateControl
   */
  class LocateControl extends L.Control {
    initialize(options={}) {
      const defaultOptions = {
        position: 'bottomright',
        className: '',
        locateText: '<i class="fa fa-crosshairs"></i>',
        locateTitle: 'Zoom to your location',
        locateProgressText: '<i class="px-map-spinner"></i>',
        locateErrorText: '<i class="fa fa-times"></i>',
        locateTimeout: 10000,
        moveToLocation: true,
        moveMaxZoom: null
      };
      const composedOptions = Object.assign(defaultOptions, options);
      L.Util.setOptions(this, composedOptions);
    }

    onAdd(map) {
      const locateName = 'leaflet-control-locate';
      this.__container = L.DomUtil.create('div', `${locateName} leaflet-bar ${this.options.className}`);
      this.__locateButton = this._createButton(this.options.locateText, this.options.locateTitle, 'leaflet-control-locate-button', this.__container);

      /* Bind map events */
      L.DomEvent.on(map, 'locationfound', L.DomEvent.stop);
      L.DomEvent.on(map, 'locationfound', this._locationFound, this);
      // map.on('locationfound', this._locationFound, this);
      L.DomEvent.on(map, 'locationerror', L.DomEvent.stop);
      L.DomEvent.on(map, 'locationerror', this._locationError, this);
      // map.on('locationerror', this._locationError, this);

      /* Bind button events */
      L.DomEvent.disableClickPropagation(this.__locateButton);
      L.DomEvent.on(this.__locateButton, 'click', L.DomEvent.stop);
      L.DomEvent.on(this.__locateButton, 'click', this.locate, this);
      L.DomEvent.on(this.__locateButton, 'click', this._refocusOnMap, this);

      return this.__container;
    }

    onRemove(map) {
      /* Unbind map events */
      map.off('locationfound', this._locationFound, this);
      map.off('locationerror', this._locationError, this);

      /* Unbind button events */
      L.DomEvent.off(this.__locateButton, 'click', L.DomEvent.stop);
      L.DomEvent.off(this.__locateButton, 'click', this.locate, this);
      L.DomEvent.off(this.__locateButton, 'click', this._refocusOnMap, this);
    }

    locate() {
      this.__locating = true;
      this._map.locate({
        setView: this.options.moveToLocation,
        maxZoom: this.options.moveMaxZoon,
        timeout: this.options.locateTimeout
      });
      this._setLocatingState();
    }

    reset() {
      this._setReadyState();
    }

    isDisabled() {
      return this.__disabled || false;
    }

    _createButton(html, title, className, container, clickFn) {
      const buttonEl = L.DomUtil.create('a', className, container);
      buttonEl.innerHTML = html;
      buttonEl.href = '#';
      buttonEl.title = title;

      // Tells screen readers to treat this as a button and read its title
      buttonEl.setAttribute('role', 'button');
      buttonEl.setAttribute('aria-label', title);

      return buttonEl;
    }

    _locationFound(evt) {
      if (this.__locating) {
        this.__locating = false;
        this._setReadyState();
      }
    }

    _locationError(evt) {
      if (this.__locating) {
        this.__locating = false;
        this._setErrorState();
      }
    }

    _setLocatingState() {
      if (!this.__locateButton || !this.__locating) return;

      this.__locateButton.innerHTML = this.options.locateProgressText;
      L.DomUtil.addClass(this.__locateButton, 'leaflet-control-locate-button--locating');

      this.__disabled = true;
      this._updateDisabled();
    }

    _setReadyState() {
      if (!this.__locateButton || this.__locating) return;

      this.__locateButton.innerHTML = this.options.locateText;
      L.DomUtil.removeClass(this.__locateButton, 'leaflet-control-locate-button--locating');
      L.DomUtil.removeClass(this.__locateButton, 'leaflet-control-locate-button--error');

      this.__disabled = false;
      this._updateDisabled();
    }

    _setErrorState() {
      if (!this.__locateButton || this.__locating) return;

      this.__locateButton.innerHTML = this.options.locateErrorText;
      L.DomUtil.removeClass(this.__locateButton, 'leaflet-control-locate-button--locating');
      L.DomUtil.addClass(this.__locateButton, 'leaflet-control-locate-button--error');

      this.__disabled = true;
      this._updateDisabled();
    }

    _updateDisabled() {
      if (!this.__locateButton) return;

      if (this.__disabled) {
        L.DomUtil.addClass(this.__locateButton, 'leaflet-control-locate-button--disabled');
      }
      if (!this.__disabled) {
        L.DomUtil.removeClass(this.__locateButton, 'leaflet-control-locate-button--disabled');
      }
    }
  };
  /* Bind LocateControl klass */
  klass.LocateControl = LocateControl;

})();
