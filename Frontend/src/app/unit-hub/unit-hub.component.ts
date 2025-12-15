import {Component, inject, OnInit} from '@angular/core';
import {CourseLoaderServiceService} from '../services/course-loader-service.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AuthServiceService} from '../services/auth-service.service';
import {Unit} from '../interfaces/Unit';
import {HeaderComponent} from '../header/header.component';
import {FooterComponent} from '../footer/footer.component';
import {UnitCardComponent} from '../unit-card/unit-card.component';
import {NgForOf} from '@angular/common';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-unit-hub',
  imports: [
    HeaderComponent,
    FooterComponent,
    UnitCardComponent,
    NgForOf,
    RouterLink
  ],
  templateUrl: './unit-hub.component.html',
  styleUrl: './unit-hub.component.css'
})
export class UnitHubComponent implements OnInit{


    units: Unit[] = [];
    courseId: number = 0;

    private route = inject(ActivatedRoute);
    private router=  inject(Router);
    private courseLoader = inject(CourseLoaderServiceService);
    private authService = inject(AuthServiceService);


    ngOnInit() {
      this.route.params.subscribe(params => {
        this.courseId = +params['id'];
        this.loadUnits();
      });
    }

    loadUnits(){
      const username = this.authService.getUserName() || "";
      this.courseLoader.loadCourseUnits(username, this.courseId).subscribe({
        next: (units: Unit[]) => {
          this.units = units;
          console.log("Units loaded:", units);
        },
        error: (err: HttpErrorResponse) => {
          console.error("Error loading units:", err);
          alert("An error occurred while loading the units. Please try again later.");
          if(err.status === 401 || err.status === 403){
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
      });
    }


    colorFromUnitName(): string{
      const colors = ['#4A90E2', '#50E3C2', '#F5A623', '#D0021B', '#9013FE'];
      const index = this.courseId % colors.length;
      return colors[index];
    }

}
