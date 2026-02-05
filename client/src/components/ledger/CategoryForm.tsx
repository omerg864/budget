import {
	useCreateCategoryMutation,
	useDeleteCategoryMutation,
	useUpdateCategoryMutation,
} from '@/api/ledger.api';
import FormInput from '@/components/form/FormInput';
import FormSelectInput from '@/components/form/FormSelectInput';
import { TransactionType } from '@shared/constants/transaction.constants';
import {
	CreateCategorySchema,
	UpdateCategorySchema,
} from '@shared/schemas/ledger.schemas';
import type { LedgerCategory } from '@shared/types/ledger.type';
import { useForm } from '@tanstack/react-form';
import { useMemoizedFn } from 'ahooks';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import AppearingModalForm from '../form/AppearingModalForm';
import ColorRadio from '../radio/ColorRadio';
import IconSelector from '../selectors/IconSelector';

interface CategoryFormProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	categoryToEdit?: LedgerCategory | null;
	ledgerId: string;
}

const formName = 'category-form';

export default function CategoryForm({
	open,
	onOpenChange,
	categoryToEdit,
	ledgerId,
}: CategoryFormProps) {
	const { t } = useTranslation('categories');
	const createCategoryMutation = useCreateCategoryMutation();
	const updateCategoryMutation = useUpdateCategoryMutation();
	const deleteCategoryMutation = useDeleteCategoryMutation();

	const typeOptions = useMemo(
		() => [
			{
				value: TransactionType.EXPENSE,
				label: (
					<div className="flex items-center gap-2">
						<TrendingDown className="h-4 w-4 text-red-500" />
						<span>{t('expense')}</span>
					</div>
				),
			},
			{
				value: TransactionType.INCOME,
				label: (
					<div className="flex items-center gap-2">
						<TrendingUp className="h-4 w-4 text-green-500" />
						<span>{t('income')}</span>
					</div>
				),
			},
		],
		[t],
	);

	const form = useForm({
		defaultValues: {
			name: '',
			icon: '',
			color: '',
			type: TransactionType.EXPENSE,
			imageId: undefined as string | undefined,
		},
		validators: {
			onSubmit: categoryToEdit
				? UpdateCategorySchema
				: (CreateCategorySchema as any),
		},
		onSubmit: async ({ value }) => {
			if (categoryToEdit) {
				try {
					await updateCategoryMutation.mutateAsync({
						ledgerId,
						categoryId: categoryToEdit.id,
						data: value,
					});
					toast.success(t('categoryUpdated'));
					onOpenChange(false);
					resetForm();
				} catch (error: any) {
					console.error('Failed to update category', error);
					toast.error(
						error?.response?.data?.message || error.message,
						{
							position: 'top-center',
						},
					);
				}
			} else {
				try {
					await createCategoryMutation.mutateAsync({
						ledgerId,
						data: value,
					});
					toast.success(t('categoryCreated'));
					onOpenChange(false);
					resetForm();
				} catch (error: any) {
					console.error('Failed to create category', error);
					toast.error(
						error?.response?.data?.message || error.message,
					);
				}
			}
		},
	});

	const resetForm = useMemoizedFn(() => {
		form.reset();
	});

	const handleDelete = useMemoizedFn(async () => {
		if (!categoryToEdit) return;
		try {
			await deleteCategoryMutation.mutateAsync({
				ledgerId,
				categoryId: categoryToEdit.id,
			});
			onOpenChange(false);
			toast.success(t('categoryDeleted'));
		} catch (error: any) {
			console.error('Failed to delete category', error);
			toast.error(error?.response?.data?.message || error.message);
		}
	});

	const isLoading =
		createCategoryMutation.isPending ||
		updateCategoryMutation.isPending ||
		deleteCategoryMutation.isPending;

	useEffect(() => {
		if (open) {
			if (categoryToEdit) {
				form.reset({
					name: categoryToEdit.name,
					icon: categoryToEdit.icon ?? '',
					color: categoryToEdit.color,
					type: categoryToEdit.type,
					imageId: categoryToEdit.imageId,
				});
			} else {
				form.reset({
					name: '',
					icon: '',
					color: '',
					type: TransactionType.EXPENSE,
					imageId: undefined,
				});
			}
		}
	}, [open, categoryToEdit, form]);

	return (
		<AppearingModalForm
			open={open}
			onOpenChange={onOpenChange}
			title={categoryToEdit ? t('editCategory') : t('addCategory')}
			form={form}
			formName={formName}
			submitTitle={categoryToEdit ? t('save') : t('add')}
			cancelTitle={t('cancel')}
			disabled={isLoading}
			onCancel={() => onOpenChange(false)}
			deleteButton={!!categoryToEdit}
			onDelete={handleDelete}
			formClassName="flex flex-col gap-4 py-6"
		>
			<form.Field
				name="name"
				children={(field) => (
					<FormInput
						field={field}
						label={t('categoryName')}
						placeholder={t('categoryName')}
					/>
				)}
			/>
			<form.Field
				name="type"
				children={(field) => (
					<FormSelectInput
						field={field}
						label={t('type')}
						options={typeOptions}
						placeholder={t('selectType')}
					/>
				)}
			/>
			<form.Field
				name="icon"
				children={(field) => (
					<FormSelectInput field={field} label={t('icon')}>
						<IconSelector
							value={field.state.value}
							onValueChange={(val) => field.handleChange(val)}
						/>
					</FormSelectInput>
				)}
			/>

			<form.Field
				name="color"
				children={(field) => (
					<FormInput field={field} label={t('color')}>
						<ColorRadio
							value={field.state.value}
							onValueChange={(val) => field.handleChange(val)}
							className="mt-2"
						/>
					</FormInput>
				)}
			/>
		</AppearingModalForm>
	);
}
