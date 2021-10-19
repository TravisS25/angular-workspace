import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WindowResizeService {
    private _windowSizeObs = new Subject<number>();
    private _windowSize: number;

    constructor() { }

    public getWindowSizeObs(): Observable<number> {
        return this._windowSizeObs
    }

    public getwindowSize(): number {
        return this._windowSize;
    }

    public setWindowSize(size: number) {
        this._windowSize = size;
        this._windowSizeObs.next(size);
    }
}
