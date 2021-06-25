import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FullLayoutComponent } from './layouts/full/full-layout.component';
import { ContentLayoutComponent } from './layouts/content/content-layout.component';

import { Full_ROUTES } from './shared/routes/full-layout.routes';
import { CONTENT_ROUTES } from './shared/routes/content-layout.routes';

const appRoutes: Routes =
    [
        {
            path: '',
            redirectTo: 'dashboard/dashboard1',
            pathMatch: 'full',
        },

        { path: '', component: FullLayoutComponent, data: { title: 'full Views' }, children: Full_ROUTES},

        { path: '', component: ContentLayoutComponent, data: { title: 'content Views' }, children: CONTENT_ROUTES},

        {
            path : 'auth',
            loadChildren : () => import('./auth/auth.module').then(module => module.AuthModule)
        },

        {
            path: '**',
            redirectTo: 'pages/error'
        }
    ];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule
{

}
