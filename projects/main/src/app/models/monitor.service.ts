import { Config, ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { type } from 'os';

export type Data = {
  before_date: string;
  date: string;
  result: { [key: string]: any };
};

@Injectable({
  providedIn: 'root',
})
export class MonitorService {
  constructor(private readonly http: HttpClient, private readonly config: ConfigService) {}

  list(year: number, month: number, day: number, count: number) {
    return this.http
      .get<Data[]>(`${this.config.config.extension?.monitor?.monitorURL}/list`, {
        params: {
          start_year: year,
          start_month: month,
          start_day: day,
          count: count,
        },
      })
      .toPromise();
  }
}
