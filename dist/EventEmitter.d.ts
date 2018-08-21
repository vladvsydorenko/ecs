export declare type TListenerFn<T_Data> = (data: T_Data) => any;
export declare class EventEmitter<T_Data = any> {
    private listeners;
    private listenersMap;
    private nextListenerId;
    on(eventType: string, fn: TListenerFn<T_Data>, context?: any): number;
    off(listenerId: number): void;
    emit(event: string, data: T_Data): void;
}
