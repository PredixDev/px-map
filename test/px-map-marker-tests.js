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

describe('PxMapBehavior.Marker base', function() {
  var markerEl;

  before(function() {
    // Create a stub for the Marker base behavior
    Polymer({
      is: 'px-map-marker-behavior-stub',
      behaviors: [PxMapBehavior.Marker]
    });

    Polymer({
      is: 'px-map-layer-parent-behavior-stub',
      behaviors: [PxMapBehavior.Element, PxMapBehavior.ParentLayer]
    });
  });

  beforeEach(function(done) {
    markerEl = fixture('MarkerBehaviorFixture');
    flush(done);
  });

  it('validates whether a given input is a number', function() {
    expect(markerEl._canBeNum(5)).to.be.true;
    expect(markerEl._canBeNum(0)).to.be.true;
    expect(markerEl._canBeNum("5")).to.be.true;
    expect(markerEl._canBeNum("abc")).to.be.false;
    expect(markerEl._canBeNum(NaN)).to.be.false;
    expect(markerEl._canBeNum("")).to.be.false;
  });

  it('validates whether given lat and lng values are valid', function() {
    expect(markerEl.latLngIsValid(10,20)).to.be.true;
    expect(markerEl.latLngIsValid("10","20")).to.be.true;
    expect(markerEl.latLngIsValid("abc10","20")).to.be.false;
    expect(markerEl.latLngIsValid(10,"")).to.be.false;
    expect(markerEl.latLngIsValid("","")).to.be.false;
  });

  it('does not draw a marker if either the lat or lng value is invalid', function() {
    var invalidFixtureStub = fixture('InvalidLatLngMarkerFixture');
    var invalidLatLngMarkerEl = invalidFixtureStub.querySelector('px-map-marker-behavior-stub');

    expect(invalidLatLngMarkerEl.canAddInst()).to.be.false;
  });

  it ('hides a marker if its previously valid lat/lng becomes invalid, and then shows it if the lat/lng becomes valid again', function(done) {
    var validFixtureStub = fixture('ValidLatLngMarkerFixture');
    var validMarkerEl = validFixtureStub.querySelector('px-map-marker-behavior-stub');
    validMarkerEl.getMarkerIcon = function() {
      return L.divIcon();
    };

    var setOpacityFn;

    setTimeout(function() {
      expect(validMarkerEl.elementInst._map).to.be.an.instanceof(L.Map);
      setOpacityFn = sinon.spy(validMarkerEl.elementInst, 'setOpacity');
      validMarkerEl.setAttribute("lat", "abc");
    }, 400);

    setTimeout(function() {
      expect(setOpacityFn).to.have.been.calledOnce;
      expect(setOpacityFn).to.have.been.calledWithExactly(0);
      validMarkerEl.setAttribute("lat", "12");
    }, 600);

    setTimeout(function() {
      expect(setOpacityFn).to.have.been.calledTwice;
      expect(setOpacityFn).to.have.been.calledWithExactly(1);
      done();
    }, 800);
  });
});

describe('px-map-marker-locate', function() {
  var locateMarkerFixture;
  var markerEl;
  var markerOptions;

  beforeEach(function() {
    locateMarkerFixture = fixture('LocateMarkerWithNameFixture');
    markerEl = locateMarkerFixture.querySelector('px-map-marker-locate');
    markerOptions = markerEl.getInstOptions();
  });

  it('returns title property as configured through the `name` attribute (from `getInstOptions`)', function() {
    expect(markerOptions.baseConfig).to.be.an('object');
    expect(markerOptions.baseConfig).to.have.property('title').that.equals('i am a locate marker');
  });

  it('asks to update its title option when the `name` attribute is changed (with `shouldUpdateInst` observer)', function() {
    var updateFn = sinon.spy(markerEl, 'shouldUpdateInst');
    markerEl.set('name', 'A new name');

    expect(updateFn).to.have.been.calledOnce;
  });

  it('updates title property when changed through the `name` attribute', function(done) {
    markerEl.setAttribute('name', 'A new name');
    flush(function() {
      expect(markerEl.getInstOptions().baseConfig).to.have.property('title').that.equals('A new name');
      done();
    });
  });

  it('puts the title tag into the path', function(done) {
    flushAndRender(() => {
      var markerInstance = markerEl.elementInst;
      var layer;
      var keys = Object.keys(markerInstance._layers);
      for (var i=0; i<keys.length; i++) {
        if (markerInstance._layers[keys[i]].options.title) {
          layer = markerInstance._layers[keys[i]];
        }
      }
      expect(layer.options.title).to.equal("i am a locate marker");
      var regex = /<title.*i am a locate marker<\/title>/
      expect(regex.test(layer._path.innerHTML)).to.equal(true);
      done();
    }, 3);
  });
});

describe('px-map-marker-static with custom type', function() {
  var customMarkerFixture;
  var markerEl;
  var markerOptions;
  var markerClasses;

  beforeEach(function(done) {
    customMarkerFixture = fixture('StaticMarkerCustomTypeFixture');
    markerEl = customMarkerFixture.querySelector('px-map-marker-static');
    flush(done);
  });

  it('adds custom styles to icon html', function() {
    markerOptions = markerEl.getInstOptions();
    markerHtml = markerOptions.config.icon.options.html;
    sinon.assert.match(markerHtml.replace(/\s+/g, ''), (`<div class="map-icon-static__wrapper">
          <i class="map-icon-static__body" style="background-color: salmon;"></i>
          <i class="map-icon-static__descender" style="border-color: salmon transparent transparent;"></i>
          <i class="map-icon-static__badge"></i>
        </div>`).replace(/\s+/g, ''));
  });

  it('updates style attributes when the icon type is changed', function() {
    markerEl.setAttribute("type", "custom-1");
    markerOptions = markerEl.getInstOptions();
    markerHtml = markerOptions.config.icon.options.html;
    sinon.assert.match(markerHtml.replace(/\s+/g, ''), (`<div class="map-icon-static__wrapper">
          <i class="map-icon-static__body" style="background-color: hotpink;"></i>
          <i class="map-icon-static__descender" style="border-color: hotpink transparent transparent;"></i>
          <i class="map-icon-static__badge"></i>
        </div>`).replace(/\s+/g, ''));
  });

  it('removes custom styles when set to one of the default types', function() {
    markerEl.setAttribute("type", "info");
    markerOptions = markerEl.getInstOptions();
    markerHtml = markerOptions.config.icon.options.html;
    sinon.assert.match(markerHtml.replace(/\s+/g, ''), (`<div class="map-icon-static__wrapper">
          <i class="map-icon-static__body" style=""></i>
          <i class="map-icon-static__descender" style=""></i>
          <i class="map-icon-static__badge"></i>
        </div>`).replace(/\s+/g, ''));
  });
});

describe('px-map-marker-symbol with custom type', function() {
  var customMarkerFixture;
  var markerEl;
  var markerOptions;
  var markerClasses;

  beforeEach(function(done) {
    customMarkerFixture = fixture('SymbolMarkerCustomTypeFixture');
    markerEl = customMarkerFixture.querySelector('px-map-marker-symbol');
    flush(done);
  });

  it('adds custom styles to icon html', function() {
    markerOptions = markerEl.getInstOptions();
    markerHtml = markerOptions.config.icon.options.html;
    sinon.assert.match(markerHtml.replace(/\s+/g, ''), (`<div class="map-icon-symbol__wrapper">
        <i class="map-icon-symbol__body" style="background-color: salmon;">
          <div class="map-icon-symbol__symbol--container flex flex--middle flex--center">
            <px-icon icon="px-nav:favorite" style="stroke:white; fill:none; width:100%; height:100%; stroke-width:2px"></px-icon>
          </div>
        </i>
        <i class="map-icon-symbol__descender" style="border-color: salmon transparent transparent;"></i>
        <i class="map-icon-symbol__badge"></i>
      </div>`).replace(/\s+/g, ''));
  });

  it('updates style attributes when the icon type is changed', function() {
    markerEl.setAttribute("type", "custom-1");
    markerOptions = markerEl.getInstOptions();
    markerHtml = markerOptions.config.icon.options.html;
    sinon.assert.match(markerHtml.replace(/\s+/g, ''), (`<div class="map-icon-symbol__wrapper">
        <i class="map-icon-symbol__body" style="background-color: hotpink;">
          <div class="map-icon-symbol__symbol--container flex flex--middle flex--center">
            <px-icon icon="px-nav:favorite" style="stroke:white; fill:none; width:100%; height:100%; stroke-width:2px"></px-icon>
          </div>
        </i>
        <i class="map-icon-symbol__descender" style="border-color: hotpink transparent transparent;"></i>
        <i class="map-icon-symbol__badge"></i>
      </div>`).replace(/\s+/g, ''));
  });

  it('removes custom styles when set to one of the default types', function() {
    markerEl.setAttribute("type", "info");
    markerOptions = markerEl.getInstOptions();
    markerHtml = markerOptions.config.icon.options.html;
    sinon.assert.match(markerHtml.replace(/\s+/g, ''), (`<div class="map-icon-symbol__wrapper">
        <i class="map-icon-symbol__body" style="">
          <div class="map-icon-symbol__symbol--container flex flex--middle flex--center">
            <px-icon icon="px-nav:favorite" style="stroke:white; fill:none; width:100%; height:100%; stroke-width:2px"></px-icon>
          </div>
        </i>
        <i class="map-icon-symbol__descender" style=""></i>
        <i class="map-icon-symbol__badge"></i>
      </div>`).replace(/\s+/g, ''));
  });
});


describe('px-map-marker-* lifecycle', function() {
  var map;
  var marker;

  beforeEach(function(done) {
    map = fixture('ImperativeAddRemoveFixture');

    Polymer.RenderStatus.afterNextRender(map, () => {
      flush(() => {
        marker = map.querySelector('px-map-marker-static');
        done();
      });
    });
  });

  it('re-attaches a marker marker that is imperatively removed and re-added to the DOM', function(done) {
    expect(map._attachedChildren.has(marker)).to.be.true;
    map.removeChild(marker);

    flush(() => {
      expect(map._attachedChildren.has(marker)).to.be.false;
      expect(marker.elementInst._map).to.not.exist;
      map.appendChild(marker);
      flush(() => {
        expect(map._attachedChildren.has(marker)).to.be.true;
        expect(marker.elementInst._map).to.exist;
        done();
      });
    });
  });
});
