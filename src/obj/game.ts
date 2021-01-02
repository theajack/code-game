import {ICreareStateReturn} from '../types';
import {createState} from '../util/util';
import {log} from '../web/adapter';
import {Stage} from './stage';
import {Map} from './map';
import {MAP} from '../util/map.data';

export class Game {
    state: ICreareStateReturn;
    stage: Stage;
    map: Map;
    constructor ({
        level = 0
    }: {
        level: number
    }) {
        this.initState({
            level
        });
        let map = MAP[level];
        this.stage = new Stage({});
        this.map = new Map({matrix: map.matrix});
        log(this.state.get('level'));
    }

    private initState (options: {level: number}) {
        this.state = createState(options);
    }
}