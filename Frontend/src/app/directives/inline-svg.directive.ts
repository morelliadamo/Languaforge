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
  @Input() locked: boolean = false;

  constructor(
    private el: ElementRef<HTMLElement>,
    private http: HttpClient,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['src'] && this.src) {
      this.http.get(this.src, { responseType: 'text' }).subscribe({
        next: (svgContent) => {
          const resolved = svgContent.replace(
            /var\(--[\w-]+,\s*([^)]+)\)/g,
            (_, fallback) => fallback.trim(),
          );
          this.el.nativeElement.innerHTML = resolved;
          const svg = this.el.nativeElement.querySelector('svg');
          if (svg) {
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '100%');
          }
          this.applyColor();
        },
        error: () => {
          this.el.nativeElement.innerHTML = '';
        },
      });
    } else if (changes['locked']) {
      this.applyColor();
    }
  }

  private applyColor(): void {
    const svg = this.el.nativeElement.querySelector('svg');
    if (!svg) return;

    if (this.locked) {
      svg.querySelectorAll('[fill]').forEach((el) => {
        const fill = el.getAttribute('fill');
        if (fill && fill !== 'none') {
          el.setAttribute('fill', '#9ca3af');
        }
      });
      svg.querySelectorAll('[stroke]').forEach((el) => {
        const stroke = el.getAttribute('stroke');
        if (stroke && stroke !== 'none') {
          el.setAttribute('stroke', '#9ca3af');
        }
      });
      svg.querySelectorAll('style').forEach((styleEl) => {
        styleEl.textContent =
          styleEl.textContent?.replace(
            /#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)/g,
            '#9ca3af',
          ) ?? '';
      });
    }
  }
}
