import { Component } from '@angular/core';

import { IonHeader, IonToolbar, IonTitle, IonContent,
   IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'], 
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, 
    IonCard, IonCardContent, IonCardHeader, IonCardTitle],})
    
    export class Tab1Page {

    constructor() {};
  }