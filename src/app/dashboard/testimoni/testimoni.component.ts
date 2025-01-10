import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Notyf } from 'notyf';
import { DashboardService, DashboardServiceType } from 'src/app/dashboard.service';

@Component({
  selector: 'wc-testimoni',
  templateUrl: './testimoni.component.html',
  styleUrls: ['./testimoni.component.scss']
})
export class TestimoniComponent implements OnInit {
  reviewForm!: FormGroup;
  private notyf: Notyf;

  constructor(private dashboardService: DashboardService) {
    this.notyf = new Notyf({
      duration: 3000,
      position: {
        x: 'right',
        y: 'top'
      }
    });
  }

  ngOnInit(): void {
    // Initialize the form
    this.reviewForm = new FormGroup({
      province: new FormControl(''),
      city: new FormControl(''),
      review: new FormControl(''),
    });
  }

  onSubmit(): void {
    if (this.reviewForm.valid) {
      // Create FormData instance
      const formData = new FormData();
      formData.append('provinsi', this.reviewForm.get('province')?.value);
      formData.append('kota', this.reviewForm.get('city')?.value);
      formData.append('ulasan', this.reviewForm.get('review')?.value);

      // Call the service to send data
      this.dashboardService.create(DashboardServiceType.USER_TESTEMONI, formData).subscribe(
        (response) => {
          const message = response?.Message || 'Review submitted successfully!';
          this.notyf.success(message);
          console.log('Response:', response); // Debug log
        },
        (error) => {
          console.error('Error:', error);
          this.notyf.error('Operation failed!');
        }
      );
      
    } else {
      console.log('Form is invalid');
      this.notyf.error('Please fill in all required fields.');
    }
  }
}
