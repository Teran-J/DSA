import { Request, Response } from 'express';
import { UploadService } from '../../application/services/UploadService';

export class UploadController {
  private uploadService: UploadService;

  constructor() {
    this.uploadService = new UploadService();
  }

  upload = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      this.uploadService.validateFile(req.file);

      const url = this.uploadService.getFileUrl(req.file.filename);

      res.status(200).json({
        url,
        filename: req.file.filename,
      });
    } catch (error) {
      // Delete uploaded file if validation fails
      if (req.file) {
        await this.uploadService.deleteFile(req.file.filename);
      }

      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
