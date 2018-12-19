v3.4.0
===================
## New features:
* Add the `opened` property to px-map-popup-info and px-map-popup-data. Use this
  property to programmatically open or close a popup without user interaction
  on the popup's parent. See `examples/popup-open-close-api.html` for a demo.

v3.3.0
===================
* Update deps

v3.2.0
===================
* Add custom mouseover & mouseout events to px-map-marker-static elements

v3.1.7
===================
## Bug fixes
* Fixes a bug where markers (or other layers) that are imperatively detached
  from the DOM and then re-attached were not re-attached to the map

v3.1.6
===================
* fix documentation typos

v3.1.5
===================
* fixing demo pages for IE11

v3.1.4
===================
* Unpin leaflet.markercluster version

v3.1.3
===================
* Pin leaflet.markercluster to ~1.2.0 until leaflet bug is resolved
* Update .travis.yml
* Update tests

v3.1.2
===================
* fix relative path for geojson demo

v3.1.1
===================
* replace html w markdown in docs

v3.1.0
===================
* Add Polymer 1.x/2.x hybrid element support

v3.0.2
===================
* Remove broken import from demo page.

v3.0.1
===================
## New features
* Adds the `px-map-tile-layer-wms` layer to support querying WMS services to
  request base tile images

## Other changes
* Fix path to API source file for px-map-tile-layer-google demo

v3.0.0
===================
This is a major release and includes new features and breaking changes.

## Important breaking changes
* The px-map code is written in ES6 format, and in previous versions the code
  was shipped in transpiled format in the `dist/` directory. This built code has
  been deleted. If you were relying on it you should switch over to use the
  `px-map/px-map-*.html` files directly instead of `px-map/dist/px-map-*.html`.
  If you need to transpile the px-map code for older browsers, you should do so
  as part of your app's build process. See the [Transpile ES6 guide on the
  Predix Design System website](https://www.predix-ui.com/#/develop/transpile)
  for guidance on how to implement this in your build system.

## New features
* All px-map marker colors can now be set in a fully dynamic, customizable way.
  This allows developers to set up to 100 custom colors for markers, which is
  especially valuable for marker group visualizations with custom asset types.
  See the documentation in px-map-marker-* documentation pages for more info
  on using this new feature.

v2.3.1
===================
## Other changes
* Add device flags

v2.3.0
===================
## New features
* We're adding the new `px-map-tile-layer-google` subcomponent in this release.
  Thanks to Ollie Sims as his team for this contribution. Teams using px-map
  can now choose from a variety of tile providers, including Google, Bing,
  and any provider that exposes an x/y/z API.

v2.2.0
===================
## New features
* Expose the `disableDoubleClickZoom` property to allow the developer to disable
  zooming on double click for mouse or touch input.

v2.1.5
===================
## Bug fixes
* Set the cluster icon container to use the box-sizing border-box model to
  determine how to size itself. Fixes a bug that happened when the cluster icon
  inherited box-sizing context-box from the app, causing the icon to look broken.

v2.1.4
===================
## Bug fixes
* Fix misc. bugs in demo for `px-map-layer-geojson`

v2.1.3
===================
## Other changes
* Fix wording in documentation

v2.1.2
===================
## Bug fixes
* Add Object.assign polyfill for IE
* Check that `zoom` is set before trying to draw the map
* Check for `parent.getPopup` method before calling it in `addInst` for
  `px-map-behavior-popup`

## New features
* Add title tag for `px-map-marker-locate`
* Add `hideError` argument to `latLngIsValid` method so developer can choose to
  hide the console error if lat or lng is invalid

v2.1.1
===================
## Bug fixes
* Fix paths for px-map API viewer

v2.1.0
===================
## New features
* Adds the `--px-map-z-index` property to px-map which can be used to position
  the map in the correct layer within your application. Note that the z-indices
  of Leaflet layers exist in their own stacking context, and so are not affected
  by the z-index set on px-map. Read more about the stacking context [here](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context).
* Adds the `invalidateSize()` method to px-map, which can be used to check
  whether the map container has changed size or visibility, and - if so - updates
  the map accordingly by refreshing the tile layer.

v2.0.0
===================
This is a major release and includes breaking changes.

## Changes to existing APIs
Updates all icons to take svg icons (e.g. px-icon, iron-icon) rather than an
icon font (e.g. font-awesome).

Components affected:

* px-map-marker-symbol
* px-map-marker-group
* px-map-control-zoom
* px-map-control-locate

Changes:

* `px-map-marker-symbol`: The `symbol-class` attribute has been removed and
  replaced with the `icon` attribute. Replace all references to `symbol-class`
  and `symbolClass` in your code with `icon`. Replace icon font icons with svg
  icons, either from px-icon-set or from another svg icon set.
* `px-map-control-zoom`: The `zoom-in-text` and `zoom-out-text` attributes have
  been removed. The zoom in and zoom out icons are no longer configurable.
  Delete any references to these attributes in your code.
* `px-map-control-locate`: The `locate-text` attribute has been removed. The
  locate icon is no longer configurable. Delete any references to this attribute
  in your code.

See [px-icon-set](https://github.com/PredixDev/px-icon-set) to find new icons
you can use to replace previous font-awesome icons.
If you can't find the icons you need in px-icon-set, you can look at
[iron-icons](https://www.webcomponents.org/element/PolymerElements/iron-icons).
If you would like to define your own icons, look at
[iron-iconset-svg](https://www.webcomponents.org/element/PolymerElements/iron-iconset-svg).

## Other changes
* Updates colors and icons for the Predix Design System refresh.

v1.5.2
===================
## Bug fixes
* Document choices for production tile services, add specific info on restrictions
  of OpenStreetMap tile service.

v1.5.1
===================
## Other changes
* Document CSS variables (#91)

v1.5.0
===================
## New features
* Adds the `attributionPrefix` attribute to `px-map`. You can now customize the
  attribution prefix (replace the 'Leaflet' link) or turn the prefix off altogether.
  Thanks to William Chang of GE Energy Connections for this contribution.

## Other changes
* Speeds up style configuration lookups in `px-map-layer-geojson` by memoizing
  them at creation time and updating them when needed. Thanks to Dave Fox of
  GE Energy Connections for this contribution.

v1.4.6
===================
## Other changes
* Fixes a property documentation typo

v1.4.5
===================
## Other changes
* Replace inuit-clearfix with px-clearfix-design
* Update documentation for px-map-popup-info
* Fix travis WCT version to v5.x.x

v1.4.4
===================
## Bug fixes
* Ensures data popups are not shown if the popup has no data

v1.4.3
===================
## New features
* Adds tap events to `px-map-marker-group` that fire when clusters or any
  individual marker inside a cluster is tapped

v1.4.2
===================
## Other changes
* Remove mapbox tile layer example. Please do not use this tile layer in production.

v1.4.1
===================
## Bug fixes
* Removes a stray debugger statement from `px-map-layer-geojson`

## Other changes
* Fix documentation data loading issue for `px-map-layer-geojson`

v1.4.0
===================
## Major bug fix
* Update to import d3 library using px-d3-imports instead of pxd3 to prevent
  Px.d3 from being undefined when called in px-map-marker group. Be sure to
  test that d3 is imported in your app before using this version in production.

v1.3.2
===================
## Other changes
* Update documentation for px-map-popup-info

v1.3.1
===================
## Other changes
* Remove extraneous demo config for px-map-layer-geojson

v1.3.0
===================
## New features
* We're excited to add the `px-map-layer-geojson` subcomponent in this release.
  Thanks to Dave Fox and his team at GE Energy Connections for this contribution.
  The new component can draw GeoJSON geometries as vector shapes on the map.
  The component allows for complex, feature-level styling. It should be very
  helpful for anyone looking to draw additional feature/asset types with px-map.

## Bug fixes
* A bug that caused data popups to pan the map wildly when they were opened has
  been fixed. This bug was only present in shady DOM.

v1.2.6
===================
## Bug fixes
* Validates that lat and lng are valid numbers and handles invalid values
  gracefully (#54). Adds tests.

v1.2.5
===================
## Bug fixes
* Allows developers to force the px-map-tile-layer URL to be decoded if a
  browser behavior encodes it (#86).

v1.2.4
===================
## Bug fixes
* Fixes a bug that causes popups to collapse when their content is too short

v1.2.3
==================
## Bug fixes
* Adds a default minZoom and maxZoom for map to fix a bug where marker group
  permanently fails if it attaches before a tile layer and no minZoom
  and maxZoom are defined (https://github.com/PredixDev/px-map/issues/76).
  This bug seems to be related to a limitation in the underlying library
  we use for marker group. See this issue, which seems to have solved a related
  bug in the past: https://github.com/Leaflet/Leaflet.markercluster/issues/198.
  It's possible a regression in Leaflet.markercluster caused this bug to
  happen again — this may require future investigation.

v1.2.2
==================
## Other changes
* Adds `disableTouchZoom` and `disableScrollZoom` to demos to make it easier to
  browse the demo site.

v1.2.1
==================
## Bug fixes
* Fixes `moveMaxZoom` attribute bug in `px-map-locate-control`, adds test

v1.2.0
==================
This release adds a new subcomponent that loads base layer tiles from the
Bing Maps API. It handles authentication and communication with the API,
making it simple to add Bing's aerial or road imagery to your map.

## New features
* Load tiles from the Bing Maps API with `px-map-tile-layer-bing`. See the new
  component's API docs page for more information and a demo.

v1.1.0
==================
This is the first minor release since v1.0.0 and it has a lot of great fixes,
tweaks, and improvements to existing components. This release was focused on
hardening the components to respond the way developers and users expect.

## Changes to existing APIs
There are no breaking changes in this release, but some old APIs have been
quietly deprecated.

Components affected:

* px-map-marker-static
* px-map-marker-symbol
* px-map-marker-group
* px-map-control-zoom

Changes:

* The `showBadge` attribute has been removed from `px-map-marker-static` and
  `px-map-marker-symbol`. The badges will now always appear on when those
  icons have their `type` set to 'important' or 'warning.' Search your code for
  `show-badge` or `showBadge` in your HTML or JavaScript and just delete any
  references. If you set the `showBadge` attribute on a component, nothing will
  happen, and no errors will be thrown.
* Related to `showBadge`, you should update any GeoJSON FeatureCollection samples
  or generators you have created. You should no longer pass the key 'icon-show-badge'
  in your feature marker-icon properties. Search your code for the following
  regular expression and delete the line: `/(?:\"|\')icon\-show\-badge(?:\"|\')[\s]?:[\s]?true/`
* The `zoomInTitle` and `zoomOutTitle` options have been removed from the
  `px-map-control-zoom` component. These were not well documented and didn't work
  as expected. The documentation for the component recommended using localization
  for setting these attributes anyway. If you happened to use them, switch over
  to using the localization behavior (see the component's API docs).


## New features
* You can now bind popups to markers in `px-map-marker-group`. See the API
  docs for that component for a thorough guide to setting up your features
  with marker icons and popups. You can also see `examples/marker-clusters-with-popups.html`
  for an example of it in use.
* The `px-map` component had its `fitToMarkers` behavior majorly overhauled and
  improved. New configurations are now available to customize how the `fitToMarkers`
  event happens (`fitToMarkersZoom` and `fitToMarkersPadding`). See the API
  docs for details.
* A lot of new events were added

## Bug fixes
* Fixes an incorrect call to `addInst` when a component is cleaning itself up.
  This may speed things up a bit and stop a small memory leak.
* The `px-map` component `fitToMarkers` is much more consistent and should always
  fit the markers on the map.
* Documentation on all components has been significantly improved to show correct
  examples of how to use components.
* The `imgSrc` attribute on `px-map-popup-info` was sometimes not showing an
  image in the popup. That's fixed now.
* All markers are now smaller, to match the design specifications for Predix UI
  Maps components. This should make it easier to place many markers near each
  other on a map without having them overlap.

v1.0.3
==================
## Bug fixes
* Add missing semicolon that causes a failure after inlining script

v1.0.2
==================
## Bug fixes
* Fix lat/lng/zoom set and notification timing bugs, add tests to cover

v1.0.1
==================
## Bug fixes
* Well, that was quick. Small patch for some build-time requirements (deploy key
  and travis configuration).

v1.0.0
==================
## Introduction
This is the first release of the `px-map` components. The map components make it
easy to build an interactive map out of web components with simple, expressive
APIs.

The 1.0.0 release is the first opportunity for developers to start using the map
components. There are still some rough edges, open bugs, and improvements we'd
like to make. (Nothing is every truly done.) Feedback in the form of bugs,
comments, and feature requests is welcome. Please submit your feedback through
issues on the `px-map` Github repository:
https://github.com/predixdev/px-map/issues.

## New components in this release

This is our first public release, so every component is a new component.
(Woohoo.) Here's a list of all the sub-components available to build with. See
the `px-map` documentation pages (https://www.predix-ui.com/#/components/px-map/)
for more information on what these components do and how you can use them:

#### Core components
* px-map

#### Controls
* px-map-control-locate
* px-map-control-scale
* px-map-control-zoom

#### Overlays
* px-map-layer-group
* px-map-marker-group
* px-map-marker-locate
* px-map-marker-static
* px-map-marker-symbol

#### UI Elements
* px-map-popup-data
* px-map-popup-info

#### Base Layers
* px-map-tile-layer

## Browser support

The map components are built using new JavaScript language features (i.e. ES6
  syntax and new built-in types and addons). Out of the box, these features are
  not supported by Internet Explorer 11 or older, Safari 9 or older, and some
  other out-of-date browsers. (But they work great in new Chrome, Firefox, and
    Microsoft Edge versions. Give 'em a test drive.)

You'll have to transpile and bundle the map components as part of your build
process (e.g. with a transpilation plugin like babel as part of a webpack/browserify/etc.
bundle). We'll have more documentation coming soon to help you use off-the-shelf
tools like the Polymer CLI (https://www.polymer-project.org/1.0/docs/tools/polymer-cli)
to build and distribute your code. Using an optimized build lets you decide how
to tune your code for your users. It can also make things run much faster with
the right tuning.

Check back on the px-map documentation pages and the Github repository for more
information on preparing your code to run in production on older browsers.

## What's coming in future releases

See our Github issues page for more information about planned upcoming
enhancements and features. We also welcome contributions if your team builds
something that can be used by and shared with others.
