export type UserRole = 'ADMIN' | 'AGENT' | 'CLIENT';

export interface MenuItem {
  // Identifiant unique du menu
  id: string;

  // Libellé affiché dans la sidebar
  label: string;

  // Icône (nom libre : heroicons, lucide, fontawesome, etc.)
  icon?: string;

  // Route Angular associée
  route?: string;

  // Rôles autorisés à voir ce menu
  roles: UserRole[];

  // Sous-menus (optionnel)
  children?: MenuItem[];

  // Menu spécial (ex: logout)
  isAction?: boolean;
}
