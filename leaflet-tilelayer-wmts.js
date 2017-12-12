/*
 * Original source code copied from [Github](https://github.com/mylen/leaflet.TileLayer.WMTS).
 * Original license text included below.
 *
 * Copyright (c) 2014, Alexandre Melard
 * All rights reserved.
 *  
 * Copyright (c) 2008-2014 Institut National de l'Information Geographique et Forestiere (IGN) France.
 * Released under the BSD license.
 *  
 * Redistribution and use in source and binary forms, with or without modification, are
 * permitted provided that the following conditions are met:
 * 
 *    1. Redistributions of source code must retain the above copyright notice, this list of
 *       conditions and the following disclaimer.
 * 
 *    2. Redistributions in binary form must reproduce the above copyright notice, this list
 *       of conditions and the following disclaimer in the documentation and/or other materials
 *       provided with the distribution.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
 * TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
L.TileLayer.WMTS = L.TileLayer.extend({
    defaultWmtsParams: {
        service: 'WMTS',
        request: 'GetTile',
        version: '1.0.0',
        layers: '',
        styles: '',
        tilematrixSet: '',
        format: 'image/jpeg',
        transparent: true
    },
    initialize: function(url, options) {
        this._url = url;
        var wmtsParams = L.extend({}, this.defaultWmtsParams);
        var tileSize = options.tileSize || this.options.tileSize;
        if (options.detectRetina && L.Browser.retina) {
            wmtsParams.width = wmtsParams.height = tileSize * 2;
        } else {
            wmtsParams.width = wmtsParams.height = tileSize;
        }
        for (var i in options) {
            if (!this.options.hasOwnProperty(i) && i != "matrixIds") {
                wmtsParams[i] = options[i];
            }
        }
        this.wmtsParams = wmtsParams;
        this.matrixIds = options.matrixIds || this.getDefaultMatrix();
        L.setOptions(this, options);
    },
    onAdd: function(map) {
        this._crs = this.options.crs || map.options.crs;
        L.TileLayer.prototype.onAdd.call(this, map);
    },
    getTileUrl: function(coords) {
        var tileSize = this.options.tileSize;
        var nwPoint = coords.multiplyBy(tileSize);
        nwPoint.x += 1;
        nwPoint.y -= 1;
        var sePoint = nwPoint.add(new L.Point(tileSize, tileSize));
        var zoom = this._tileZoom;
        var nw = this._crs.project(this._map.unproject(nwPoint, zoom));
        var se = this._crs.project(this._map.unproject(sePoint, zoom));
        tilewidth = se.x - nw.x;
        var ident = this.matrixIds[zoom].identifier;
        var tilematrix = this.wmtsParams.tilematrixSet + ":" + ident;
        var X0 = this.matrixIds[zoom].topLeftCorner.lng;
        var Y0 = this.matrixIds[zoom].topLeftCorner.lat;
        var tilecol = Math.floor((nw.x - X0) / tilewidth);
        var tilerow = -Math.floor((nw.y - Y0) / tilewidth);
        var url = L.Util.template(this._url, {
            s: this._getSubdomain(coords)
        });
        return url + L.Util.getParamString(this.wmtsParams, url) + "&tilematrix=" + ident + "&tilerow=" + tilerow + "&tilecol=" + tilecol;
    },
    setParams: function(params, noRedraw) {
        L.extend(this.wmtsParams, params);
        if (!noRedraw) {
            this.redraw();
        }
        return this;
    },
    getDefaultMatrix: function() {
        var matrixIds3857 = new Array(22);
        for (var i = 0; i < 22; i++) {
            matrixIds3857[i] = {
                identifier: "" + i,
                topLeftCorner: new L.LatLng(20037508.3428, -20037508.3428)
            };
        }
        return matrixIds3857;
    }
});
L.tileLayer.wmts = function(url, options) {
    return new L.TileLayer.WMTS(url, options);
};