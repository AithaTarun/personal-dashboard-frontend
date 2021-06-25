import {Component, OnInit} from '@angular/core';

import {FileManagementService} from './file-management.service';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';
import {FileModel} from './file.model';

@Component({
    selector: 'app-file-management',
    templateUrl: './file-management.component.html',
    styleUrls: ['./file-management.component.scss']
})
export class FileManagementComponent implements OnInit
{
    public files = [];

    documentsSize = 0;
    imagesSize = 0;
    audiosSize = 0;
    videosSize = 0;

    originalDocumentsSize = 0;
    originalImagesSize = 0;
    originalAudiosSize = 0;
    originalVideosSize = 0;

    constructor(private fileManagementService: FileManagementService, public authService: AuthService, private router: Router)
    {

    }

    ngOnInit()
    {
        if (!this.authService.getIsAuth())
        {
            return this.router.navigate(['pages', 'unauthorized']);
        }

        this.fileManagementService.filesSubject.subscribe
        (
            (newData) =>
            {
                this.updateFiles(newData.filesData);
            }
        )

        this.fileManagementService.getFilesDetails();
    }

    // tslint:disable-next-line:no-shadowed-variable
    private updateFiles(data: FileModel[])
    {
        this.files = data;

        this.files.forEach
        (
            (file) =>
            {
                const fileType = file.fileType;

                if (fileType.match('^image/'))
                {
                    this.imagesSize += file.compressedFileSize
                    this.originalImagesSize += file.originalFileSize
                }
                else if (fileType.match('^audio/'))
                {
                    this.audiosSize += file.compressedFileSize
                    this.originalAudiosSize += file.originalFileSize
                }
                else if (fileType.match('^video/'))
                {
                    this.videosSize += file.compressedFileSize
                    this.originalVideosSize += file.originalFileSize
                }
                else
                {
                    this.documentsSize += file.compressedFileSize
                    this.originalDocumentsSize += file.originalFileSize
                }
            }
        )
    }
}
