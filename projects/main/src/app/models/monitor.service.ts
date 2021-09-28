import { Config, ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { type } from 'os';

export type Data = {
  BeforeDate: string;
  Result: string;
};

@Injectable({
  providedIn: 'root',
})
export class MonitorService {
  constructor(private readonly http: HttpClient, private readonly config: ConfigService) {}

  list() {
    return this.http
      .get<Data[]>(`${this.config.config.extension?.monitor?.monitorURL}/list`)
      .toPromise();
  }
}
