import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
export class PersonService {
  _name: string;
  _email: string;
  _choiced: string;
  constructor(name: string = '', email: string = '') {this._email = email; this._name = name; this._choiced = ''}
}
