import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface UploadResult {
  url: string;
  filename: string;
}

export class UploadService {
  private uploadDir: string;
  private maxFileSize: number;
  private allowedMimeTypes: string[];

  constructor() {
    this.uploadDir = process.env.UPLOAD_DIR || './uploads';
    this.maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '5242880'); // 5MB
    this.allowedMimeTypes = (process.env.ALLOWED_MIME_TYPES || 'image/png,image/jpeg,image/jpg').split(',');
  }

  async initialize(): Promise<void> {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  validateFile(file: Express.Multer.File): void {
    // Check file size
    if (file.size > this.maxFileSize) {
      throw new Error(`File size exceeds maximum allowed size of ${this.maxFileSize / 1024 / 1024}MB`);
    }

    // Check mime type
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new Error(`File type ${file.mimetype} is not allowed. Allowed types: ${this.allowedMimeTypes.join(', ')}`);
    }
  }

  generateUniqueFilename(originalFilename: string): string {
    const ext = path.extname(originalFilename);
    const uniqueName = `${uuidv4()}${ext}`;
    return uniqueName;
  }

  getFileUrl(filename: string): string {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/uploads/${filename}`;
  }

  getFilePath(filename: string): string {
    return path.join(this.uploadDir, filename);
  }

  async deleteFile(filename: string): Promise<void> {
    const filePath = this.getFilePath(filename);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      // File doesn't exist or already deleted
      console.error('Error deleting file:', error);
    }
  }
}
