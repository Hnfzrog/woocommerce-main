import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-generate-undangan',
  templateUrl: './generate-undangan.component.html',
  styleUrls: ['./generate-undangan.component.scss'],
})
export class GenerateUndanganComponent implements OnInit {
  currentStep: number = 1; // Tracks the current step
  totalSteps: number = 3; // Total number of steps

  // Form Data
  formData = {
    paket: '',
    groom: { fullName: '', fatherName: '', motherName: '' },
    bride: { fullName: '', fatherName: '', motherName: '' },
  };

  stories = [{ date: '', title: '', content: '' }];

  constructor() {}

  ngOnInit(): void {}

  // Progress percentage for the progress bar
  get progressPercentage(): string {
    return ((this.currentStep / this.totalSteps) * 100).toFixed(0) + '%';
  }

  // Navigation methods
  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    } else {
      console.log('Form submitted:', this.formData, this.stories);
    }
  }

  addStory() {
    if (this.stories.length < 10) {
      this.stories.push({ date: '', title: '', content: '' });
    } else {
      alert('Maksimal 10 cerita!');
    }
  }

  removeStory(index: number) {
    if (index > 0) {
      this.stories.splice(index, 1);
    }
  }
}
