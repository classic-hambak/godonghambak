export interface NavigationRoutes {
  text: string;
  href: string;
  subRoutes: NavigationSubRoutes[];
}

export interface NavigationSubRoutes
  extends Omit<NavigationRoutes, 'subRoutes'> {
  highlight?: boolean;
}
