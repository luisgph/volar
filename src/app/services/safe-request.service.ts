import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TokenService } from "./token.service";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class SafeRequestService {
  helper = new JwtHelperService();
  getCampanias: string = "Campaign/GetCampaignsByAccount/";
  getArbol: string = "DispositionTree/GetDispositionTreeByAccountAndCampaign";
  getAgent: string = "Agent/GetInfo";

  saveDisposition: string = "Disposition/Save";
  reportSave:string="ReportDisposition/GenerateDispositionReport";
  getReportsList:string="ReportDisposition/GetListReports";
  getFlightInformation: string = "Disposition/GetAditionalInformation";

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  async generateRequest(security: any, api_url: any, endpoint: any, metodo: any, parametros: any, headers = {}) {
    var resultadoRequest: any;
    var params: any;
    var httpOptions: any;

    //setear parametros a enviar en peticion
    params = this.setParams(parametros, metodo);

    if (!localStorage.getItem('requestT') && security == true) {
      await this.tokenService.getToken();
    }

    //setear headers
    httpOptions = this.getOptionHTTP(security, headers);

    if (metodo.toLowerCase() == "post") {
      await this.post(api_url, endpoint, params, httpOptions).then(async res => {
        if (res.status != 'ok' && security == true) {
          let verifyError: any;
          await this.verifyError(res.statuscode).then(res => {
            verifyError = res;
          });
          if (verifyError) {
            httpOptions = this.getOptionHTTP(security, {});
            resultadoRequest = await this.post(api_url, endpoint, params, httpOptions);
          } else {
            resultadoRequest = res;
          }
        } else {
          resultadoRequest = res;
        }
      });
      return resultadoRequest;
    }

    if (metodo.toLowerCase() == "get") {
      await this.get(api_url, endpoint, params, httpOptions).then(async res => {
        if (res.status != 'ok' && security == true) {
          let verifyError: any;
          await this.verifyError(res.statuscode).then(res => {
            verifyError = res;
          });
          if (verifyError) {
            httpOptions = this.getOptionHTTP(security, {});
            resultadoRequest = await this.get(api_url, endpoint, params, httpOptions);
          } else {
            resultadoRequest = res;
          }
        } else {
          resultadoRequest = res;
        }
      });

      return resultadoRequest;
    }
    return resultadoRequest;
  }

  async generateRequestFile(security: any, api_url: any, endpoint: any, parametros: any) {
    var resultadoRequest: any;
    var params: any;
    var httpOptions: any;
    var tokendata: any;

    //setear parametros a enviar en peticion
    let data = new FormData();

    if (Object.keys(parametros).length > 0) {
      //httpOptions = {

      /* for (var pr in parametros) {
        data.append("file",parametros[pr]);
      } */
      parametros.forEach(element => {
        data.append("file", element);
      });
    }

    if (!localStorage.getItem('requestT') && security == true) {
      await this.tokenService.getToken();
    }

    //setear headers
    httpOptions = this.getOptionHTTP(security, { 'enctype': 'multipart/form-data' });

    await this.post(api_url, endpoint, data, httpOptions).then(async res => {
      if (res.status != 'ok' && security == true) {
        let verifyError: any;
        await this.verifyError(res.statuscode).then(res => {
          verifyError = res;
        });
        if (verifyError) {
          httpOptions = this.getOptionHTTP(security, { 'enctype': 'multipart/form-data' });
          resultadoRequest = await this.post(api_url, endpoint, data, httpOptions);
        } else {
          resultadoRequest = res;
        }
      } else {
        resultadoRequest = res;
      }
    });

    return resultadoRequest;
  }


  setParams(parametros: any, metodo: any) {
    var params: any;
    if (metodo.toLowerCase() == "post") {
      if (Object.keys(parametros).length > 0) {
        params = new HttpParams();
        for (var propiedad in parametros) {
          params = params.set(propiedad, parametros[propiedad]);
        }
      } else {
        params = null;
      }
    }

    if (metodo.toLowerCase() == "get") {
      params = "";
      if (Object.keys(parametros).length > 0) {
        for (var propiedad in parametros) {
          params += propiedad + "=" + parametros[propiedad] + "&";
        }
      } else {
        params = "";
      }
      params = params.substring(0, params.length - 1);
    }
    return params;
  }

  getOptionHTTP(security: any, headers_p: any) {
    var httpOptions: any;
    var str_headers;
    var httpOptions;


    if (security == true) {
      var tokendata = localStorage.getItem('requestT');
      var headers = new HttpHeaders({
        'Authorization': tokendata
      });

      if (Object.keys(headers_p).length > 0) {
        for (var hd in headers) {
          headers.set(hd, headers_p[hd]);
        }
      }
      httpOptions = {
        headers
      };
    } else {
      httpOptions = {};
    }

    return httpOptions;
  }

  async verifyError(errorStatus: any) {
    let renewToken = false;
    if (errorStatus == 401) {
      let token = localStorage.getItem('requestT');
      var isExpired = this.helper.isTokenExpired(token);
      if (isExpired) {
        await this.tokenService.getToken().then(restoken => {
          renewToken = restoken;
        }, error => {
          renewToken = false;
        }).catch((err: HttpErrorResponse) => {
          renewToken = false;
        });
      }
    }

    return renewToken;
  }

  async post(api_url: any, endpoint: any, params: any, httpOptions: any) {
    let resultado: any;
    await this.http.post(api_url + endpoint, params, httpOptions).toPromise().then(data => {
      if (data != null) {
        resultado = { 'status': 'ok', 'data': data };
      } else {
        resultado = { 'status': 'ok', 'data': [] };
      }
    }, error => {
      resultado = { 'status': 'error', 'statuscode': error.status, 'message': error.message };
    })
      .catch((err: HttpErrorResponse) => {
        resultado = { 'status': 'error', 'statuscode': err.status, 'message': err.message };
      });
    return resultado;
  }

  async get(api_url: any, endpoint: any, params: any, httpOptions: any) {
    let resultado: any;
    params = (params != "") ? "?" + params : params;
    await this.http.get(api_url + endpoint + params, httpOptions).toPromise().then(data => {
      if (data != null) {
        resultado = { 'status': 'ok', 'data': data };
      } else {
        resultado = { 'status': 'ok', 'data': [] };
      }
    }, error => {
      resultado = { 'status': 'error', 'statuscode': error.status, 'message': error.message };
    })
      .catch((err: HttpErrorResponse) => {
        resultado = { 'status': 'error', 'statuscode': err.status, 'message': err.message };
      });
    return resultado;
  }

}
