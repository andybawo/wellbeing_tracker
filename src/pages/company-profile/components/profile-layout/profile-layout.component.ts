import { Component } from '@angular/core';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-profile-layout',
  standalone: true,
  imports: [ProfileComponent],
  templateUrl: './profile-layout.component.html',
  styleUrls: ['./profile-layout.component.scss']
})

export class ProfileLayoutComponent {

}
