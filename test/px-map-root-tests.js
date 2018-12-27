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

describe('Basic px-map without options', function () {
  var mapEl;

  beforeEach(function(done) {
    mapEl = fixture('BasicMapFixture');
    flushAndRender(done, 3);
  });

  it('has a #map element in its shadow root', function() {
    var shadowTarget = Polymer.dom(mapEl.root).querySelector('#map');

    expect(shadowTarget).to.be.an.instanceof(HTMLElement);
  });

  it('has a #map element that fills its declared height and width', function() {
    var shadowTarget = Polymer.dom(mapEl.root).querySelector('#map');
    var shadowTargetRect = shadowTarget.getBoundingClientRect();

    expect(shadowTargetRect.width, 'width should have been 100px').to.be.closeTo(100,1);
    expect(shadowTargetRect.height, 'width should have been 100px').to.be.closeTo(100,1);
  });

  it('creates an instance of L.Map after attaching', function() {
    var mapInstance = mapEl.elementInst;

    expect(mapInstance).to.be.an.instanceof(L.Map);
  });

  it('has a default lat, lng, and zoom if none are set', function() {
    expect(mapEl.lat).to.be.a('number');
    expect(mapEl.lng).to.be.a('number');
    expect(mapEl.zoom).to.be.a('number');
  });

  it('sets its centerpoint and zoom to the default lat, lng, and zoom if none are set', function() {
    var latLng = mapEl.elementInst.getCenter();
    var zoom = mapEl.elementInst.getZoom();

    expect(latLng.lat).to.be.closeTo(37.7672375, 0.1);
    expect(latLng.lng).to.be.closeTo(-121.9584131, 0.1);
    expect(zoom).to.equal(10);
  });

  it('determines that it can add an inst of L.Map if lat and lng are valid', function(){
    mapEl.set('lat', 12);
    mapEl.set('lng', 34);

    expect(mapEl.canAddInst()).to.be.true;
  });

  it('sets its default attribution prefix to the Leaflet prefix', function() {
    var attributionNode = Polymer.dom(mapEl.root).querySelector('.leaflet-control-attribution');
    expect(attributionNode.textContent).to.equal('Leaflet');
  });

  it('does not throw an error when invalidateSize() method is called', function() {
    var error;
    try {
      mapEl.invalidateSize();
    } catch (err) {
      error = err;
    }
    expect(error).to.be.undefined;
  });
});

describe('Basic px-map with all zooming disabled', function () {
  var mapEl;

  beforeEach(function(done) {
    mapEl = fixture('DisableZoomMapFixture');
    flushAndRender(done, 3);
  });

  it('has scroll wheel zoom disabled', function() {
    var scrollZoom = mapEl.elementInst.options.scrollWheelZoom;
    expect(scrollZoom).to.be.false;
  });

  it('has touch zoom disabled', function() {
    var touchZoom = mapEl.elementInst.options.touchZoom;
    expect(touchZoom).to.be.false;
  });

  it('has double click zoom disabled', function() {
    var doubleClickZoom = mapEl.elementInst.options.doubleClickZoom;
    expect(doubleClickZoom).to.be.false;
  });
});

describe('Setting the geometry properties on px-map', function() {
  var mapEl;
  var sandbox;

  beforeEach(function(done) {
    mapEl = fixture('BasicMapFixture');
    sandbox = sinon.sandbox.create();
    sandbox.stub(window.console, "log");
    flushAndRender(done, 3);
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('updates its map view and doesn\'t clobber the property when `lat` is changed', function(done) {
    mapEl.set('lat', 10);

    setTimeout(function(){
      var newMapLatLng = mapEl.elementInst.getCenter();
      expect(mapEl.lat).to.equal(10);
      expect(newMapLatLng.lat).to.equal(10);
      done();
    }, 10);
  });

  it('updates its map view and doesn\'t clobber the property when `lng` is changed', function(done) {
    mapEl.set('lng', 7);

    setTimeout(function(){
      var newMapLatLng = mapEl.elementInst.getCenter();
      expect(mapEl.lng).to.equal(7);
      expect(newMapLatLng.lng).to.equal(7);
      done();
    }, 10);
  });

  it('updates its map view and doesn\'t clobber the property when `zoom` is changed', function(done) {
    mapEl.set('zoom', 6);

    setTimeout(function(){
      var newMapZoom = mapEl.elementInst.getZoom();
      expect(mapEl.zoom, 'the `zoom` property was reset to its old value').to.equal(6);
      expect(newMapZoom, 'the map zoom was not set to its new value').to.equal(6);
      done();
    }, 400);
  });

  it('fires an event once when all of lat, lng, and zoom are set in quick succession', function(done) {
    this.timeout(2000);

    mapEl.addEventListener('px-map-moved', function(evt) {
      expect(evt.detail).to.be.an('object');
      expect(evt.detail).to.have.all.keys('lat', 'lng', 'zoom', 'bounds');
      expect(evt.detail.lat).to.equal(12);
      expect(evt.detail.lng).to.equal(-13);
      expect(evt.detail.zoom).to.equal(14);
      done();
    });

    mapEl.set('lat', 12);
    mapEl.set('lng', -13);
    mapEl.set('zoom', 14);
  });

  it('validates whether a given input is a number', function () {
    expect(mapEl._canBeNum(5)).to.be.true;
    expect(mapEl._canBeNum(0)).to.be.true;
    expect(mapEl._canBeNum("5")).to.be.true;
    expect(mapEl._canBeNum("abc")).to.be.false;
    expect(mapEl._canBeNum(NaN)).to.be.false;
    expect(mapEl._canBeNum("")).to.be.false;
  });

  it('validates whether given lat and lng values are valid', function () {
    expect(mapEl.latLngIsValid(10,20)).to.be.true;
    expect(mapEl.latLngIsValid("10","20")).to.be.true;
    expect(mapEl.latLngIsValid("abc10","20")).to.be.false;
    expect(mapEl.latLngIsValid(10,"")).to.be.false;
    expect(mapEl.latLngIsValid("","")).to.be.false;
  });

  it('outputs a console log statement if the lat or lng is invalid and `hideError` is set to false', function() {
    var invalidLatLng = mapEl.latLngIsValid("abc", 123, false);

    sinon.assert.calledOnce(console.log);
    sinon.assert.match(console.log.args[0][0].replace(/\s+/g, ''), `PX-MAP CONFIGURATION ERROR:
      You entered an invalid \`lat\` or \`lng\` attribute for ${mapEl.is}. You must pass a valid number.`.replace(/\s+/g, ''));
  });

  it('does not output a console log statement if the lat or lng is invalid and `hideError` is set to true', function() {
    var invalidLatLng = mapEl.latLngIsValid("abc", 123, true);

    sinon.assert.notCalled(console.log);
  });

  it('does not draw a map if we give it an invalid lat or lng value', function(done) {
    var invalidLatLngMapEl = fixture('InvalidLatLngMapFixture');
    flushAndRender(() => {
      expect(invalidLatLngMapEl.elementInst).to.be.null;
      done();
    }, 3);
  });

  it('draws a map if a previously invalid lat or long becomes valid', function(done) {
    var invalidLatLngMapEl = fixture('InvalidLatLngMapFixture');
    flushAndRender(() => {
      invalidLatLngMapEl.setAttribute("lat", 12);
      expect(invalidLatLngMapEl.elementInst).to.be.defined;
      done();
    }, 3);
  });

  it('does not throw an error if the lat or lng value changes from valid to invalid', function() {
    var validLatLngMapEl = fixture('ValidLatLngMapFixture');
    var error;
    flushAndRender(() => {
      try {
        validLatLngMapEl.setAttribute("lat", "abc");
      }
      catch (err) {
        error = err;
      }
      expect(error).to.be.undefined;
    }, 3);
  });

  it('updates its attribution predix when `attributionPredix` is changed', function(done) {
    var attributionNode = Polymer.dom(mapEl.root).querySelector('.leaflet-control-attribution');
    mapEl.attributionPrefix = '<a href="#">New Attribution</a>';

    expect(attributionNode.textContent).to.equal('New Attribution');
    done();
  });
});

describe('px-map with fit-to-markers enabled', function() {
  /* begin listen for marker events */
  describe('listens for marker events and', function() {
    var mapEl;

    var fakeMarkerEl;
    var fakeMarkerEvt;
    var fakeMarkerGroupEvt;

    beforeEach(function(done) {
      mapEl = fixture('FitMarkersMapFixture');

      fakeMarkerEl = {
        elementInst: { id: 1 }
      };

      fakeMarkerEvt = {
        rootTarget: fakeMarkerEl,
        event: { detail: { latLng: [1,2] } }
      };

      fakeMarkerGroupEvt = {
        rootTarget: fakeMarkerEl,
        event: { detail: { bounds: [1,2] } }
      };

      flushAndRender(done, 3);
    });

    it('handles marker additions', function() {
      var eventFn = sinon.spy(mapEl, '_handleMarkerAdded');
      var listenFn = sinon.stub(mapEl, 'listen');
      var fitFn = sinon.stub(mapEl, '_fitMapToMarkersIfSet');
      sinon.stub(Polymer, 'dom').returns(fakeMarkerEvt);

      mapEl.fire('px-map-marker-added');

      Polymer.dom.restore(); // explicitly clean up this function or we'll fail at cleanup

      expect(eventFn).to.have.been.calledOnce;
      expect(mapEl._knownMarkers.has(fakeMarkerEl.elementInst)).to.be.true;
      expect(mapEl._knownMarkers.get(fakeMarkerEl.elementInst)).to.equal(fakeMarkerEvt.event.detail.latLng);
      expect(fitFn).to.have.been.calledOnce;
      expect(listenFn).to.have.been.calledWith(fakeMarkerEl, 'px-map-marker-removed', '_handleMarkerRemoved');
    });

    it('handles marker group updates', function() {
      var eventFn = sinon.spy(mapEl, '_handleMarkerGroupUpdated');
      var listenFn = sinon.stub(mapEl, 'listen');
      var fitFn = sinon.stub(mapEl, '_fitMapToMarkersIfSet');
      sinon.stub(Polymer, 'dom').returns(fakeMarkerGroupEvt);

      mapEl.fire('px-map-marker-group-features-changed');

      Polymer.dom.restore(); // explicitly clean up this function or we'll fail at cleanup

      expect(eventFn).to.have.been.calledOnce;
      expect(mapEl._knownMarkers.has(fakeMarkerEl.elementInst)).to.be.true;
      expect(mapEl._knownMarkers.get(fakeMarkerEl.elementInst)).to.equal(fakeMarkerGroupEvt.event.detail.bounds);
      expect(fitFn).to.have.been.calledOnce;
      expect(listenFn).to.have.been.calledWith(fakeMarkerEl, 'px-map-marker-group-removed', '_handleMarkerGroupRemoved');
    });

    it('handles marker removals', function() {
      var eventFn = sinon.spy(mapEl, '_handleMarkerRemoved');
      var knownFn = sinon.stub(mapEl._knownMarkers, 'has').returns(true);
      var deleteFn = sinon.spy(mapEl._knownMarkers, 'delete');
      var unlistenFn = sinon.stub(mapEl, 'unlisten');
      sinon.stub(Polymer, 'dom').returns(fakeMarkerEvt);

      mapEl._handleMarkerRemoved({});

      Polymer.dom.restore(); // explicitly clean up this function or we'll fail at cleanup

      expect(eventFn).to.have.been.calledOnce;
      expect(deleteFn).to.have.been.calledWith(fakeMarkerEl.elementInst);
      expect(unlistenFn).to.have.been.calledWith(fakeMarkerEl, 'px-map-marker-removed', '_handleMarkerRemoved');
    });
  });
  /* end listen for marker events */
  describe('tries to fit visible markers and', function() {
    var mapEl;

    var knownMarkers;
    var marker1;
    var marker1geom;
    var marker2;
    var marker2geom;
    var markerGroup1;
    var markerGroup1geom;

    beforeEach(function(done) {
      mapEl = fixture('FitMarkersMapFixture');
      knownMarkers = new Map();
      flushAndRender(done, 3);
    });

    it('does nothing if there are no known markers', function(done) {
      var setViewFn = sinon.stub(mapEl.elementInst, 'setView');
      mapEl._fitMapToMarkers();

      setTimeout(function() {
        expect(setViewFn).to.have.not.been.called;
        done();
      }, 20);
    });

    it('creates a new bounds object with padding', function() {
      var boundsFn = {};
      boundsFn.extend = sinon.stub();
      boundsFn.isValid = sinon.stub().returns(true);
      boundsFn.pad = sinon.stub().returns(boundsFn);
      var boundsConstructor = sinon.stub(L, 'latLngBounds').returns(boundsFn);

      var MARKER1 = {id:1};
      var GEOM1 = sinon.createStubInstance(L.LatLng);
      var MARKER2 = {id:2};
      var GEOM2 = sinon.createStubInstance(L.LatLngBounds);
      // The third marker should not get called, because its geom is not an
      // `instanceof` L.LatLng or L.LatLngB
      var MARKER3 = {id:3};
      var GEOM3 = {};
      var markers = new Map();
      markers.set(MARKER1, GEOM1);
      markers.set(MARKER2, GEOM2);
      markers.set(MARKER3, GEOM3);
      var PADDING = 0.2;

      var bounds = mapEl._markersToBoundsWithPadding(markers, PADDING);

      L.latLngBounds.restore();

      expect(boundsFn.extend).to.have.been.calledTwice;
      expect(boundsFn.extend.getCall(0)).to.have.been.calledWith(GEOM1);
      expect(boundsFn.extend.getCall(1)).to.have.been.calledWith(GEOM2);
      expect(boundsFn.pad).to.have.been.calledWith(PADDING);
      expect(bounds).to.equal(boundsFn);
    });

    it('determines the correct zoom level', function() {
      // This tests different `fitToMarkersZoom` property settings and how
      // they impact the zoom level returned by `_getZoomLevelForFit`.
      var spy = sinon.spy(mapEl, '_getZoomLevelForFit');
      var fakeMap = {
        getMinZoom: sinon.stub().returns(5),
        getBoundsZoom: sinon.stub().returns(11)
      };
      var fakeBounds = sinon.stub();

      var callWithMin = mapEl._getZoomLevelForFit(fakeBounds, 'min', fakeMap);
      expect(callWithMin).to.eql(5); // should equal map.getMinZoom()

      var callWithMax = mapEl._getZoomLevelForFit(fakeBounds, 'max', fakeMap);
      expect(callWithMax).to.eql(11); // should equal map.getBoundsZoom()
    });

    it('corretly sets its view', function() {
      var CENTER = [1,2];
      var ZOOM = 7;

      mapEl._knownMarkers = { size: true };
      var boundsFn = {
        isValid: sinon.stub().returns(true),
        getCenter: sinon.stub().returns(CENTER)
      }
      var getBoundsFn = sinon.stub(mapEl, '_markersToBoundsWithPadding').returns(boundsFn);
      var zoomFn = sinon.stub(mapEl, '_getZoomLevelForFit').returns(ZOOM);
      var setViewFn = sinon.stub(mapEl.elementInst, 'setView');

      mapEl._fitMapToMarkers();
      mapEl.flushDebouncer('fit-map-to-bounds'); // Flush the debouncer to the task finished right now
      mapEl._markersToBoundsWithPadding.restore();

      expect(setViewFn).to.have.been.calledWith(CENTER, ZOOM);
    });

    it('calls internal fit function when `fitMapToMarkers` is called and some markers are known', function() {
      var fitFn = sinon.stub(mapEl, '_fitMapToMarkers');
      mapEl._knownMarkers = { size: true };
      var someMarkersKnownCall = mapEl.fitMapToMarkers();
      expect(someMarkersKnownCall).to.be.true;
      expect(fitFn).to.have.been.calledOnce;
    });

    it('updates its bounds to fit some markers', function(done) {
      var MARKER1 = { elementInst: { id: 1 } };
      var MARKER1GEOM = L.latLng([51.509,-0.118]); // London, UK
      var MARKER1EVT = {
        rootTarget: MARKER1,
        event: { detail: { latLng: MARKER1GEOM } }
      };

      var MARKER2 = { elementInst: { id: 1 } };
      var MARKER2GEOM = L.latLng([15.369,44.191]); // Sana'a, Yemen
      var MARKER2EVT = {
        rootTarget: MARKER2,
        event: { detail: { latLng: MARKER2GEOM } }
      };

      var MARKER3 = { elementInst: { id: 1 } };
      var MARKER3GEOM = L.latLng([39.933,32.859]); // Ankara, Turkey
      var MARKER3EVT = {
        rootTarget: MARKER3,
        event: { detail: { latLng: MARKER3GEOM } }
      };

      // Stub out Polymer.dom so it doesn't murder events when we try to normalize
      // It'll just give the events right back
      var listenFn = sinon.stub(mapEl, 'listen');
      var dom = sinon.stub(Polymer, 'dom');
      dom.withArgs(sinon.match({type:'px-map-marker-added'}))
        .onFirstCall().returns(MARKER1EVT)
        .onSecondCall().returns(MARKER2EVT)
        .onThirdCall().returns(MARKER3EVT);

      var addSpy = sinon.spy(mapEl, '_handleMarkerAdded');
      var fitSpy = sinon.spy(mapEl, '_fitMapToMarkersIfSet');

      mapEl.fire('px-map-marker-added', MARKER1EVT);
      mapEl.fire('px-map-marker-added', MARKER2EVT);

      setTimeout(function() {
        mapEl.flushDebouncer('fit-map-to-bounds'); // Flush the debouncer to the task finished right now
        // Add another marker a bit later
        mapEl.fire('px-map-marker-added', MARKER3EVT);
      }, 200);

      setTimeout(function() {
        mapEl.flushDebouncer('fit-map-to-bounds'); // Flush the debouncer to the task finished right now

        expect(addSpy).to.have.been.calledThrice;
        expect(fitSpy).to.have.been.calledThrice;
        var newMapBounds = mapEl.elementInst.getBounds();
        expect(newMapBounds.contains(MARKER1GEOM)).to.be.true;
        expect(newMapBounds.contains(MARKER2GEOM)).to.be.true;
        expect(newMapBounds.contains(MARKER3GEOM)).to.be.true;

        Polymer.dom.restore(); // explicitly clean up this function or we'll fail at cleanup
        done();
      }, 400);

    });
  });
});
