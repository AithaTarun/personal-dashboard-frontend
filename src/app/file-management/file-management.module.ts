import {NgModule} from '@angular/core';
import {FileManagementComponent} from './file-management.component';
import {CommonModule} from '@angular/common';
import { ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FileManagementRoutingModule} from '../dashboard/file-management-routing.module';
import { FileListComponent } from './file-list/file-list.component';
import { FileItemComponent } from './file-list/file-item/file-item.component';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';

@NgModule
(
    {
        declarations:
        [
            FileManagementComponent,
            FileListComponent,
            FileItemComponent
        ],
        imports:
            [
                CommonModule,
                ReactiveFormsModule,
                NgbModule.forRoot(),

                FileManagementRoutingModule,
                PerfectScrollbarModule
            ]
    }
)
export class FileManagementModule
{

}
