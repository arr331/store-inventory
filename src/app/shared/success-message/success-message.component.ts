import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-success-message',
  templateUrl: './success-message.component.html',
  styleUrls: ['./success-message.component.scss']
})
export class SuccessMessageComponent {
  @Input() visible: boolean = false;   // Se activa desde fuera
  @Input() message: string = 'Venta guardada'; // Texto personalizable

}
