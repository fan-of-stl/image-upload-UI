import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

/**
 * AppComponent represents the main component of the image upload application.
 * @class
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  /** The title of the application. */
  title = 'image_upload';

  /** The currently selected file. */
  selectedFile: File | null = null;

  /** Error message to display if the image upload fails. */
  errorMessage: string = '';

  /** Flag indicating whether the image upload has failed. */
  failedToUploadImage: boolean = false;

  /** Flag indicating whether the image upload is successful. */
  successfullyUploaded: boolean = false;

  /** Success message to display upon successful image upload. */
  successMessage: string = '';

  /** URL of the backend server. */
  URL: string = 'http://localhost:3000/';

  /** Base64 encoded image preview. */
  imagePreview: string | ArrayBuffer | null = null;

  /**
   * Constructor to create an instance of the AppComponent.
   * @constructor
   * @param {HttpClient} http - Angular HTTP client for making HTTP requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * Handles the file selection event.
   * @method
   * @param {any} event - The file selection event.
   */
  onFileSelected = (event: any) => {
    const inputFile = event?.target as HTMLInputElement;

    if (inputFile.files && inputFile.files.length > 0) {
      this.selectedFile = inputFile.files[0];
      console.log(this.selectedFile);

      this.previewImage();
    }
  };

  /**
   * Uploads the selected file to the local server.
   * @method
   */
  uploadToLocal = () => {
    if (!this.selectedFile) {
      this.failedToUploadImage = true;
      this.errorMessage = 'No file selected!';
      console.error('No file selected!');
      return;
    }

    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    } else {
      console.error('No file selected');
    }

    this.http.post<any>(`${this.URL}upload-image-disk`, formData).subscribe(
      (response) => {
        console.log('Image upload successfully. ', response);
        this.successfullyUploaded = true;
        this.successMessage = 'Uploaded to store!';
        this.selectedFile = null;
      },
      (error) => {
        this.failedToUploadImage = true;
        this.errorMessage =
          'Failed to connect to the backend. Please try again or check backend connection once.';
        console.error('Failed to connect to the backend. ', error);
      }
    );
  };

  /**
   * Uploads the selected file to the S3 cloud.
   * @method
   */
  uploadToS3 = () => {
    if (!this.selectedFile) {
      this.failedToUploadImage = true;
      this.errorMessage = 'No file selected!';
      console.error('No file selected!');
      return;
    }

    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
      this.selectedFile = null;
    } else {
      console.error('No file selected');
    }

    this.http.post<any>(`${this.URL}upload`, formData).subscribe(
      (response) => {
        this.successfullyUploaded = true;
        this.successMessage = 'Uploaded to store!';
        console.log('Image upload successfully. ', response);
      },
      (error) => {
        this.failedToUploadImage = true;
        this.errorMessage =
          'Failed to connect to the backend. Please try again or check backend connection once.';
        console.error('Failed to connect to the backend. ', error);
      }
    );
  };

  /**
   * Previews the selected image.
   * @private
   * @method
   */
  private previewImage = () => {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
    };

    reader.readAsDataURL(this.selectedFile!);
  };
}
