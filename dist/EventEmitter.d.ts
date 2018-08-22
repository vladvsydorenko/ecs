export declare type TEventListener<T_Data> = (data: T_Data) => any;
export declare class EventEmitter<T_Data> {
    private listenerContainers;
    private sortedListenerContainers;
    private isMuted;
    on(eventId: string, listener: TEventListener<T_Data>, thisArg?: any): Symbol;
    off(listenerId: Symbol): void;
    emit(eventId: string, data: T_Data): void;
    clear(): void;
    mute(): void;
    unmute(): void;
}
