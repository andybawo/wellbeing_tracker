import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private http: HttpClient) {}

  getCountries() {
    return this.http
      .get<any[]>('https://restcountries.com/v3.1/all?fields=name')
      .pipe(map((data) => data.map((c) => c.name.common).sort()));
  }

  getStatesByCountry(country: string) {
    return this.http
      .post<any>('https://countriesnow.space/api/v0.1/countries/states', {
        country: country,
      })
      .pipe(map((res) => res.data?.states?.map((s: any) => s.name) || []));
  }
}
