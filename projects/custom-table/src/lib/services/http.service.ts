import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getDefaultCSRFHeader } from '../default-values';
import { HTTPOptions } from '../table-api';

@Injectable()
export class HttpService {
    constructor(private http: HttpClient) { }

    private getHeaders(csrfToken: string, options: HTTPOptions): HttpHeaders {
        let headers: HttpHeaders;
        const csrfHeaders = getDefaultCSRFHeader(csrfToken);

        if (options.headers != undefined) {
            headers = new HttpHeaders();
            const optionKeys = options.headers.keys();

            for (let i = 0; i < optionKeys.length; i++) {
                headers.set(optionKeys[i], options.headers.get(optionKeys[i]))
            }

            const csrfKeys = csrfHeaders.keys();

            for (let i = 0; i < csrfKeys.length; i++) {
                headers.set(csrfKeys[i], csrfHeaders.get(optionKeys[i]))
            }

        } else {
            headers = csrfHeaders;
        }

        return headers;
    }

    public request<T>(method: string, url: string, options: HTTPOptions): Observable<T> {
        return this.http.request<T>(method, url, {
            withCredentials: options.withCredentials,
            headers: options.headers,
            params: options.params,
            reportProgress: options.reportProgress,
        });
    }

    public get<T>(url: string, options: HTTPOptions): Observable<T> {
        return this.http.get<T>(url, {
            withCredentials: options.withCredentials,
            headers: options.headers,
            params: options.params,
            reportProgress: options.reportProgress,
        });
    }

    public post<T>(url: string, form: any, csrfToken: string, options: HTTPOptions): Observable<T> {
        return this.http.post<T>(url, form, {
            withCredentials: options.withCredentials,
            headers: this.getHeaders(csrfToken, options),
            params: options.params,
            reportProgress: options.reportProgress,
        });
    }

    public put<T>(url: string, form: any, csrfToken: string, options: HTTPOptions): Observable<T> {
        return this.http.put<T>(url, form, {
            withCredentials: options.withCredentials,
            headers: this.getHeaders(csrfToken, options),
            params: options.params,
            reportProgress: options.reportProgress,
        });
    }

    public delete<T>(url: string, csrfToken: string, options: HTTPOptions): Observable<T> {
        return this.http.delete<T>(url, {
            withCredentials: options.withCredentials,
            headers: this.getHeaders(csrfToken, options),
            params: options.params,
            reportProgress: options.reportProgress,
        });
    }
}
