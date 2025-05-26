import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  userFullName: string = 'Loading....';

  constructor(private dataService: DataService) {}

  ngOnInit() {
    const userData = this.dataService.getUserData();
    this.userFullName = userData?.fullName || 'Unknown User';
  }
}
