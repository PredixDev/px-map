(function() {
  'use strict';

  class PxMapRootComponent {
    beforeRegister() {
      this.is = 'px-map';
      this.properties = {
        /**
         * The active map instance. Currently, the only mapping base library offered
         * is Leaflet, so this will be a reference to the `L.map` that is displaying
         * all the relevant map data.
         *
         * This is exposed as a framework-level building block to allow binding of the
         * map instance to other elements that call methods on it. Do not call methods
         * directly on the map instance. Use the web component APIs provided by
         * `px-map` and its subcomponents to manipulate the map. If you call methods
         * directly on this instance, your data model may become out-of-sync.
         *
         * This map instance will need to be passed down to subcomponents so they
         * can draw themselves on the map. Use declarative data binding to pass it.
         * For example:
         *
         * ```
         * <px-map map-instance="{{map}}">
         *   <px-map-overlay-layer map-instance="{{map}}"></px-map-overlay-layer>
         * </px-map>
         * ```
         *
         * You can also use the `DistributeProperties` behavior to automatically
         * distribute the map instance to all light DOM children as they are added,
         * and keep the map instance up-to-date.
         *
         * @type {Object}
         */
        elementInst: {
          type: Object,
          notify: true,
          readOnly: true
        },

        // ---------------------------------------------------------------------
        // CONFIGURES THE VIEW SETTINGS FOR THE ACTIVE MAP
        // ---------------------------------------------------------------------

        /**
         * The Coordinate Reference System to use when drawing the map. Leave the
         * default if you're not sure what this means.
         *
         * @type {String}
         */
        crs: {
          type: String,
          value: 'L.CRS.EPSG3857',
          notify: true
        },

        /**
         * The latitude of the active map center. Can be used to set or update
         * the center of the map, or read from after the user moves the map to
         * get updated coordinates.
         *
         * @type {Number}
         */
        lat: {
          type: Number,
          value: 37.7672375,
          notify: true
        },

        /**
         * The longitude of the active map center. Can be used to set or update
         * the center of the map, or read from after the user moves the map to
         * get updated coordinates.
         *
         * @type {Number}
         */
        lng: {
          type: Number,
          value: -121.9584131,
          notify: true
        },

        /**
         * The zoom level of the active map. Can be used to set or update
         * the zoom level of the map, or read from after the user changes the
         * map zoom level to an updated value.
         *
         * @type {Number}
         */
        zoom: {
          type: Number,
          value: 10,
          notify: true,
          observer: '_updateMapView'
        },

        /**
         * The maximum zoom level for the active map. Will be applied to all
         * layers of the map.
         *
         * @type {Number}
         */
        maxZoom: {
          type: Number,
          value: 18
        },

        /**
         * The minimum zoom level for the active map. Will be applied to all
         * layers of the map.
         *
         * @type {Number}
         */
        minZoom: {
          type: Number,
        },

        /**
         * Restricts the view of the map to a given geographical boundary. The
         * user will be bounced back if they attempt to pan outside the view.
         * Disabled by default, letting the user pan to any point on the map.
         *
         * Pass an array of `<LatLng>` values like the following:
         *
         *        [40.712, -74.227], [40.774, -74.125]
         *
         * @type {Array}
         */
        bounds: {
          type: Array
        },

        // ---------------------------------------------------------------------
        // ENABLES FEATURES THAT CHANGE THE MAP BEHAVIOR
        // ---------------------------------------------------------------------

        /**
         * Automatically changes the visible bounds of the map to fit all
         * markers placed on it.
         *
         * @type {Object}
         */
        fitToMarkers: {
          type: Boolean,
          value: false,
          observer: '_fitMapToMarkers'
        },

        // ---------------------------------------------------------------------
        // TELL THE MAP HOW TO RESIZE
        // ---------------------------------------------------------------------

        /**
         * Uses flexbox to set the size of the map. Set the parent container
         * to use `display: flex;` in your CSS and the map will automatically
         * fill the container's available height and width.
         *
         * @type {Boolean}
         */
        flexToSize: {
          type: Boolean,
          reflectToAttribute: true,
          value: false
        }
      };
    }

    /* Behaviors to import for this component */
    get behaviors() {
      return this._behaviors || (this._behaviors = [PxMapBehavior.Layer, PxMapBehavior.ParentLayer]);
    }

    set behaviors(value) {
      this._behaviors = value;
    }

    attached() {
      window.requestAnimationFrame(this._drawMap.bind(this,0,10));

      if (this.fitToMarkers) {
        this.listen(this, 'px-map-marker-add', '_fitMapToMarkers');
        this.listen(this, 'px-map-marker-group-add', '_fitMapToMarkers');
      }
    }

    detached() {
      if (this.fitToMarkers) {
        this.unlisten(this, 'px-map-marker-add', '_fitMapToMarkers');
        this.listen(this, 'px-map-marker-group-add', '_fitMapToMarkers');
      }
    }

    /**
     * If the map is configured to fit itself to markers, iterates over all
     * layers to find marker and ensures they fit in the view.
     *
     * This functio will be called when:
     * 1. The `fitToMarkers` property is defined
     * 2. Any marker fires a 'px-map-marker-add' event that bubbles up to the map
     * 3. The map is first drawn
     */
    _fitMapToMarkers() {
      if (this.elementInst && this.fitToMarkers) {

        const fitFn = () => {
          const bounds = this._getAllMarkerGeoms();
          if (!bounds.isValid || !bounds.isValid()) return;
          this.elementInst.fitBounds(bounds);
        };

        this.debounce('fit-map-to-markers', fitFn, 1);
      }
    }

    /**
     * Iterates over all markers attached to the map and returns an array of
     * <L.LatLng> instances with the geometry.
     *
     * @return {Array}
     */
    _getAllMarkerGeoms() {
      // Create a new bounds and extend with the map center point
      let bounds = new L.LatLngBounds();
      // bounds.extend(L.latLng([this.lat, this.lng]));

      // Loop over the layers
      this.elementInst.eachLayer((layer) => {
        // Markers have a `layer.options.icon` set
        if (layer.options && layer.options.icon) {
          let markerGeom = layer.getLatLng();
          bounds.extend(markerGeom);
        }

        // Markers in a PruneCluster have a `layer.Cluster._markers` array with length
        if (layer._markerCluster && layer.getBounds) {
          let clusterBounds = layer.getBounds();
          bounds.extend(clusterBounds);
        }
      });
      return bounds;
    }

    /**
     * Attemps to draw the map, if it hasn't already been drawn. If the parent
     * has no height, throws it back into the stack to draw on the next
     * animation frame.
     */
    _drawMap(retries=0, maxRetries=10) {
      const x = this._drawX = this.parentElement.clientWidth;
      const y = this._drawY = this.parentElement.clientHeight;

      if (!x || !y) {
        // Try again, if there are any retries left
        if (retries < maxRetries) {
          window.requestAnimationFrame(this._drawMap.bind(this, (retries+1), maxRetries));
        }
        return;
      }

      // Try to find an initialized map instance. If there is none, create it.
      if (!this.elementInst) {
        const mapDrawEl = Polymer.dom(this.root).querySelector('#map');
        let map = L.map(mapDrawEl, {
          minZoom: this.minZoom,
          maxZoom: this.maxZoom,
          zoomControl: false
        });

        // @TODO: This is a shim for browsers without shadow DOM. We need to
        // re-append the `#map` element or it won't get the 'style-scope' CSS
        // classes needed to style it or its children. That's bad. When the
        // polyfill is updated or support is cut for browsers without shadow
        // DOM, this should be removed.
        // Polymer.dom(this.root).appendChild(mapDrawEl);
        this.scopeSubtree(this.$.map, true);

        // Attach to the read-only `elementInst`
        this._setElementInst(map);
        this.fire('px-map-layer-instance-created');

        // Bind map move listeners
        const mapMoveFn = this._handleMapMove.bind(this);
        this._mapMoveHandlerFn = map.on('moveend', mapMoveFn)
      }

      // Ensure a tile layer is applied to the map
      // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      //   attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
      //   maxZoom: 18
      // }).addTo(this.elementInst);

      // Set the view from current defaults
      this._updateMapView();

      // Try to fit to map markers if the `fitToMarkers` attribute was set
      this._fitMapToMarkers();
    }

    _handleMapMove() {
      let latLng = this.elementInst.getCenter();
      let zoom = this.elementInst.getZoom();

      this.fire('px-map-moved', {
        latLng: latLng,
        lat: latLng.lat,
        lng: latLng.lng,
        zoom: zoom
      });
    }

    /**
     * Called when the `lat`, `lng`, or `zoom` is set or updated. Sets the active
     * map center to the new values.
     */
    _updateMapView() {
      if (this.elementInst) {
        let updateFn = () => { this.elementInst.setView([this.lat, this.lng], this.zoom) };
        this.debounce('update-map-view', updateFn, 1);
      }
    }

    getVisibleMarkers() {
      const mapBounds = this.elementInst.getBounds();
      let markers = [];

      // Loop over the layers
      this.elementInst.eachLayer((layer) => {
        // Markers have a `layer.options.icon` set
        if (layer.options && layer.options.icon) {
          // Only push markers that are visible
          if (mapBounds.contains(layer.getLatLng())) {
            markers.push(layer);
          }
        }

        // Marker clusters have a `_markerCluster` key
        if (layer._markerCluster) {
          layer.eachLayer((marker) => {
            // Only push markers that are visible
            let parentCluster = layer.getVisibleParent(marker);
            if (parentCluster && mapBounds.contains(parentCluster.getLatLng())) {
              markers.push(marker);
            }
          })
        }
      });

      return markers;
    }

  }

  /* Register this element with the Polymer constructor */
  Polymer(PxMapRootComponent);
})()
