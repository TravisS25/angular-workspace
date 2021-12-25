import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getDefaultCSRFHeader } from '../default-values';
import { HTTPOptions } from '../table-api';

@Injectable()
export class HttpService {
    constructor(private http: HttpClient) { }

    public requestJSONResponse<T>(method: string, url: string, options: HTTPOptions): Observable<HttpResponse<T>> {
        return this.http.request<T>(method, url, {
            withCredentials: options.withCredentials,
            headers: options.headers,
            params: options.params,
            reportProgress: options.reportProgress,
            observe: 'response',
            responseType: 'json',
        });
    }

    public getJSONResponse<T>(url: string, options: HTTPOptions): Observable<HttpResponse<T>> {
        return this.http.get<T>(url, {
            withCredentials: options.withCredentials,
            headers: options.headers,
            params: options.params,
            reportProgress: options.reportProgress,
            observe: 'response',
            responseType: 'json',
        });
    }

    public postJSONResponse<T>(url: string, form: any, options: HTTPOptions): Observable<HttpResponse<T>> {
        return this.http.post<T>(url, form, {
            withCredentials: options.withCredentials,
            headers: options.headers,
            params: options.params,
            reportProgress: options.reportProgress,
            observe: 'response',
            responseType: 'json',
        });
    }

    public putJSONResponse<T>(url: string, form: any, options: HTTPOptions): Observable<HttpResponse<T>> {
        return this.http.put<T>(url, form, {
            withCredentials: options.withCredentials,
            headers: options.headers,
            params: options.params,
            reportProgress: options.reportProgress,
            observe: 'response',
            responseType: 'json',
        });
    }

    public deleteJSONResponse<T>(url: string, options: HTTPOptions): Observable<HttpResponse<T>> {
        return this.http.delete<T>(url, {
            withCredentials: options.withCredentials,
            headers: options.headers,
            params: options.params,
            reportProgress: options.reportProgress,
            observe: 'response',
            responseType: 'json',
        });
    }
}
