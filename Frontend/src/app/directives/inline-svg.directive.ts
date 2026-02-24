import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Directive({
  selector: '[appInlineSvg]',
  standalone: true,
})
export class InlineSvgDirective implements OnChanges {
  @Input('appInlineSvg') src: string = '';
  @Input() svgColor: string = '';

  constructor(
    private el: ElementRef<HTMLElement>,
    private http: HttpClient,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['src'] || changes['svgColor']) && this.src) {
      this.http.get(this.src, { responseType: 'text' }).subscribe({
        next: (svgContent) => {
          this.el.nativeElement.innerHTML = svgContent;
          const svg = this.el.nativeElement.querySelector('svg');
          if (svg) {
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '100%');

            const color = this.svgColor || 'currentColor';

            svg.querySelectorAll('[fill]').forEach((el) => {
              const fill = el.getAttribute('fill');
              if (fill && fill !== 'none') {
                el.setAttribute('fill', color);
              }
            });
            svg.querySelectorAll('[stroke]').forEach((el) => {
              const stroke = el.getAttribute('stroke');
              if (stroke && stroke !== 'none') {
                el.setAttribute('stroke', color);
              }
            });
          }
        },
        error: () => {
          this.el.nativeElement.innerHTML = '';
        },
      });
    }
  }
}
