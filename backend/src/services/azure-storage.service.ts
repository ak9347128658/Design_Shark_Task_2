import { 
  BlobServiceClient, 
  ContainerClient, 
  BlockBlobClient, 
  StorageSharedKeyCredential, 
  BlobSASPermissions 
} from '@azure/storage-blob';
import { IPresignedUrl } from '../types';
import { injectable } from 'tsyringe';

@injectable()
export class AzureStorageService {
  private blobServiceClient: BlobServiceClient;
  private containerClient: ContainerClient;
  private containerName: string;
  private accountName: string;
  private accountKey: string;

  constructor() {
    this.containerName = process.env.AZURE_CONTAINER_NAME || 'uploads';
    this.accountName = process.env.AZURE_ACCOUNT_NAME || '';
    this.accountKey = process.env.AZURE_ACCOUNT_KEY || '';
    
    // Initialize the blob service client
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || '';
    this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    this.containerClient = this.blobServiceClient.getContainerClient(this.containerName);
    
    // Create container if it doesn't exist
    this.initContainer().catch(console.error);
  }

  /**
   * Initialize the blob container if it doesn't exist
   */
  private async initContainer(): Promise<void> {
    if (!await this.containerClient.exists()) {
      await this.containerClient.create();
      console.log(`Container '${this.containerName}' created`);
    }
  }

  /**
   * Get a BlockBlobClient for a specific file path
   */
  private getBlobClient(filePath: string): BlockBlobClient {
    return this.containerClient.getBlockBlobClient(filePath);
  }

  /**
   * Generate a presigned URL for uploading a file
   */
  async getUploadUrl(filePath: string): Promise<IPresignedUrl> {
    const blobClient = this.getBlobClient(filePath);
    
    // Create a SAS URL with write permissions that expires in 24 hours
    const expiresOn = new Date();
    expiresOn.setHours(expiresOn.getHours() + 24);

    // Create a Shared Key Credential
    const sharedKeyCredential = new StorageSharedKeyCredential(
      this.accountName,
      this.accountKey
    );

    // Create BlobSASPermissions object with write and create permissions
    const permissions = new BlobSASPermissions();
    permissions.write = true;
    permissions.create = true;
    
    const sasUrl = await blobClient.generateSasUrl({
      permissions,
      expiresOn
    });

    return {
      url: sasUrl,
      expiresAt: expiresOn
    };
  }

  /**
   * Generate a presigned URL for downloading a file
   */
  async getDownloadUrl(filePath: string): Promise<IPresignedUrl> {
    const blobClient = this.getBlobClient(filePath);
    
    // Create a SAS URL with read permissions that expires in 24 hours
    const expiresOn = new Date();
    expiresOn.setHours(expiresOn.getHours() + 24);

    // Create a Shared Key Credential
    const sharedKeyCredential = new StorageSharedKeyCredential(
      this.accountName,
      this.accountKey
    );

    // Create BlobSASPermissions object with read permission
    const permissions = new BlobSASPermissions();
    permissions.read = true;
    
    const sasUrl = await blobClient.generateSasUrl({
      permissions,
      expiresOn
    });

    return {
      url: sasUrl,
      expiresAt: expiresOn
    };
  }

  /**
   * Delete a file from Azure Blob Storage
   */
  async deleteFile(filePath: string): Promise<boolean> {
    const blobClient = this.getBlobClient(filePath);
    const result = await blobClient.deleteIfExists();
    return result.succeeded;
  }

  /**
   * Check if a file exists in Azure Blob Storage
   */
  async fileExists(filePath: string): Promise<boolean> {
    const blobClient = this.getBlobClient(filePath);
    return await blobClient.exists();
  }
}
