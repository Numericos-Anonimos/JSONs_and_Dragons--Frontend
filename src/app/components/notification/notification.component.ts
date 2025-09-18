import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.less'
})
export class NotificationComponent {
  @Input() notificationTitle: string = "";
  @Input() notificationBody: string = "";
  @Input() notificationType: number = 0;
}