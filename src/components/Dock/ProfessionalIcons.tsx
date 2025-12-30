type DockIconKey =
  | 'launchpad'
  | 'dashboard'
  | 'globaldash'
  | 'kpi'
  | 'qonunlar'
  | 'qoidalar'
  | 'temiryol'
  | 'video'
  | 'korxonalar'
  | 'kasb'
  | 'admin'
  | 'profil';

type DockIconMap = Record<DockIconKey, string>;

const AppIcons: DockIconMap = {
  launchpad: '/apps/launchpad.png',
  dashboard: '/apps/dashboard.png',
  globaldash: '/apps/global_dashboard.png',
  kpi: '/apps/KPI.jpg',
  qonunlar: '/apps/qonunlar.png',
  qoidalar: '/apps/qoidalar.png',
  temiryol: '/apps/temiryol.png',
  video: '/apps/video.png',
  korxonalar: '/apps/korxonalar.png',
  kasb: '/apps/kasb.png',
  admin: '/apps/admin.png',
  profil: '/apps/profile.png',
};

export default AppIcons;
