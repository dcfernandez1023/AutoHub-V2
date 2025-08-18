import { Request } from 'express';

const busboy = require('busboy');

type FileInfo = {
  filename: string;
  mimeType: string;
};

type FileBufferResult = {
  buffer: Buffer;
  filename: string;
  mimeType: string;
};

export const decodedSizeFromBase64 = (base64: string | undefined) => {
  if (!base64) {
    return 0;
  }
  return Buffer.from(base64.split(',')[1] ?? base64, 'base64').length;
};

export const getFileBuffer = (req: Request): Promise<FileBufferResult> => {
  return new Promise((resolve, reject) => {
    const bb = busboy({ headers: req.headers });

    let fileFound = false;

    bb.on('file', (fieldname: string, file: NodeJS.ReadableStream, info: FileInfo) => {
      fileFound = true;
      const { filename, mimeType } = info;
      const chunks: Buffer[] = [];

      file.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      file.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve({ buffer, filename, mimeType });
      });

      file.on('error', reject);
    });

    bb.on('finish', () => {
      if (!fileFound) {
        reject(new Error('No file found in the request'));
      }
    });

    bb.on('error', reject);

    req.pipe(bb);
  });
};
