import {Component, Input} from '@angular/core';
import {FileModel} from '../file.model';
import {FileManagementService} from '../file-management.service';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent
{
  @Input() files: FileModel[];

  fileItemsPerPage = 12;
  currentPage = 1;

  loading = true;

  constructor(private fileManagementService: FileManagementService)
  {

  }
}
