import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'image_upload';
  selectedFile: File | null = null;
  errorMessage: string = '';
  failedToUploadImage: boolean = false;
  successfullyUploaded: boolean = false;
  successMessage: string = '';
  URL: string = 'http://localhost:3000/';
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected = (event: any) => {
    const inputFile = event?.target as HTMLInputElement;

    if (inputFile.files && inputFile.files.length > 0) {
      this.selectedFile = inputFile.files[0];
      console.log(this.selectedFile);

      this.previewImage();
    }
  };

  uploadToLocal = () => {
    if (!this.selectedFile) {
      this.failedToUploadImage = true;
      this.errorMessage = 'No file selected!';
      console.error('No file selected!');
    }

    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    } else {
      console.error('No file selected');
    }

    this.http
      .post<any>(`${this.URL}upload-image-disk`, formData)
      .subscribe((response) => {
        console.log('Image upload successfully. ', response);
        this.successfullyUploaded = true;
        this.successMessage = 'Uploaded to store!';
        this.selectedFile = null;
      });
  };

  uploadToS3 = () => {
    if (!this.selectedFile) {
      this.failedToUploadImage = true;
      this.errorMessage = 'No file selected!';
      console.error('No file selected!');
    }

    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
      this.selectedFile = null;
    } else {
      console.error('No file selected');
    }

    this.http.post<any>(`${this.URL}upload`, formData).subscribe((response) => {
      this.successfullyUploaded = true;
      this.successMessage = 'Uploaded to store!';
      console.log('Image upload successfully. ', response);
    });
  };

  private previewImage = () => {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
    };

    reader.readAsDataURL(this.selectedFile!);
  };
}
