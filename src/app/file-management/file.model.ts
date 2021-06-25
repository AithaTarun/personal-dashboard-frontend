import {Timestamp} from 'rxjs';

export interface FileModel
{
    _id: string,
    fileName: string,
    originalFileSize: number,
    compressedFileSize: number,
    fileType: string,
    createdAt: Timestamp<number>
}
