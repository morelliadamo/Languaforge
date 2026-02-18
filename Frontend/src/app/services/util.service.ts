import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  stringToColor(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    const h = Math.abs(hash) % 360;
    const s = 75 + (Math.abs(hash >> 8) % 16);
    const l = 55 + (Math.abs(hash >> 12) % 16);

    return `hsl(${h}, ${s}%, ${l}%)`;
  }
}
