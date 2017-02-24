(function(){
  'use strict';

  class PxMapLayerGroup {
    beforeRegister() {
      this.is = 'px-map-layer-group';
      this.properties = {};
    }

    get behaviors() {
      return this._behaviors || (this._behaviors = [window.PxMapBehavior.LayerGroup]);
    }

    set behaviors(value) {
      this._behaviors = value;
    }
  }

  /* Register this component with the Polymer constructor. */
  Polymer(PxMapLayerGroup);
})();