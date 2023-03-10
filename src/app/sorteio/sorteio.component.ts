import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { environment } from 'src/enviroment/environment';
import { PersonService } from '../person.service';

@Component({
  selector: 'app-sorteio',
  templateUrl: './sorteio.component.html',
  styleUrls: ['./sorteio.component.css']
})
export class SorteioComponent {
  people: PersonService[] = [];
  sortType: string = 'Amigo Secreto';
  showQuantityError: boolean = false;
  showEmptyError: boolean = false;
  checkoutForm = this.formBuilder.group({
    name: '',
    email: ''
  });
  constructor(
    private formBuilder: FormBuilder,
  ) { }
  onSubmit() {
    if (this.checkoutForm.value.name! !== '' && this.checkoutForm.value.email! !== '') {
      this.people.push({ '_name': this.checkoutForm.value.name!, '_email': this.checkoutForm.value.email!, '_choiced': '' });
      console.log(this.people.length, this.checkoutForm.value.name!);
      this.showEmptyError = false;
    }
    else
      this.showEmptyError = true;
    this.checkoutForm.reset({ 'name': '', 'email': '' });
  }
  makeSortition() {
    let peopleAlreadyChoice:string[] = [];
    if (this.people.length % 2 != 0) {
      this.showQuantityError = true;
      return;
    }
    this.showQuantityError = false;
    for (let p of this.people) {
      while (true) {
        var personChoice: number = Math.floor(Math.random() * this.people.length);
        if (!(peopleAlreadyChoice.includes(this.people[personChoice]._name)) && p._name !== this.people[personChoice]._name)
          break;
      }
      p._choiced = this.people[personChoice]._name;
      peopleAlreadyChoice.push(this.people[personChoice]._name);
      // console.log(p._name, 'vai presentear', p._choiced);
      this.sendEmail(p);
      
    }
  }

  sendEmail(person: PersonService) {
    const axios = require("axios");
    const text:string = "Olá " + person._name + ", você tirou " + person._choiced + " para presentear no " + this.sortType + ". O evento acontecera dia 31/12, e não se preocupe com valor, o objetivo é ser algo simbólico, não gaste muito (max 50 reias). Não vai se atrasar."
    const options = {
      method: 'POST',
      url: 'https://rapidprod-sendgrid-v1.p.rapidapi.com/mail/send',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': `${environment.API_KEY}`,
        'X-RapidAPI-Host': 'rapidprod-sendgrid-v1.p.rapidapi.com',
      },
      data: `{"personalizations":[{"to":[{"email":"${person._email}"}],"subject":"${this.sortType.toUpperCase()}!"}],"from":{"email":"${environment.EMAIL_HOST}"},"content":[{"type":"text/plain","value":"${text}"}]}`
    };
    
    axios.request(options).then(function (response: any) {
      console.log(response.data);
    }).catch(function (error: any) {
      console.error(error);
    });
  }

  cleanStorage(){
    this.people = [];
  }

  change(){
    if(this.sortType === 'Amigo Secreto')
      this.sortType = 'Amigo da onça';
    else
      this.sortType = 'Amigo Secreto';
  }
}
