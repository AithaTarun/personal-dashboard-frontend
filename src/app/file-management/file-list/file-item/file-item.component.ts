import {Component, Input, OnInit} from '@angular/core';
import {FileModel} from '../../file.model';

import * as FileIcons from 'atom-material-icons'
import {FileManagementService} from '../../file-management.service';

import * as FileSaver from 'file-saver'
import * as Buffer from 'buffer';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';

import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-file-item',
  templateUrl: './file-item.component.html',
  styleUrls: ['./file-item.component.scss']
})
export class FileItemComponent implements OnInit
{
  @Input() file: FileModel

  fileIconPath = 'assets/img/ico/fileManagement';

  constructor(private fileManagementService: FileManagementService, private toastrService: ToastrService)
  {

  }

  ngOnInit()
  {
    const association = FileIcons.getAssociation(this.file.fileName);

    this.fileIconPath = this.fileIconPath + association.icon;
  }

  onDownload(fileName: string, fileType: string)
  {
    this.fileManagementService.getFile(fileName)
        .pipe
        (
            catchError
            (
                (error: any) =>
                {
                  const errorMessage: string = error.error.message;

                  this.toastrService.error(errorMessage, 'Download error', {tapToDismiss: true, timeOut: 2000})

                  return throwError('Authentication failed');
                }
            )
        )
        .subscribe
        (
            (response: { fileBuffer: Buffer}) =>
            {
              const ab = new ArrayBuffer(response.fileBuffer.data.length);
              const view = new Uint8Array(ab);
              for (let i = 0; i < response.fileBuffer.data.length; i++)
              {
                view[i] = response.fileBuffer.data[i];
              }
              const file = new Blob([ab], { type: fileType });

              FileSaver.saveAs(file, fileName);
            }
        )
  }

  onDelete(fileName: string)
  {
      this.fileManagementService.deleteFile(fileName)
          .pipe
          (
              catchError
              (
                  (error: any) =>
                  {
                      console.log(error);

                      const errorMessage: string = error.error.message;

                      this.toastrService.error(errorMessage, 'Delete error', {tapToDismiss: true, timeOut: 2000})

                      return throwError('Error occurred');
                  }
              )
          )
          .subscribe(
              (response: {message: string, data: FileModel[]}) =>
              {
                  this.fileManagementService.filesSubject
                      .next
                      (
                          {filesData: [...response.data]}
                      )
              }
          )
  }

}
