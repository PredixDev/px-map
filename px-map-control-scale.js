/*
Copyright (c) 2018, General Electric

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/*
    Relative paths assume component is being run from inside an app or another component, where dependencies are flat
    siblings. When this component is run from its own repo (e.g. tests, examples), we assume the server is started with
    'gulp serve' (or similar server setup) to enable correct finding of bower dependencies for local runs.
*/
/* Local dependencies */
/**
The scale control places a scale in the corner of the map in either imperial or
metric units, or both.

### Usage

    <px-map>
      <px-map-tile-layer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'></px-map-tile-layer>
      <px-map-control-scale imperial-units position="bottomright"></px-map-control-scale>
    </px-map>

You must specify at least one unit type for the scale or it will not be drawn.
Set one or both of the `imperialUnits` or `metricUnits` attributes. Using
both scales at the same time is supported.

### Ordering/stacking controls

Multiple controls can be placed in the same position e.g. ('bottomright' for the
bottom right-hand corner of the map). Controls will stack automatically in the
reverse order they were placed in the DOM. This means that controls that appear
later in the DOM will be placed above those that appear earlier.

For example, this map has two controls in the same bottom right position, a zoom
control and a scale control:

    <px-map>
      <px-map-control-zoom position="bottomright"></px-map-control-zoom>
      <px-map-control-scale position="bottomright" imperial-units></px-map-control-zoom>
    </px-map>

When the map draws, the zoom control will be on top of the scale control in the
bottom right corner of the map.

@element px-map-control-scale
@blurb ...
@homepage index.html
@demo index.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import './px-map-behavior-control.js';
Polymer({
  _template: Polymer.html`
    <style>
      :host { display: none }
    </style>
`,

  is: 'px-map-control-scale',
  behaviors: [PxMapBehavior.ScaleControl]
});