import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private http: HttpClient) { }

  async getToken() {
    let result = false;
    let params = new HttpParams().set("applicationName", environment.APP_NAME).set("applicationId", environment.APP_ID);
    await this.http.post(environment.API_ZEUS_URL + "Authorized/UserAuth", params).toPromise().then(data => {
      if (data["status"] == "Authorized") {
        result = true;
        localStorage.setItem('requestT', data["token"])
      }
    });
    return result;
  }
}
