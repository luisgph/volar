import { Injectable } from '@angular/core';
import { HttpBaseService } from './http-base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DispositionService {
  constructor(public http : HttpBaseService) {}

  public postSave(params : any): Observable<any> {
    return this.http.post('Disposition/Save', params);
  }
}