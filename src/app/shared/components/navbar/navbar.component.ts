import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataService } from '../../../core/services/data.service';
import { SignupComponent } from '../../../../pages/signup/signup.component';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  userFullName: string = 'Loading....';

  constructor(private dataService: DataService) {}

  ngOnInit() {
    const userData = this.dataService.getUserData();
    this.userFullName = userData?.fullName || 'Unknown User';
  }
}
