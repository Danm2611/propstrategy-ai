import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

// Check if S3 is configured
const isS3Configured = process.env.AWS_ACCESS_KEY_ID && 
                      process.env.AWS_SECRET_ACCESS_KEY && 
                      process.env.AWS_S3_BUCKET

// Initialize S3 client if configured
const s3Client = isS3Configured ? new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  // For R2, use custom endpoint
  ...(process.env.R2_ENDPOINT && {
    endpoint: process.env.R2_ENDPOINT,
  })
}) : null

export interface UploadResult {
  url: string
  key: string
  size: number
  type: string
}

/**
 * Upload a file to S3/R2 or local storage
 */
export async function uploadFile(
  file: File | Buffer,
  options: {
    folder?: string
    fileName?: string
    contentType?: string
  } = {}
): Promise<UploadResult> {
  const { folder = 'uploads', fileName, contentType } = options

  // Generate unique filename if not provided
  const uniqueId = crypto.randomBytes(16).toString('hex')
  const fileExt = fileName ? path.extname(fileName) : '.bin'
  const finalFileName = fileName || `${uniqueId}${fileExt}`
  const key = `${folder}/${finalFileName}`

  // Get file buffer
  const buffer = file instanceof File 
    ? Buffer.from(await file.arrayBuffer())
    : file

  if (s3Client) {
    // Upload to S3/R2
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
      Body: buffer,
      ContentType: contentType || 'application/octet-stream',
    })

    await s3Client.send(command)

    // Return public URL or generate signed URL
    const url = process.env.AWS_S3_PUBLIC_URL 
      ? `${process.env.AWS_S3_PUBLIC_URL}/${key}`
      : await getSignedUrl(s3Client, command, { expiresIn: 3600 * 24 * 7 }) // 7 days

    return {
      url,
      key,
      size: buffer.length,
      type: contentType || 'application/octet-stream',
    }
  } else {
    // Fallback to local storage
    const uploadsDir = path.join(process.cwd(), 'public', folder)
    await fs.mkdir(uploadsDir, { recursive: true })

    const filePath = path.join(uploadsDir, finalFileName)
    await fs.writeFile(filePath, buffer)

    return {
      url: `/${folder}/${finalFileName}`,
      key,
      size: buffer.length,
      type: contentType || 'application/octet-stream',
    }
  }
}

/**
 * Delete a file from S3/R2 or local storage
 */
export async function deleteFile(key: string): Promise<void> {
  if (s3Client) {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
    })
    await s3Client.send(command)
  } else {
    // Delete from local storage
    const filePath = path.join(process.cwd(), 'public', key)
    try {
      await fs.unlink(filePath)
    } catch (error) {
      // Ignore if file doesn't exist
      if ((error as any).code !== 'ENOENT') {
        throw error
      }
    }
  }
}

/**
 * Get a signed URL for temporary access (S3/R2 only)
 */
export async function getSignedDownloadUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  if (!s3Client) {
    // Return local URL
    return `/${key}`
  }

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
  })

  return getSignedUrl(s3Client, command, { expiresIn })
}

/**
 * Upload multiple files
 */
export async function uploadFiles(
  files: File[],
  options: {
    folder?: string
    maxSize?: number // in bytes
    allowedTypes?: string[]
  } = {}
): Promise<UploadResult[]> {
  const { maxSize = 10 * 1024 * 1024, allowedTypes } = options // 10MB default

  const uploadPromises = files.map(async (file) => {
    // Validate file size
    if (file.size > maxSize) {
      throw new Error(`File ${file.name} exceeds maximum size of ${maxSize} bytes`)
    }

    // Validate file type
    if (allowedTypes && !allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed`)
    }

    return uploadFile(file, {
      folder: options.folder,
      fileName: file.name,
      contentType: file.type,
    })
  })

  return Promise.all(uploadPromises)
}