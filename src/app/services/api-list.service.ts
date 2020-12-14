import { Injectable } from '@angular/core';
import { HttpBaseService } from './http-base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiListService {
  constructor(public http : HttpBaseService) {}

      public getListLanguages(): Observable<any> {
        return this.http.get('Lenguage/GetListLenguages');
      }

      public getListCarriers(): Observable<any> {
        return this.http.get('Carrier/GetListCarrier');
      }

      public getListCampaign(): Observable<any> {
        return this.http.get('Campaign/GetListCampaign');
      }

      public getListFranchise(): Observable<any> {
        return this.http.get('PaymentMethod/GetListFranchise');
      }

      public getListPayment(): Observable<any> {
        return this.http.get('PaymentMethod/GetListPaymentMethod');
      }

      public getListCountry(): Observable<any> {
        return this.http.get('Country/GetListCountry');
      }

      public getListCity( params: any ): Observable<any> {
        return this.http.get('Country/GetListCity', params);
      }

      public getListStations( params: any ): Observable<any> {
        return this.http.get('Stations/GetListStations', params);
      }

      public getListDetailCampaign( params : any ): Observable<any> {
        return this.http.get('Campaign/GetDetailCampaign', params);
      }

      public getListDestinationCampaign( ): Observable<any> {
        return this.http.get('Campaign/GetDestinationCampaign');
      }
}