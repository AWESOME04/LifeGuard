interface TourStep {
  element: string;
  intro: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
}

export const dashboardSteps: TourStep[] = [
  {
    element: '.dashboard-header',
    intro:
      'Welcome to LifeGuard! This is your personal health and environmental monitoring dashboard.',
    position: 'bottom',
    tooltipPosition: 'bottom',
  },
  {
    element: '.temperature-card',
    intro: 'Monitor real-time environmental data including temperature, humidity, and air quality.',
    position: 'right',
    tooltipPosition: 'right',
  },
  {
    element: '.reminders-card',
    intro: 'Keep track of important notes and reminders here.',
    position: 'left',
    tooltipPosition: 'left',
  },
  {
    element: '.alerts-section',
    intro: 'Get important alerts about your environment and health metrics.',
    position: 'top',
    tooltipPosition: 'top',
  },
];
