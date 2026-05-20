import { clientEnv } from '../config/env';
import { invokeSupabaseFunction } from './clientSupabase';

export type AwsUploadResult = {
  key: string;
  publicUrl: string;
  fileName: string;
  fileSize: number;
  contentType: string;
};

type PresignedUploadResponse = {
  uploadUrl: string;
  publicUrl: string;
  key: string;
  headers?: Record<string, string>;
};

type UploadFileParams = {
  file: File;
  folder: string;
};

export const uploadFileDirectToAws = async ({
  file,
  folder,
}: UploadFileParams): Promise<AwsUploadResult> => {
  let presignedUpload: PresignedUploadResponse;

  try {
    presignedUpload = await invokeSupabaseFunction<PresignedUploadResponse>(
      clientEnv.awsUploadFunction,
      {
        fileName: file.name,
        contentType: file.type || 'application/octet-stream',
        fileSize: file.size,
        folder,
      }
    );
  } catch (error) {
    throw new Error(
      `Gagal meminta upload URL untuk ${file.name}: ${
        error instanceof Error ? error.message : 'Request gagal.'
      }`,
      { cause: error }
    );
  }

  let response: Response;

  try {
    response = await fetch(presignedUpload.uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
        ...(presignedUpload.headers || {}),
      },
      body: file,
    });
  } catch (error) {
    throw new Error(
      `Gagal upload ${file.name} ke AWS. Cek CORS bucket S3 dan URL bucket: ${
        error instanceof Error ? error.message : 'Request gagal.'
      }`,
      { cause: error }
    );
  }

  if (!response.ok) {
    throw new Error(`Upload ${file.name} ke AWS gagal.`);
  }

  return {
    key: presignedUpload.key,
    publicUrl: presignedUpload.publicUrl,
    fileName: file.name,
    fileSize: file.size,
    contentType: file.type || 'application/octet-stream',
  };
};
