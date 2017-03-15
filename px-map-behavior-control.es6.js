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

})();
