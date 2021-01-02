import {Map} from './map';

export class Stage {
    map: Map;
    constructor ({
    }) {
        
    }

    injectMap (map: Map) {
        this.map = map;
    }
}