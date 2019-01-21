import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMwMjZmMWEwLWY4OWQtNDY5NC04ZTY3LTBmOW' +
            'UzODYyYTZiYSIsIm5hbWUiOiJTcmF2eWEifQ.T8apUDdf404NOpTX1KkZV_PBhUdkFX0JxDR9V_VUZdg'
    })
};

@Injectable({
    providedIn: 'root'
})
export class CheckinService {

    constructor(private http: HttpClient) {
    }

    private serviceUrl = 'https://check-api.herokuapp.com';

    getTables(): Observable<any> {
        return this.http.get(this.serviceUrl + '/tables', httpOptions).pipe(
            tap((response) => console.log('/tables Response', response)),
            catchError(this.handleError<any>('error in /tables response'))
        );
    }

    createCheckForSelectedTable(checkObject): Observable<any> {
        return this.http.post(this.serviceUrl + '/checks', checkObject, httpOptions).pipe(
            tap((response) => console.log('/checks Response', response)),
            catchError(this.handleError<any>('error in /checks response'))
        );
    }

    getCheckByTableId(): Observable<any> {
      return this.http.get(this.serviceUrl + '/checks', httpOptions).pipe(
          tap(response => console.log('GET /checks Response', response)),
          catchError(this.handleError<any>('error in GET /checks'))
      );
    }

    deleteAllChecks(): Observable<any> {
        return this.http.delete(this.serviceUrl + '/checks', httpOptions).pipe(
            tap(response => console.log('DELETE /checks Response', response)),
            catchError(this.handleError<any>('error in DELETE /checks'))
        );
    }

    closeCheck(checkId): Observable<any> {
        const url = this.serviceUrl + '/checks' + '/' + checkId + '/close';
        return this.http.put(url, {}, httpOptions).pipe(
            tap(response => console.log('PUT /checks/ID/close Response', response)),
            catchError(this.handleError<any>('error in PUT /checks/ID/close'))
        );
    }

    getCheck(checkId): Observable<any> {
        const url = this.serviceUrl + '/checks' + '/' + checkId;
        return this.http.get(url, httpOptions).pipe(
            tap(response => console.log('GET /checks/ID Response', response)),
            catchError(this.handleError<any>('error in GET /checks/ID'))
        );
    }

    getItems(): Observable<any> {
        return this.http.get(this.serviceUrl + '/items', httpOptions).pipe(
            tap(response => console.log('GET /checks/items Response', response)),
            catchError(this.handleError<any>('error in GET /checks/items'))
        );
    }

    addItem(addItem, checkId): Observable<any> {
        const url = this.serviceUrl + '/checks' + '/' + checkId + '/addItem';
        console.log('req', url, addItem);
        return this.http.put(url, addItem, httpOptions).pipe(
            tap(response => console.log('PUT /checks/ID/addItem Response', response)),
            catchError(this.handleError<any>('error in PUT /checks/ID/addItem'))
        );
    }

    voidItem(voidItem, checkId): Observable<any> {
        const url = this.serviceUrl + '/checks' + '/' + checkId + '/voidItem';
        console.log('req', url, voidItem);
        return this.http.put(url, voidItem, httpOptions).pipe(
            tap(response => console.log('PUT /checks/ID/voidItem Response', response)),
            catchError(this.handleError<any>('error in PUT /checks/ID/voidItem'))
        );
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.log('error', error); // log to console instead
            console.log(`${operation} failed: ${error.message}`);
            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}
