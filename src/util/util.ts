import {Json} from '../types';


export function creatEventReady () {
    let bridgeQueue = [];
    let lastArgs = null;

    function onEventReady (fn: Function, ...args: any[]) {
        if (!bridgeQueue.find(item => item.fn === fn)) {
            bridgeQueue.push({fn, args});
        }
        if (lastArgs !== null) {
            if (args.length === 0 && lastArgs) {
                args = lastArgs;
            }
            fn(...args);
        }
    }
    
    function eventReady (...args: any[]) {
        lastArgs = args;
        bridgeQueue.forEach(item => {
            item.fn(...((args.length === 0) ? item.args : args));
        });
        // bridgeQueue = null;
    }

    return {
        onEventReady,
        eventReady
    };
}

// 简易的状态管理
export function createState (state: Json<any>) {
    if (typeof state !== 'object') return;
    let calls = {};
    for (let k in state) {
        calls[k] = creatEventReady();
    }
    function checkNecessary (name: string) {
        if (typeof state[name] === 'undefined') {
            console.warn(`不存在的属性:${name}`);
            return false;
        };
        return true;
    }
    function get (name: string) {
        return state[name];
    }
    function set (name: Json<any>|string, value: any) {
        mapJson(name, value, (name: string, value: any) => {
            if (!checkNecessary(name) || value === state[name]) {return;}
            calls[name].eventReady(value, state[name]);
            state[name] = value;
        });
    }
    function onChange (name: Json<Function>|string, fn: void) {
        mapJson(name, fn, (name, fn) => {
            if (!checkNecessary(name)) {return;}
            calls[name].onEventReady(fn);
        });
    }

    function trigger (...name: Array<any>) {
        mapArray(name, (name) => {
            if (!checkNecessary(name)) {return;}
            calls[name].eventReady(state[name], state[name]);
        });
    }

    return {get, set, onChange, trigger};
}

function mapArray (value: Array<any>|any, fn:(value: any)=>void) {
    if (value instanceof Array) {
        value.forEach(v => {
            fn(v);
        });
    } else {
        fn(value);
    }
}
function mapJson (key: Json<any>|string, value: any, fn:(name: string, value: any)=>void) {
    if (typeof key === 'object') {
        for (let k in key) {
            fn(k, key[k]);
        }
    } else {
        fn(key, value);
    }
}