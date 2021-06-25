import { Routes, RouterModule } from '@angular/router';

// Route for content layout with sidebar, navbar and footer.

export const Full_ROUTES: Routes =
    [
        {
          path: 'dashboard',
          loadChildren: () => import('../../dashboard/dashboard.module').then(m => m.DashboardModule)
        },

        {
            path: 'fileManagement',
            children:
                [
                    {
                        path: '',
                        loadChildren : () => import('../../file-management/file-management.module').then(module => module.FileManagementModule)
                    },
                    {
                        path: 'upload',
                        loadChildren : () => import('../../file-management/upload/upload.module').then(module => module.UploadModule)
                    }
                ]
        },

        {
          path: 'weatherForecast',
          loadChildren: () => import('../../weather/weather.module').then(module => module.WeatherModule)
        },

        {
          path: 'calendar',
          loadChildren: () => import('../../calendar/calendar.module').then(m => m.CalendarsModule)
        },
        {
          path: 'pages',
          loadChildren: () => import('../../pages/full-pages/full-pages.module').then(m => m.FullPagesModule)
        },
        {
          path: 'chat',
          loadChildren: () => import('../../chat/chat.module').then(m => m.ChatModule)
        }
  ];
