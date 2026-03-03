export type MenuItem = {
	active?: boolean;
	childMenuId?: string;
	divider?: boolean;
	externalLink?: boolean;
	icon?: string;
	iconAlignment?: string;
	label?: string;
	onClick?: () => void;
	url?: string;
};

export type Menus = {
	[key: string]: {
		items: MenuItem[];
		subheaderLabel?: string;
	}[];
};
