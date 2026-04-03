export type Menu = {
  id: number;
  parentId: number | null;
  menuType: 'BOARD' | 'DIRECTORY';
  menuName: string;
  href: string;
};

export type MenuItem = Menu & {
  children?: MenuItem[];
};
