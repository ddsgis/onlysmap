/**
 * Created by ddsgis on 28/11/18
 */

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import ImageLayer from 'ol/layer/Image';
import XYZ from 'ol/source/XYZ';
import { transform } from 'ol/proj';
import 'ol/ol.css';
import { defaults } from 'ol/control';
import Draw from 'ol/interaction/Draw';

/**
 * 地图初始化
 * @param {*标签id} mapId
 */
export function initMap(mapId) {
    const center = transform([114.31, 30.52], 'EPSG:4326', 'EPSG:3857');
    return new Map({
        target: mapId,
        layers: [
            new TileLayer({
                source: new XYZ({
                    url: 'http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}'
                }),
                extent: {
                    name: 'layer1'
                }
            })
        ],
        view: new View({
            center: center,
            projection: 'EPSG:3857',
            zoom: 16
        }),
        controls: defaults({
            attribution: false,
            rotate: false,
            zoom: false,
            mouseposition: true
        })
    });
}

export function drawFigure() {

}
