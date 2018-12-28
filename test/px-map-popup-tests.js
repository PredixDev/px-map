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

/*
 * These tests are for the InfoPopup class, which is not a web component. It is
 * a wrapper around the L.Popup class and is called by our components. We just
 * test the constructor and methods for validity.
 */
describe('PxMap.InfoPopup class', function () {
  it('constructor creates a new `L.Popup` instance', function() {
    var popup = new PxMap.InfoPopup();
    expect(popup).to.be.an.instanceof(L.Popup);
  });

  it('constructor generates basic HTML scaffolding when called with no options', function() {
    var popup = new PxMap.InfoPopup({});
    var content = popup.getContent();
    expect(content).to.be.a('string');
    expect(content).not.to.be.empty;
  });

  it('constructor generates popup HTML with only a title', function() {
    var TITLE_TEXT = 'How do you do, tests?';
    var popup = new PxMap.InfoPopup({ title: TITLE_TEXT });
    var content = popup.getContent();
    expect(content).to.include(TITLE_TEXT);
  });

  it('constructor generates popup HTML with only a description', function() {
    var DESCRIPTION_TEXT = 'This is the description for a test. It should go in the popup. That sounds nice, right?';
    var popup = new PxMap.InfoPopup({ description: DESCRIPTION_TEXT });
    var content = popup.getContent();
    expect(content).to.include(DESCRIPTION_TEXT);
  });

  it('constructor generates popup HTML with only an image link', function() {
    var IMG_LINK = 'https://test.test/foo.png';
    var popup = new PxMap.InfoPopup({ imgSrc: IMG_LINK });
    var content = popup.getContent();
    // searches for <img src=" ... then the image link, but is forgiving for
    // spaces and the like
    var imgSearch = '\<img.*src\=(?:\'|\")' + IMG_LINK;
    expect(content).to.match(new RegExp(imgSearch));
  });

  it('constructor generates popup HTML with a title, image, and description', function() {
    var TITLE_TEXT = 'How do you do, tests?';
    var DESCRIPTION_TEXT = 'This is the description for a test. It should go in the popup. That sounds nice, right?';
    var IMG_LINK = 'https://test.test/foo.png';
    var popup = new PxMap.InfoPopup({
      title: TITLE_TEXT,
      description: DESCRIPTION_TEXT,
      imgSrc: IMG_LINK
    });
    var content = popup.getContent();

    expect(content).to.include(TITLE_TEXT);
    expect(content).to.include(DESCRIPTION_TEXT);
    expect(content).to.include(IMG_LINK);
  });

  it('updates popup HTML when all settings are changed with `updateSettings`', function() {
    var TITLE_TEXT = 'How do you do, tests?';
    var DESCRIPTION_TEXT = 'This is the description for a test. It should go in the popup. That sounds nice, right?';
    var IMG_LINK = 'https://test.test/foo.png';
    var popup = new PxMap.InfoPopup({
      title: TITLE_TEXT,
      description: DESCRIPTION_TEXT,
      imgSrc: IMG_LINK
    });

    var NEW_TITLE_TEXT = 'This is a new title';
    var NEW_DESCRIPTION_TEXT = 'The description is also new. Oh no. I hope it gets updated.';
    var NEW_IMG_LINK = 'https://other.tests/bar.jpg';
    popup.updateSettings({
      title: NEW_TITLE_TEXT,
      description: NEW_DESCRIPTION_TEXT,
      imgSrc: NEW_IMG_LINK
    });
    var content = popup.getContent();

    expect(content).to.include(NEW_TITLE_TEXT);
    expect(content).to.include(NEW_DESCRIPTION_TEXT);
    expect(content).to.include(NEW_IMG_LINK);
  });

  it('updates popup HTML when only title setting is changed with `updateSettings`', function() {
    var TITLE_TEXT = 'How do you do, tests?';
    var DESCRIPTION_TEXT = 'This is the description for a test. It should go in the popup. That sounds nice, right?';
    var IMG_LINK = 'https://test.test/foo.png';
    var popup = new PxMap.InfoPopup({
      title: TITLE_TEXT,
      description: DESCRIPTION_TEXT,
      imgSrc: IMG_LINK
    });

    var NEW_TITLE_TEXT = 'This is a new title';
    popup.updateSettings({
      title: NEW_TITLE_TEXT
    });
    var content = popup.getContent();

    expect(content).to.include(NEW_TITLE_TEXT);
  });

  it('inherits the default minimum and maximum width when created without these parameters', function() {
    var popup = new PxMap.InfoPopup({});

    var defaultMin = PxMapBehavior.PopupImpl.properties.minWidth.value;
    var defaultMax = PxMapBehavior.PopupImpl.properties.maxWidth.value;

    // Test leaflet props
    expect(popup.options.minWidth).to.equal(defaultMin);
    expect(popup.options.maxWidth).to.equal(defaultMax);
  });

  it('applies the minimum and maximum width values when specified', function() {
    var minWidth = 123;
    var maxWidth = 456;
    var popup = new PxMap.InfoPopup({ minWidth: minWidth, maxWidth: maxWidth });

    // Test leaflet props
    expect(popup.options.minWidth).to.equal(minWidth);
    expect(popup.options.maxWidth).to.equal(maxWidth);
  });
});

/*
 * These tests are for the DataPopup class, which is not a web component. It is
 * a wrapper around the L.Popup class and is called by our components. We just
 * test the constructor and methods for validity.
 */
describe('PxMap.DataPopup class', function () {
  it('constructor creates a new `L.Popup` instance', function() {
    var popup = new PxMap.DataPopup();
    expect(popup).to.be.an.instanceof(L.Popup);
  });

  it('constructor generates basic HTML scaffolding when called with no options', function() {
    var popup = new PxMap.DataPopup({});
    var content = popup.getContent();
    expect(content).to.be.a('string');
    expect(content).not.to.be.empty;
  });

  it('constructor generates popup HTML with only a title', function() {
    var TITLE_TEXT = 'How do you do, tests?';
    var popup = new PxMap.DataPopup({ title: TITLE_TEXT });
    var content = popup.getContent();
    expect(content).to.include(TITLE_TEXT);
  });

  it('constructor generates popup HTML with only data', function() {
    var DATA_OBJECT = {"Location":"Test Land", "Value":"12"};
    var popup = new PxMap.DataPopup({ data: DATA_OBJECT });
    var content = popup.getContent();

    expect(content).to.include('Location');
    expect(content).to.include('Test Land');
    expect(content).to.include('Value');
    expect(content).to.include('12');
  });

  it('constructor generates popup HTML with a title and data', function() {
    var TITLE_TEXT = 'How do you do, tests?';
    var DATA_OBJECT = {"Location":"Test Land", "Value":"12"};
    var popup = new PxMap.DataPopup({
      title: TITLE_TEXT,
      data: DATA_OBJECT
    });
    var content = popup.getContent();

    expect(content).to.include(TITLE_TEXT);
    expect(content).to.include('Location');
    expect(content).to.include('Test Land');
    expect(content).to.include('Value');
    expect(content).to.include('12');
  });

  it('updates popup HTML when all settings are changed with `updateSettings`', function() {
    var TITLE_TEXT = 'How do you do, tests?';
    var DATA_OBJECT = {"Location":"Test Land", "Value":"12"};
    var popup = new PxMap.DataPopup({
      title: TITLE_TEXT,
      data: DATA_OBJECT
    });

    var NEW_TITLE_TEXT = 'This is a new title';
    var NEW_DATA_OBJECT = {"Foo":"Other Thing", "New Value":"999"};
    popup.updateSettings({
      title: NEW_TITLE_TEXT,
      data: NEW_DATA_OBJECT
    });
    var content = popup.getContent();

    expect(content).to.include(NEW_TITLE_TEXT);
    expect(content).to.include('Foo');
    expect(content).to.include('Other Thing');
    expect(content).to.include('New Value');
    expect(content).to.include('999');
  });

  it('inherits the default minimum and maximum width when created without these parameters', function() {
    var popup = new PxMap.DataPopup({});

    var defaultMin = PxMapBehavior.PopupImpl.properties.minWidth.value;
    var defaultMax = PxMapBehavior.PopupImpl.properties.maxWidth.value;

    // Test leaflet props
    expect(popup.options.minWidth).to.equal(defaultMin);
    expect(popup.options.maxWidth).to.equal(defaultMax);
  });

  it('applies the minimum and maximum width values when specified', function() {
    var minWidth = 321;
    var maxWidth = 654;
    var popup = new PxMap.DataPopup({ minWidth: minWidth, maxWidth: maxWidth });

    // Test leaflet props
    expect(popup.options.minWidth).to.equal(minWidth);
    expect(popup.options.maxWidth).to.equal(maxWidth);
  });
});

describe('PxMapBehavior.Popup base', function () {
  var popupEl;
  var parentMock;

  before(function() {
    // Create a stub for the Popup base behavior
    Polymer({
      is: 'px-map-popup-behavior-stub',
      behaviors: [PxMapBehavior.Popup]
    });
  });

  beforeEach(function (done) {
    popupEl = fixture('PopupBehaviorFixture');
    parentMock = {
      bindPopup: sinon.stub(),
      unbindPopup: sinon.stub(),
      closePopup: sinon.stub(),
      _mapToAdd: sinon.stub()
    };
    flush(done);
  });

  it('attaches itself to its parent and binds events (in `addInst`)', function() {
    var instance = popupEl.elementInst = {'Fake':'Instance'};
    parentMock.getPopup = sinon.stub().returns(null);

    var bindFn = sinon.stub(popupEl, 'bindEvents');
    popupEl.addInst(parentMock);

    expect(parentMock.getPopup).to.have.been.calledOnce;
    expect(parentMock.bindPopup).to.have.been.calledOnce;
    expect(parentMock.bindPopup).to.have.been.calledWith(instance);
    expect(bindFn).to.have.been.calledTwice;
  });

  it('removes itself from its parent (in `removeInst`)', function() {
    var instance = popupEl.elementInst = {'Fake':'Instance'};
    parentMock.getPopup = sinon.stub().returns(instance);

    popupEl.removeInst(parentMock);

    expect(parentMock.getPopup).to.have.been.calledOnce;
    expect(parentMock.unbindPopup).to.have.been.calledWith(instance);
  });

  it('closes itself if a control is clicked and `closeOnControlInteract` is true (in `_handleControlClick`)', function() {
    popupEl.closeOnControlInteract = true;
    popupEl._handleControlClick(parentMock);

    expect(parentMock.closePopup).to.have.been.calledOnce;
  });

  it('opens itself on its parent when the `opened` property changes', function() {
    var parentOpenSpy = sinon.stub();
    var instance = popupEl.elementInst = {
      _source: {
        openPopup: parentOpenSpy
      },
      isOpen: function() {
        return !popupEl.opened;
      }
    };
    popupEl.getInstOptions = function() {
      return {
        opened: popupEl.opened || false
      };
    };
    popupEl.__initialOptions = popupEl.getInstOptions();
    popupEl.opened = true;

    expect(parentOpenSpy).to.have.been.calledOnce;
  });
});

describe('px-map-popup-info', function () {
  var popupEl;
  var popupOptions;
  var popupContent;

  beforeEach(function (done) {
    popupEl = fixture('InfoPopupAttributesFixture');
    popupOptions = popupEl.getInstOptions();
    popupInstance = popupEl.createInst(popupOptions);
    popupContent = popupInstance.getContent();
    flush(done);
  });

  it('has maxWidth set', function() {
    expect(popupEl.maxWidth).to.equal(500);
  });

  it('returns correct properties configured through attributes (from `getInstOptions`)', function() {
    expect(popupOptions).to.be.an('object');
    expect(popupOptions).to.have.property('title').that.equals('Testy Test Title');
    expect(popupOptions).to.have.property('description').that.equals('This is a description for this test. It\'s so great!')
    expect(popupOptions).to.have.property('imgSrc').that.equals('/img/example.png');
  });

  it('creates and returns a popup instance (from `createInst`)', function() {
    expect(popupInstance).to.be.an.instanceof(PxMap.InfoPopup);
  });

  it('has a popup instance with the right content (from `createInst`)', function() {
    expect(popupContent).to.be.a('string').and.to.not.be.empty;
    expect(popupContent).to.include('Testy Test Title');
    expect(popupContent).to.include('This is a description for this test. It\'s so great!');
    expect(popupContent).to.include('/img/example.png');
  });

  it('asks to update its popup instance when attributes are changed (with `shouldUpdateInst` observers)', function() {
    var updateFn = sinon.spy(popupEl, 'shouldUpdateInst');
    popupEl.set('title', 'A new title');
    popupEl.set('description', 'A new description');

    expect(updateFn).to.have.been.calledTwice;
  });

  it('attempts to update its popup instance when attributes are changed (with `updateInst`)', function() {
    // Create a fake `elementInst` to test whether `updateSettings` is called
    var elementInst = {
      updateSettings: sinon.stub()
    };
    popupEl.elementInst = elementInst;

    var lastOptions = { title: 'Old title', description: 'Old description' };
    var nextOptions = { title: 'A new title', description: 'A new description' };
    popupEl.updateInst(lastOptions, nextOptions);

    expect(elementInst.updateSettings).to.have.been.calledWithMatch(nextOptions);
  });
});

describe('px-map-popup-data', function () {
  var popupEl;
  var popupOptions;
  var popupContent;

  beforeEach(function (done) {
    popupEl = fixture('DataPopupAttributesFixture');
    popupOptions = popupEl.getInstOptions();
    popupInstance = popupEl.createInst(popupOptions);
    popupContent = popupInstance.getContent();
    flush(done);
  });

  it('returns correct properties configured through attributes (from `getInstOptions`)', function() {
    expect(popupOptions).to.be.an('object');
    expect(popupOptions).to.have.property('title').that.equals('Testy Test Title');
    expect(popupOptions).to.have.property('data').that.is.an('object').and.eqls({
      Key1: "Value1",
      Key2: "Value2"
    });
  });

  it('logs and error and returns an empty data object if data is not a valid object (from `getInstOptions`)', function() {
    var validateFn = sinon.spy(popupEl, '_getValidData');
    var logFn = sinon.spy(console, 'log');
    popupEl.data = '{"Foo" "Bar"}';
    popupEl.getInstOptions();

    expect(validateFn).to.have.been.calledOnce;
    expect(validateFn).to.have.returned({});
    expect(logFn).to.have.been.calledOnce;
    expect(logFn).to.have.been.calledWithMatch(/PX\-MAP CONFIGURATION ERROR/);
  });

  it('creates and returns a popup instance (from `createInst`)', function() {
    expect(popupInstance).to.be.an.instanceof(PxMap.DataPopup);
  });

  it('has a popup instance with the right content (from `createInst`)', function() {
    expect(popupContent).to.be.a('string').and.to.not.be.empty;
    expect(popupContent).to.include('Testy Test Title');
    expect(popupContent).to.include('Key1')
      .and.to.include('Value1')
      .and.to.include('Key2')
      .and.to.include('Value2');
  });

  it('asks to update its popup instance when attributes are changed (with `shouldUpdateInst` observers)', function() {
    var updateFn = sinon.spy(popupEl, 'shouldUpdateInst');
    popupEl.set('title', 'A new title');
    popupEl.set('data', {'New':'Data'});

    expect(updateFn).to.have.been.calledTwice;
  });

  it('attempts to update its popup instance when attributes are changed (with `updateInst`)', function() {
    // Create a fake `elementInst` to test whether `updateSettings` is called
    var elementInst = {
      updateSettings: sinon.stub()
    };
    popupEl.elementInst = elementInst;

    var lastOptions = { title: 'Old title', data: {'Old':'Data'} };
    lastOptions.dataHash = JSON.stringify(lastOptions.data);
    var nextOptions = { title: 'A new title', data: {'New':'Data'} };
    nextOptions.dataHash = JSON.stringify(nextOptions.data);
    popupEl.updateInst(lastOptions, nextOptions);

    expect(elementInst.updateSettings).to.have.been.calledWithMatch({ title: 'A new title', data: {'New':'Data'} });
  });
});
