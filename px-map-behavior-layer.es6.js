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
   *
   * @polymerBehavior PxMapBehavior.Layer
   */
  PxMapBehavior.LayerImpl = {
    // When this element is attached to the DOM, fire an event to notify
    // a parent that it is ready

    attached() {
      this.notifyInstReady(this.canAddInst());
    },

    // When this element is detached from the DOM, its elementInst should be
    // removed from the parent

    detached() {
      this.shouldRemoveInst();
    },

    // Extends the `Element` behavior lifecycle methods to include adding the
    // instance to its parent

    shouldAddInst(parentInst, parentEl) {
      PxMapBehavior.ElementImpl.shouldAddInst.call(this, parentInst);

      if (this.elementInst && parentInst) {
        this.__parentEl = parentEl;
        this.addInst(parentInst);
      };
    },

    shouldRemoveInst(parent) {
      PxMapBehavior.ElementImpl.shouldRemoveInst.call(this, parent);

      if (this.elementInst) {
        this.removeInst(parent);
      };
      if (this.__parentEl && this.__parentEl._dereferenceChild) {
        this.__parentEl._dereferenceChild.call(this.__parentEl, this);
      }
      this.__parentEl = null;
    },

    // Methods to bind to/unbind from parent

    addInst(parent) {
      parent.addLayer(this.elementInst);
    },

    removeInst(parent) {
      this.elementInst.remove();
    },

    /**
     * Some element instances may require a minimum number of defined options
     * to be able to attach to their parent. If those options are defined via.
     * attributes, they may not be deserialized or even set before the `willAddInst`
     * method is called.
     *
     * Elements that need to defer until some options are set should override
     * the `canAddInst` method and return `false` if the method
     *
     * Elements that may need to defer until some options are ready should
     * override `instReady` and set it to `false` by default.
     *
     * Later, when the `updateInst` function is called, the element should check
     * if all required options are set and call the method `this.notifyInstReady(true)`
     * to trigger an event the parent will catch and use to attach this element.
     */
    canAddInst() {
      return true;
    }
  };
  /* Bind Layer behavior */
  /** @polymerBehavior */
  PxMapBehavior.Layer = [
    PxMapBehavior.Element,
    PxMapBehavior.LayerImpl
  ];

  /**
   *
   *
   * @polymerBehavior PxMapBehavior.ParentLayer
   */
  PxMapBehavior.ParentLayerImpl = {
    listeners: {
      'px-map-element-instance-created' : '_tryToAddAllChildren',
      'px-map-element-ready-to-add' : '_tryToAddOneChild'
    },

    created() {
      // Use a WeakMap to keep track of our attached children
      this._attachedChildren = this._attachedChildren || new WeakMap();
    },

    detached() {
      this._detachLayerChildren();
    },

    // Handles attaching children throughout this element's lifecycle

    _tryToAddAllChildren(evt) {
      // If this element's elementInst isn't ready, halt and wait until later
      // If this event isn't coming from this element, do not handle
      const localEvt = Polymer.dom(evt);
      if (!this.elementInst || localEvt.rootTarget !== this) return;

      // If my own elementInst was just created, loop over children and try to attach them
      this._attachLayerChildren();
    },

    _tryToAddOneChild(evt) {
      // If the added-to-dom event belongs to this element, just return and let it bubble
      const localEvt = Polymer.dom(evt);
      if (localEvt.rootTarget === this) return;

      // This element is the parent, so stop this event from bubbling
      evt.stopPropagation();

      // If I have no elementInst, halt and wait until later
      if (!this.elementInst) return;

      this._attachLayerChild(localEvt.rootTarget);
    },

    _attachLayerChildren() {
      const children = this.getEffectiveChildren();
      if (!children || !children.length) return;

      children.forEach(child => {
        this._attachLayerChild(child);
      });
    },

    _attachLayerChild(childEl) {
      if (this._attachedChildren.has(childEl) || !childEl.shouldAddInst || !childEl.canAddInst || !childEl.canAddInst()) return;
      this._attachedChildren.set(childEl, true);

      this.async(() => { childEl.shouldAddInst(this.elementInst, this); });
    },

    // Handles detaching children throughout this element's lifecycle

    _detachLayerChildren() {
      const children = this.getEffectiveChildren();
      if (!children || !children.length) return;

      children.forEach(child => {
        this._detachLayerChild(child);
      });
    },

    _detachLayerChild(childEl) {
      if (!this._attachedChildren.has(childEl) || !childEl.shouldRemoveInst) return;
      this._attachedChildren.delete(childEl);

      this.async(() => { childEl.shouldRemoveInst(this.elementInst, this); });
    },

    _dereferenceChild(childEl) {
      // If no attached children map or if this item is not in the map, halt
      if (!this._attachedChildren || !this._attachedChildren.has(childEl)) return;

      this._attachedChildren.delete(childEl);
    }
  };
  /* Bind ParentLayer behavior */
  /** @polymerBehavior */
  PxMapBehavior.ParentLayer = [PxMapBehavior.ParentLayerImpl];
})();
