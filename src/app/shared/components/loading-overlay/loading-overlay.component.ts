import { Component, Input, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-overlay.component.html',
  styleUrl: './loading-overlay.component.less'
})
export class LoadingOverlayComponent {
    
  @Input('isLoading') isLoading: boolean = true;
  @Input('loadingText') loadingText: string = "Por favor, aguarde";

  constructor(
    private router: Router
  ) {}
}