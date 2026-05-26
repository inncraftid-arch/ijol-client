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

const formatFileSize = (bytes: number) => {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileDebugLabel = (file: File) =>
  `${file.name || 'foto'} (${file.type || 'tanpa tipe'}, ${formatFileSize(file.size)})`;

export const uploadFileDirectToAws = async ({
  file,
  folder,
}: UploadFileParams): Promise<AwsUploadResult> => {
  let presignedUpload: PresignedUploadResponse;
  const fileLabel = getFileDebugLabel(file);

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
      `Gagal meminta upload URL. Detail: ${fileLabel}. ${
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
      `Gagal upload ke AWS. Detail: ${fileLabel}. ${
        error instanceof Error ? error.message : 'Request gagal.'
      }`,
      { cause: error }
    );
  }

  if (!response.ok) {
    throw new Error(`Upload ke AWS gagal. Detail: ${fileLabel}. Status S3: ${response.status}.`);
  }

  return {
    key: presignedUpload.key,
    publicUrl: presignedUpload.publicUrl,
    fileName: file.name,
    fileSize: file.size,
    contentType: file.type || 'application/octet-stream',
  };
};
