import { Component, OnInit } from '@angular/core';
import {FileUploader} from 'ng2-file-upload/ng2-file-upload';

import {environment} from '../../../environments/environment'
import {AuthService} from '../../auth/auth.service';

import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit
{
  hasDropZone = false;

  uploader: FileUploader = new FileUploader
  (
      {url: environment.backend_URL + '/files/upload',
        itemAlias: 'uploadFiles',
        authToken: 'Bearer ' + this.authService.getToken()}
  );

  uploadedMessages = [];

  constructor(private authService: AuthService, private toastrService: ToastrService)
  {

  }

  ngOnInit()
  {
    this.uploader.onSuccessItem = (item, responseString, status, headers) =>
    {
      const index = this.uploader.queue.indexOf(item);

      this.uploadedMessages[index] = JSON.parse(responseString).message;
    }

    this.uploader.onErrorItem = (item, responseString, status, headers) =>
    {
      const index = this.uploader.queue.indexOf(item);

      this.uploadedMessages[index] = JSON.parse(responseString).message;
    }

    this.uploader.onCancelItem = (item, responseString, status, headers) =>
    {
      const index = this.uploader.queue.indexOf(item);

      this.uploadedMessages[index] = 'Cancelled while uploading'
    }

    this.uploader.onAfterAddingFile = (item) =>
    {
      item.remove();
      if (this.uploader.queue.filter(f => f._file.name === item._file.name).length === 0)
      {
        this.uploader.queue.push(item);
      }
      else
      {
        this.toastrService.error('File already in queue', 'Duplicate file', {tapToDismiss: true, timeOut: 2000})
      }
    }
  }

  fileOverBase(e: any): void
  {
    this.hasDropZone = e;
  }

  onRemoveFile(index: number)
  {
    delete this.uploadedMessages[index];
  }

  onRemoveAll()
  {
    this.uploadedMessages = [];
  }

}
