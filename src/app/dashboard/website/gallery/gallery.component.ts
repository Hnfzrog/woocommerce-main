import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wc-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  uploadStatus: string | null = null;

  constructor() { }

  ngOnInit(): void {
  }

  // Open file dialog when browse button is clicked
  browseFiles() {
    document.getElementById('fileInput')?.click();
  }

  // Handle file selection from file dialog
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.uploadFile(file);
    }
  }

  // Prevent default behavior when dragging over the upload box
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  // Handle file drop into the upload box
  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
      const file = event.dataTransfer.files[0];
      this.uploadFile(file);
    }
  }

  // Upload file logic (stub for demonstration)
  uploadFile(file: File) {
    console.log('File selected:', file);
    // Simulate upload and set upload status
    setTimeout(() => {
      this.uploadStatus = `File "${file.name}" uploaded successfully.`;
    }, 1000); // Simulating an upload delay
  }
}
