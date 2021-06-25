import { RouteInfo } from './sidebar.metadata';

// Sidebar menu Routes and data
export const ROUTES: RouteInfo[] = [

    {
        path: '', title: 'Dashboard', icon: 'assets/img/appIcons/dashboard.png', class: 'has-sub', badge: '2', badgeClass: 'badge badge-pill badge-danger float-right mr-1 mt-1', isExternalLink: false, submenu:
            [
            { path: '/dashboard/dashboard1', title: 'Dashboard 0', icon: 'assets/img/appIcons/dashboard0.png', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] }
            ]
    },

    { path: '/fileManagement', title: 'File management', icon: 'assets/img/appIcons/fileManagement.png', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },

    { path: '/weatherForecast', title: 'Weather forecast', icon: 'assets/img/appIcons/weather.png', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },

    { path: '/chat', title: 'Chat', icon: 'assets/img/appIcons/chat.png', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },

    { path: '/calendar', title: 'Calendar', icon: 'assets/img/appIcons/calendar.png', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },

    // {
    //     path: '', title: 'Pages', icon: 'ft-copy', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    //     submenu: [
    //         { path: '/pages/forgotpassword', title: 'Forgot Password', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/pages/horizontaltimeline', title: 'Horizontal Timeline', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/pages/verticaltimeline', title: 'Vertical Timeline', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/pages/login', title: 'Login', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/pages/register', title: 'Register', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/pages/profile', title: 'User Profile', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/pages/lockscreen', title: 'Lock Screen', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/pages/invoice', title: 'Invoice', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/pages/error', title: 'Error', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/pages/comingsoon', title: 'Coming Soon', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/pages/maintenance', title: 'Maintenance', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/pages/gallery', title: 'Gallery', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/pages/search', title: 'Search', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/pages/faq', title: 'FAQ', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/pages/kb', title: 'Knowledge Base', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //     ]
    // }
    ];
