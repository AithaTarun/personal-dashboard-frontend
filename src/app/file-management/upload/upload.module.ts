import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {UploadComponent} from './upload.component';
import {UploadRoutingModule} from './upload.routing.module';
import {FileUploadModule} from 'ng2-file-upload';
import {NgbProgressbarModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule
(
    {
      declarations:
          [
              UploadComponent
          ],
        imports:
            [
                CommonModule,
                ReactiveFormsModule,

                UploadRoutingModule,
                FileUploadModule,
                NgbProgressbarModule,
                NgbTooltipModule
            ]
    }
)
export class UploadModule
{

}
