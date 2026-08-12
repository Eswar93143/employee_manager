import { Component } from '@angular/core';

@Component({
  selector: 'app-image-test',
  imports: [],
  templateUrl: './image-test.html',
  styleUrl: './image-test.scss',
})
export class ImageTest {
    selectedFile: File | null = null;
  fileName = '';
  imagePreview: string | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    // Optional validation
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

        this.selectedFile = file;
    this.fileName = file.name;

    // Create preview
    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.selectedFile = null;
    this.fileName = '';
    this.imagePreview = null;
  }
}
