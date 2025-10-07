import { Component, Input, OnInit } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-insytha-skeleton-loader',
  imports: [NgxSkeletonLoaderModule],
  templateUrl: './insytha-skeleton-loader.component.html',
  styleUrl: './insytha-skeleton-loader.component.scss',
})
export class InsythaSkeletonLoaderComponent implements OnInit {
  @Input('count') count: number = 1;
  @Input('appearance') appearance: 'circle' | 'line' = 'line';
  @Input('animation') animation: 'progress' | 'progress-dark' | 'pulse' =
    'pulse';
  @Input('width') width: string = '100%';
  @Input('height') height: string = '1rem';
  @Input('border_radius') 'border_radius': string = '';
  @Input('border') border: string = '1px solid white';
  @Input('background_color') 'background_color': string = '';
  @Input('margin_bottom') 'margin_bottom': string = '1rem';

  constructor() {}

  ngOnInit(): void {}
}
