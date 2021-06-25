import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FileManagementComponent} from './file-management.component';

const routes: Routes = [
    {
        path: '',
        component: FileManagementComponent,
    },
    {
        path: 'upload',
        loadChildren : () => import('./upload/upload.module').then(module => module.UploadModule)
    }
];

@NgModule
(
    {
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    }
)
export class UploadRoutingModule
{

}
