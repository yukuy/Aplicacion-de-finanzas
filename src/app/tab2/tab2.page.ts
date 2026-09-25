import { Component } from '@angular/core';

import { IonHeader, IonToolbar, IonTitle, IonContent, 
  IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonButton,
   IonItem, IonSelect, IonSelectOption, IonInput, IonIcon } from '@ionic/angular';

import { addIcons } from 'ionicons';

import { 
   addCircleOutline,
  listOutline,
  createOutline,
  trashOutline
} from 'ionicons/icons';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent,
     IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonButton,
      IonItem, IonSelect, IonSelectOption, IonInput, IonIcon],})

     export class Tab2Page {
      
      //CONTROL DE FORMULARIO
      
      //controla si el formulario es visibl  o no
      mostrarFormulario = false;

      //método para abrir el formulario
      abrirFormulario() {
        this.mostrarFormulario = true;
      }//

      constructor() {}
}