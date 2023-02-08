import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SharedService {
    private data = new BehaviorSubject({});
    currentData = this.data.asObservable();

    constructor() { }

    updateData(data: any) {
        this.data.next(data);
    }
}