import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { AdminDataManagement } from '../admin-data-management/admin-data-management';
import { AdminUserSettings } from '../admin-user-settings/admin-user-settings';

@Component({
  selector: 'app-admin-hub',
  imports: [
    HeaderComponent,
    FooterComponent,
    AdminDataManagement,
    AdminUserSettings,
  ],
  templateUrl: './admin-hub.html',
  styleUrl: './admin-hub.css',
})
export class AdminHub {
  userSettingsActivated: boolean = false;
  dataManagementActivated: boolean = false;

  openUserSettings() {
    this.userSettingsActivated = true;
  }
  openDataManagement() {
    this.dataManagementActivated = true;
  }
}
