export interface Json<T = any> {
    [prop: string]: T
}

export interface ICreareStateReturn {
    get(name: string): any;
    set(name: Json<any>|string, value: any): void;
    onChange(name: Json<Function>|string, fn: void): void;
    trigger(...name: Array<any>): void;
}