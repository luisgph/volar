import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() {
  }

  reverseString(str) {
    return str.split("").reverse().join("");
  }

  encodeString(str) {
    return this.reverseString(btoa(btoa(this.reverseString(btoa(str)))));
  }

  decodeString(str) {
    return atob(this.reverseString(atob(atob(this.reverseString(str)))));
  }

  getuserData() {
    if (localStorage.getItem('n53rd@t@')) {
      return JSON.parse(this.decodeString(localStorage.getItem('n53rd@t@')));
    } else {
      return null;
    }
  }

  getSkill() {
    if (localStorage.getItem('3zk!11')) {
      return JSON.parse(this.decodeString(localStorage.getItem('3zk!11')));
    } else {
      return null;
    }
  }


  getUserDataEncoded() {
    return localStorage.getItem('n53rd@t@');
  }

  getSkillEncoded() {
    return localStorage.getItem('3zk!11');
  }

  getMsalToken() {
    return localStorage.getItem('msal.idtoken');
  }

  setUserData(value) {
    return localStorage.setItem('n53rd@t@', value);
  }

  setSkill(value) {
    return localStorage.setItem('3zk!11', value);
  }

  setMsalToken(value) {
    return localStorage.setItem('msal.idtoken', value);
  }

  setOrigen(value) {
    return localStorage.setItem('origen', value);
  }

  getOrigen() {
    return localStorage.getItem('origen');
  }

  setDatosInconcert(value) {
    return localStorage.setItem('datosInconcert', value);
  }

  getDatosInconcert() {
    return localStorage.getItem('datosInconcert');
  }

  setCuenta(value) {
    return localStorage.setItem('cuenta', value);
  }

  getCuenta() {
    return localStorage.getItem('cuenta');
  }

  setCorreo(value) {
    return localStorage.setItem('correo', value);
  }

  getCorreo() {
    return localStorage.getItem('correo');
  }

}
