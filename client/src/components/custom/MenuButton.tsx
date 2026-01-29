import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { EllipsisVertical } from 'lucide-react';
import type { ElementType, FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export type MenuOptionType =
	| 'item'
	| 'checkbox'
	| 'radio-group'
	| 'sub'
	| 'group'
	| 'label'
	| 'separator';

export type BaseMenuOption = {
	label?: ReactNode;
	icon?: ElementType;
	disabled?: boolean;
	className?: string;
	shortcut?: string;
	variant?: 'default' | 'destructive';
};

export type MenuItemOption = BaseMenuOption & {
	type?: 'item';
	onClick?: (e: React.MouseEvent) => void;
};

export type MenuCheckboxOption = BaseMenuOption & {
	type: 'checkbox';
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
};

export type MenuRadioOption = BaseMenuOption & {
	type: 'radio-group';
	value: string;
	onValueChange: (value: string) => void;
	options: {
		value: string;
		label: ReactNode;
		icon?: ElementType;
	}[];
};

export type MenuSubOption = BaseMenuOption & {
	type: 'sub';
	children: MenuOption[];
};

export type MenuGroupOption = BaseMenuOption & {
	type: 'group';
	children: MenuOption[];
};

export type MenuLabelOption = {
	type: 'label';
	label: ReactNode;
};

export type MenuSeparatorOption = {
	type: 'separator';
};

export type MenuOption =
	| MenuItemOption
	| MenuCheckboxOption
	| MenuRadioOption
	| MenuSubOption
	| MenuGroupOption
	| MenuLabelOption
	| MenuSeparatorOption;

export type MenuButtonProps = {
	options: MenuOption[];
	icon?: ReactNode;
	align?: 'start' | 'end' | 'center';
	className?: string;
};

const RenderOption = ({ option }: { option: MenuOption }) => {
	const type = 'type' in option ? option.type : 'item';

	switch (type) {
		case 'checkbox': {
			const checkboxOption = option as MenuCheckboxOption;
			const Icon = checkboxOption.icon;
			return (
				<DropdownMenuCheckboxItem
					checked={checkboxOption.checked}
					onCheckedChange={checkboxOption.onCheckedChange}
					disabled={checkboxOption.disabled}
					className={checkboxOption.className}
				>
					{Icon && <Icon className="mr-2 h-4 w-4" />}
					{checkboxOption.label}
					{checkboxOption.shortcut && (
						<DropdownMenuShortcut>
							{checkboxOption.shortcut}
						</DropdownMenuShortcut>
					)}
				</DropdownMenuCheckboxItem>
			);
		}
		case 'radio-group': {
			const radioOption = option as MenuRadioOption;
			return (
				<>
					{radioOption.label && (
						<DropdownMenuLabel>
							{radioOption.label}
						</DropdownMenuLabel>
					)}
					<DropdownMenuRadioGroup
						value={radioOption.value}
						onValueChange={radioOption.onValueChange}
					>
						{radioOption.options.map((item) => {
							const ItemIcon = item.icon;
							return (
								<DropdownMenuRadioItem
									key={item.value}
									value={item.value}
								>
									{ItemIcon && (
										<ItemIcon className="mr-2 h-4 w-4" />
									)}
									{item.label}
								</DropdownMenuRadioItem>
							);
						})}
					</DropdownMenuRadioGroup>
				</>
			);
		}
		case 'sub': {
			const subOption = option as MenuSubOption;
			const Icon = subOption.icon;
			return (
				<DropdownMenuSub>
					<DropdownMenuSubTrigger
						disabled={subOption.disabled}
						className={subOption.className}
					>
						{Icon && <Icon className="mr-2 h-4 w-4" />}
						{subOption.label}
					</DropdownMenuSubTrigger>
					<DropdownMenuPortal>
						<DropdownMenuSubContent>
							{subOption.children.map((child, index) => (
								<RenderOption key={index} option={child} />
							))}
						</DropdownMenuSubContent>
					</DropdownMenuPortal>
				</DropdownMenuSub>
			);
		}
		case 'group': {
			const groupOption = option as MenuGroupOption;
			return (
				<DropdownMenuGroup>
					{groupOption.label && (
						<DropdownMenuLabel>
							{groupOption.label}
						</DropdownMenuLabel>
					)}
					{groupOption.children.map((child, index) => (
						<RenderOption key={index} option={child} />
					))}
				</DropdownMenuGroup>
			);
		}
		case 'label': {
			const labelOption = option as MenuLabelOption;
			return <DropdownMenuLabel>{labelOption.label}</DropdownMenuLabel>;
		}
		case 'separator': {
			return <DropdownMenuSeparator />;
		}
		case 'item':
		default: {
			const itemOption = option as MenuItemOption;
			const Icon = itemOption.icon;
			return (
				<DropdownMenuItem
					onClick={itemOption.onClick}
					disabled={itemOption.disabled}
					className={cn('cursor-pointer', itemOption.className)}
					variant={itemOption.variant}
				>
					{Icon && <Icon className="mr-2 h-4 w-4" />}
					{itemOption.label}
					{itemOption.shortcut && (
						<DropdownMenuShortcut>
							{itemOption.shortcut}
						</DropdownMenuShortcut>
					)}
				</DropdownMenuItem>
			);
		}
	}
};

const MenuButton: FC<MenuButtonProps> = ({
	options,
	align = 'end',
	className,
	icon: Icon,
}: MenuButtonProps) => {
	const { t } = useTranslation('generic');
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className={cn('data-[state=open]:bg-muted', className)}
				>
					{Icon ? Icon : <EllipsisVertical className="h-4 w-4" />}
					<span className="sr-only">{t('openMenu')}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align={align} className="min-w-[160px]">
				{options.map((option, index) => (
					<RenderOption key={index} option={option} />
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default MenuButton;
