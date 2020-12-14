import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";
import { LocalStorageService } from "./services/local-storage.service";

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private localStorage: LocalStorageService, private router: Router, private jwt: JwtHelperService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    //this.limpiarLocalStorage();
    if (route.queryParams['origen'] != undefined && route.queryParams['origen'] == "zeus") {
      if (route.queryParams['param1'] != undefined) {
        this.localStorage.setMsalToken(route.queryParams['param1']);
        if (route.queryParams['param2'] != undefined && route.queryParams['param3'] != undefined && route.queryParams['origen'] != undefined) {
          this.setLocalStorageOrigenZeus(route);
        }
      }
      let msal_token = this.localStorage.getMsalToken();
      if (this.jwt.isTokenExpired(msal_token) == true) {
        this.router.navigate(['/notauthorized']);
      }
      return true;
    } else if (route.queryParams['origen'] != undefined && route.queryParams['origen'] == "avaya") {
      this.setLocalStorageOrigenInconcert(route);
      return true;
    } else {
      return false;
    }
  }
  setLocalStorageOrigenInconcert(route: ActivatedRouteSnapshot) {
    let tempDatosInconcert = JSON.stringify(route.queryParams);
    this.localStorage.setDatosInconcert(tempDatosInconcert);
    this.localStorage.setOrigen(route.queryParams['origen']);
  }
  setLocalStorageOrigenZeus(route) {
    this.localStorage.setUserData(route.queryParams['param2']);
    this.localStorage.setSkill(route.queryParams['param3']);
    this.localStorage.setOrigen(route.queryParams['origen']);
  }

  limpiarLocalStorage() {
    this.localStorage.setUserData("");
    this.localStorage.setSkill("");
    this.localStorage.setMsalToken("");
    this.localStorage.setDatosInconcert("");
  }
}
