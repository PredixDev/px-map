(function() {
  'use strict';

  /****************************************************************************
   * BEHAVIORS
   ****************************************************************************/

  /* Ensures the behavior namespace is created */
  const namespace = (window.PxMapBehavior = window.PxMapBehavior || {});

  /**
   *
   * @polymerBehavior PxMapBehavior.MarkerGroup
   */
  const MarkerGroupImpl = {
    properties: {
      /**
       * A human-readable name for this layer group. If the map has a layer
       * control panel, the user will click this name to show, hide, or
       * manipulate this layer.
       *
       * @type {String}
       */
      name: {
        type: String,
        notify: true
      },

      /**
       * A GeoJSON FeatureCollection object containing an array of Features with
       * point data that will be represented as a marker.
       *
       * @type {Object}
       */
      data: {
        type: Object,
        observer: 'shouldUpdateInst'
      },

      /**
       * An object mapping categories of icons to their respective colors. Each
       * key should be a string representing the name of an `icon-type` to
       * a valid CSS color value (e.g. hex color, `rgb()` color). Set the
       * `icon-type` as a sub-property of `properties.marker-icon` for each marker
       * feature in the FeatureCollection you pass into the `data` attribute.
       *
       * By default, the available types are:
       * - "unknown" : "--px-map-marker-group-unknown-color" (default: gray)
       * - "info" : "--px-map-marker-group-info-color" (default: blue)
       * - "warning" : "--px-map-marker-group-info-color" (default: yellow)
       * - "important" : "--px-map-marker-group-info-color" (default: red)
       *
       * Example #1 - FeatureCollection for `data`:
       *
       * ```
       * {
       *   "type" : "FeatureCollection",
       *   "features" : [
       *     {
       *       "type": "Feature",
       *       "id": "001",
       *       "geometry": { ... },
       *       "properties": {
       *         "marker-icon": {
       *           "icon-base": "StaticIcon",
       *           "icon-type": "info"
       *         }
       *       }
       *     },
       *     {
       *       "type": "Feature",
       *       "id": "002",
       *       "geometry": { ... },
       *       "properties": {
       *         "marker-icon": {
       *           "icon-base": "StaticIcon",
       *           "icon-type": "warning"
       *         }
       *       }
       *     }
       *   ]
       * }
       * ```
       *
       * Example #1 - `colorsByType` object
       *
       * ```
       * {
       *   "info" : "blue",
       *   "warning" : "red"
       * }
       * ```
       *
       * The default `colorsByType` mapping is:
       */
      colorsByType: {
        type: Object,
        value: function(){
          return {
            "unknown" : this.getComputedStyleValue('--px-map-marker-group-unknown-color'),
            "info" : this.getComputedStyleValue('--px-map-marker-group-info-color'),
            "warning" : this.getComputedStyleValue('--px-map-marker-group-warning-color'),
            "important" : this.getComputedStyleValue('--px-map-marker-group-important-color')
          }
        }
      },

      iconFns: {
        type: Object,
        value: function(){
          return {
            cluster: undefined,
            marker: undefined
          }
        }
      },

      clusterConfig: {
        type: Object
      }
    },

    addInst(parent) {
      PxMapBehavior.LayerImpl.addInst.call(this, parent);

      // Bind custom events for this cluster. Events will be unbound automatically.
      const spiderifyFn = this._handleClusterSpiderify.bind(this);
      const unspiderifyFn = this._handleClusterUnspiderify.bind(this);
      this.bindEvents({
        'spiderfied' : spiderifyFn,
        'unspiderfied' : unspiderifyFn
      });
    },

    removeInst(parent) {
      PxMapBehavior.LayerImpl.removeInst.call(this, parent);
    },

    createInst(options={}) {
      const cluster = L.markerClusterGroup(options);

      if (options.data && options.data.features && options.data.features.length) {
        this._syncDataWithMarkers(options.data.features, cluster);
      }

      return cluster;
    },

    updateInst(lastOptions, nextOptions) {
      if (nextOptions.data && nextOptions.data.features && nextOptions.data.features.length) {
        this._syncDataWithMarkers(nextOptions.data.features, this.elementInst);
        this.fire('px-map-marker-group-add');
      }
    },

    getInstOptions() {
      // Set the default cluster options
      const defaultOptions = {
        showCoverageOnHover: true,
        maxClusterRadius: 150,
        spiderifyOnMaxZoom: true,
        removeOutsideVisibleBounds: true,
        animate: true,
        polygonOptions: {
          stroke: true,
          color: this.getComputedStyleValue('--px-map-marker-group-cluster-polygon-stroke-color'),
          fillColor: this.getComputedStyleValue('--px-map-marker-group-cluster-polygon-fill-color'),
          fillOpacity: 0.4
        }
      };
      // Overwrite with any developer-provided cluster options in `clusterConfig`
      const options = Object.assign(defaultOptions, (this.clusterConfig || {}));
      // Assign the `data` and `iconCreateFunction` options. These cannot be
      // configured through the `clusterConfig` attribture
      options.data = this.data;
      options.iconCreateFunction = this._createClusterIcon.bind(this);
      // Return the options composed together
      return options;
    },

    _createClusterIcon(cluster) {
      // If the developer supplies a `iconFns.cluster` function, pass the options
      // to that function and return the result.
      if (this.iconFns.cluster) {
        return this.iconFns.cluster.call(this, cluster);
      }

      // Otherwise, build the marker ourselves
      const markers = cluster.getAllChildMarkers();
      const count = markers.length;

      // Count markers and group by type
      const types = this._indexClusterMarkersByType(markers);
      // Get the colors for each type
      const colors = this.colorsByType;

      // Get the container size for this count
      const containerSize = this._getClusterIconSize(count);
      // Get the path (chart stroke width) and border width for this chart
      const pathSize = this._getStyleValueAsNum('--px-map-marker-group-cluster-path-size') || 10;
      const borderSize = this._getStyleValueAsNum('--px-map-marker-group-cluster-border-size') || 0;

      // Set up the options to send into ClusterIcon
      const options = {
        count: count,
        countByType: types,
        colorsByType: colors,
        containerSize: containerSize,
        pathSize: pathSize,
        borderSize: borderSize
      };

      return new PxMap.ClusterIcon(options);
    },

    _getStyleValueAsNum(styleValName) {
      // Try to get from the "cache"
      this.__styleVals = (this.__styleVals || {});
      if (this.__styleVals[styleValName]) return this.__styleVals[styleValName];

      const computedVal = this.getComputedStyleValue(styleValName);

      if (computedVal && computedVal.indexOf('px') !== -1) {
        const valWithoutSuffix = computedVal.replace('px','');
        const valAsNum = Math.floor(valWithoutSuffix);
        this.__styleVals[styleValName] = valAsNum;
        return valAsNum;
      } else {
        return undefined;
      }
    },

    _getClusterIconSize(count) {
      // for count 1-9, size is small
      if (count < 10) {
        return 60;
      }
      // for count 10-39, size is medium
      if ((count >= 10) && (count < 40)) {
        return 75;
      }
      // for count 40+, size is large
      if (count > 40) {
        return 90;
      }
    },

    /**
     * Takes a group of marker instances and returns an object with keys of the
     * marker types in the group and values with the number of markers in
     * each group.
     *
     * @param {Array} markers - Array of marker instances
     * @return {Object}
     */
    _indexClusterMarkersByType(markers) {
      return markers.reduce((types, marker) => {
        if (marker.featureProperties && marker.featureProperties['marker-icon'] && marker.featureProperties['marker-icon']['icon-type']) {
          types[marker.featureProperties['marker-icon']['icon-type']] = (types[marker.featureProperties['marker-icon']['icon-type']] || 0) + 1;
        }
        return types;
      }, {});
    },

    _syncDataWithMarkers(newFeatures, clusterInst) {
      if (!newFeatures.length) return;

      const featuresSet = this._features = (this._features || new Set());
      const markersMap = this._markers = (this._markers || new WeakMap());

      const {featuresToAdd, featuresToUpdate, featuresToRemove, nextFeaturesSet, nextMarkersMap} = this._diffNewFeatures(newFeatures, featuresSet, markersMap);

      let feature, cachedMarker, markersToOperate;

      if (featuresToAdd.size) {
        markersToOperate = [];
        for (feature of featuresToAdd) {
          cachedMarker = nextMarkersMap.get(feature);
          cachedMarker.marker = this._createMarker(feature);
          markersToOperate.push(cachedMarker.marker);
          nextMarkersMap.set(feature, cachedMarker);
        }
        clusterInst.addLayers(markersToOperate);
        markersToOperate = null;
      }

      if (featuresToUpdate.size) {
        markersToOperate = [];
        for (feature of featuresToUpdate) {
          cachedMarker = nextMarkersMap.get(feature);
          cachedMarker.marker = this._updateMarker(cachedMarker.marker);
          markersToOperate.push(cachedMarker.marker);
          nextMarkersMap.set(feature, cachedMarker);
        }
        clusterInst.refreshClusters(markersToOperate);
        markersToOperate = null;
      }

      if (featuresToRemove.size) {
        markersToOperate = [];
        for (feature of featuresToRemove) {
          cachedMarker = nextMarkersMap.get(feature);
          this._removeMarker(cachedMarker.marker);
          markersToOperate.push(cachedMarker.marker);
          nextMarkersMap.delete(feature);
        }
        clusterInst.removeLayers(markersToOperate);
        markersToOperate = null;
      }

      this._features = nextFeaturesSet;
      this._markers = nextMarkersMap;
      featuresSet.clear()

      featuresToAdd.clear();
      featuresToUpdate.clear();
      featuresToRemove.clear();
    },

    _diffNewFeatures(newFeatures, lastFeatureSet, markerMap) {
      // Keep track of our new feature set, which will replace `featureSet`
      const nextFeaturesSet = new Set();

      // Keep track of markers to add
      const featuresToAdd = new Set();
      const featuresToUpdate = new Set();

      // Placeholders for our loop
      let i, len, valid, known, cachedMarker, featureHash;

      // Loop over features to add unknown features to the cluster or update known features if necessary
      for (i=0, len=newFeatures.length; i<len; i++) {
        // If these tests aren't met, the feature is invalid and can't be drawn as a marker
        // Any invalid markers won't be visited and will be removed
        valid = ((newFeatures[i].id) && (newFeatures[i].geometry && newFeatures[i].geometry.type === 'Point') && (newFeatures[i].geometry.coordinates instanceof Array && newFeatures[i].geometry.coordinates.length === 2));
        if (!valid) continue;

        // Determine if this feature is already represented in the cluster
        known = lastFeatureSet.has(newFeatures[i]);

        // This is a valid feature we don't know, create a marker for this feature and add it.
        if (!known) {
          // Mark this as a marker to add
          featuresToAdd.add(newFeatures[i]);
          // Remove from last feature set and add to next feature set
          lastFeatureSet.delete(newFeatures[i]);
          nextFeaturesSet.add(newFeatures[i]);
          // Build a new cached marker object with a hash of the feature
          cachedMarker = { marker: null, hash: JSON.stringify(newFeatures[i]) };
          markerMap.set(newFeatures[i], cachedMarker);
          // Skip to next loop iteration
          continue;
        }

        // We know this feature and have a marker for it. Ensure the marker is up-to-date.
        if (known) {
          cachedMarker = markerMap.get(newFeatures[i]);
          featureHash = JSON.stringify(newFeatures[i]);
          // If there's a difference, mark this marker as one to update
          if (cachedMarker.hash !== featureHash) {
            featuresToUpdate.add(newFeatures[i]);
            // Update the cached marker object with the new hash of the feature
            cachedMarker.hash = featureHash;
            markerMap.set(newFeatures[i], cachedMarker);
          }
          // Remove from last feature set and add to next feature set
          lastFeatureSet.delete(newFeatures[i]);
          nextFeaturesSet.add(newFeatures[i]);
        }
      }

      // Any markers remaining in the last feature set need to be remove
      const featuresToRemove = lastFeatureSet.size ? lastFeatureSet : new Set();

      // Clear all references in the last feature set to ensure values can
      // be garbage collected
      lastFeatureSet.clear();
      lastFeatureSet = null;

      return {
        featuresToAdd: featuresToAdd,
        featuresToUpdate: featuresToUpdate,
        featuresToRemove: featuresToRemove,
        nextFeaturesSet: nextFeaturesSet,
        nextMarkersMap: markerMap
      };
    },

    _removeMarker(markerData, clusterInst){
      // debugger;
    },

    _createMarker(feature, clusterInst) {
      // Extract geometry (GeoJSON coordinate pairs are Lat/Lng, we need Lng/Lat,
      // so we have to reverse)
      const [lat, lng] = feature.geometry.coordinates;
      // Create a marker
      const marker = L.marker([lng, lat]);

      // If any icon settings were passed with the feature, fetch them to pass
      // to the icon constructor
      const iconSettings = (feature.properties['marker-icon']) ? this._extractMarkerIconSettings(feature.properties['marker-icon']) : {};
      const icon = this._createMarkerIcon(iconSettings);
      marker.setIcon(icon);

      // Attach the properties to the marker instance to read later
      marker.featureProperties = feature.properties;

      return marker;
    },

    _extractMarkerIconSettings(featSettings) {
      const featSettingsKeys = Object.keys(featSettings);
      if (!featSettingsKeys.length) return undefined;

      const iconSettings = {};
      let i, len, featKeyCamelized;

      for (i=0, len=featSettingsKeys.length; i<len; i++) {
        if (featSettingsKeys[i].substring(0,5) !== "icon-") continue;
        featKeyCamelized = featSettingsKeys[i].substring(5).replace(/(\-[a-z])/g, (match) => match.charAt(1).toUpperCase());
        iconSettings[featKeyCamelized] = featSettings[featSettingsKeys[i]];
      }

      return iconSettings;
    },

    _createMarkerIcon(options) {
      // If the developer supplies a `iconFns.marker` function, pass the options
      // to that function and return the result.
      if (this.iconFns.marker) {
        return this.iconFns.marker.call(this, options);
      }
      // Otherwise, attempt to convert the feature's 'icon-base' to a klass name
      // and call the constructor for that klass
      const klassName = options.base ? this._strToKlassName(options.base) : 'StaticIcon';
      return new PxMap[klassName](options);
    },

    _strToKlassName(str) {
      return str.charAt(0).toUpperCase() + str.substring(1).replace(/(\-[a-z])/g, (match) => match.charAt(1).toUpperCase());
    },

    /**
     * When the cluster is spiderified, set its visibility to hidden to ensure
     * it is not kept around as an opaque background to the markers.
     */
    _handleClusterSpiderify(evt) {
      const localEvt = Polymer.dom(evt);
      const node = localEvt.node;
      if (!node || !node.cluster || !node.cluster._icon) return;

      node.cluster._icon.style.visibility = 'hidden';
    },

    /**
     * When the cluster is unspiderified, set its visibility to visible to ensure
     * it is shown again on the map.
     */
    _handleClusterUnspiderify(evt) {
      const localEvt = Polymer.dom(evt);
      const node = localEvt.node;
      if (!node || !node.cluster || !node.cluster._icon) return;

      node.cluster._icon.style.visibility = 'visible';
    }
  };
  /* Bind MarkerGroup behavior */
  namespace.MarkerGroup = [
    namespace.Layer,
    MarkerGroupImpl
  ];

})();
