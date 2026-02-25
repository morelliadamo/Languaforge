import { Injectable } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
import { rxStompConfig } from '../core/config/rx-stomp.config';
@Injectable({
  providedIn: 'root',
})
export class RxStompService extends RxStomp {
  constructor() {
    super();
    this.configure(rxStompConfig);

    this.activate();
  }

  public safeActivate(): void {
    if (!this.active) {
      this.activate();
    }
  }

  public safeDeactivate(): void {
    if (this.active) {
      this.deactivate();
    }
  }
}
