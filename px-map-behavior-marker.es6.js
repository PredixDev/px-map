(function() {
  'use strict';

  /****************************************************************************
   * BEHAVIORS
   ****************************************************************************/

  /* Ensures the behavior namespace is created */
  const namespace = (window.PxMapBehavior = window.PxMapBehavior || {});

  /**
   *
   * @polymerBehavior PxMapBehavior.Marker
   */
  const MarkerImpl = {
    properties: {
      /**
       * The latitude of the marker. Set a value to draw the marker at a coordinate
       * when the map is loaded. Listen for updates to track the marker's location
       * if the marker is draggable or created dynamically by the user.
       *
       * @type {Number}
       */
      lat: {
        type: Number,
        notify: true,
        observer: 'shouldUpdateInst'
      },

      /**
       * The longitude of the marker. Set a value to draw the marker at a coordinate
       * when the map is loaded. Listen for updates to track the marker's location
       * if the marker is draggable or created dynamically by the user.
       *
       * @type {Number}
       */
      lng: {
        type: Number,
        notify: true,
        observer: 'shouldUpdateInst'
      },

      /**
       * A human-readable name for this layer group. If a tooltip is attached,
       * this name will be shown on hover over the marker. If the map has a layer
       * control panel, the user will click this name to show, hide, or
       * manipulate this layer.
       *
       * @type {String}
       */
      name: {
        type: String,
        notify: true,
        observer: 'shouldUpdateInst'
      }
    },

    // DEFAULT METHODS FOR EVERY BASE ELEMENT...

    canAddInst() {
      return (typeof this.lat === 'number') && (typeof this.lng === 'number');
    },

    createInst(options) {
      return L.marker(options.geometry, options.config);
    },

    updateInst(lastOptions, nextOptions) {
      if (lastOptions.geometry !== nextOptions.geometry) {
        this.elementInst.setLatLng(nextOptions.geometry);
      }
      if (lastOptions.config.icon !== nextOptions.config.icon) {
        this.elementInst.setIcon(nextOptions.config.icon);
      }
    },

    getInstOptions() {
      const geometry = this.getMarkerLatLng();
      const config = {};
      config.title = (this.name || '');
      config.icon = this.getMarkerIcon();

      return { geometry, config };
    },

    // CUSTOM METHODS FOR MARKERS...

    getMarkerLatLng() {
      if (!this.lat || !this.lng) return [];
      return L.latLng(this.lat, this.lng);
    },

    // SHOULD BE IMPLEMENTED WHEN EXTENDING...

    getMarkerIcon() {
      throw new Error('The `getMarkerIcon` method must be implemented.');
    }
  };
  /* Bind Marker behavior */
  namespace.Marker = [
    namespace.Layer,
    namespace.ParentLayer,
    MarkerImpl
  ];

  /**
   *
   * @polymerBehavior PxMapBehavior.StaticMarker
   */
  const StaticMarkerImpl = {
    properties: {
      /**
       * The visual type of the marker. Sets the color of the marker to indicate
       * the state of the thing it represents. Choose from 'important', 'warning',
       * or 'info', or 'unknown'. Defaults to 'info'.
       *
       * @type {String}
       */
      type: {
        type: String,
        reflectToAttribute: true,
        value: 'info',
        observer: '_updateMarkerIcon'
      },

      /**
       * Shows a small notification badge on the icon that indicates there is
       * some relevant updated information about the marker.
       *
       * @type {Object}
       */
      showBadge: {
        type: Boolean,
        value: true,
        observer: '_updateMarkerIcon'
      }
    },

    getMarkerIcon() {
      if (!this.markerIcon) {
        const options = this._getMarkerIconOptions();
        this.markerIcon = new PxMap.StaticIcon(options);
      }
      return this.markerIcon;
    },

    _updateMarkerIcon() {
      if (!this.markerIcon) return;

      const options = this._getMarkerIconOptions();
      this.markerIcon = new PxMap.StaticIcon(options);

      this.shouldUpdateInst();
    },

    _getMarkerIconOptions() {
      return {
        type: this.type || '',
        badge: this.showBadge || false
      };
    }
  };
  /* Bind StaticMarker behavior */
  namespace.StaticMarker = [
    namespace.Marker,
    StaticMarkerImpl
  ];

})()
