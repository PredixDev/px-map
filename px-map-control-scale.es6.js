(function(){
  'use strict';

  class PxMapScaleControlComponent {
    beforeRegister() {
      this.is = 'px-map-control-scale';
      this.properties = this.properties || {};
    }

    get behaviors() {
      return this._behaviors || (this._behaviors = [PxMapBehavior.ScaleControl]);
    }

    set behaviors(value) {
      this._behaviors = value;
    }
  }

  /* Register this component with the Polymer constructor. */
  Polymer(PxMapScaleControlComponent);
})();
