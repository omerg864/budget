import type { AnyFormType } from '@/types/form.type';
import type { StandardSchemaV1Issue } from '@tanstack/react-form';

export type FormErrorsProps = {
	form: AnyFormType;
	path?: string[];
};

function FormErrors({ form, path }: FormErrorsProps) {
	return (
		<form.Subscribe
			selector={(state) => state.errors}
			children={(errorsObject) => {
				const errors: (
					| Record<string, StandardSchemaV1Issue[]>
					| undefined
				)[] = Object.values(errorsObject);
				return (
					<div className="space-y-1 text-sm text-danger" role="alert">
						{errors.flatMap((error) =>
							error
								? Object.values(error).flatMap((issues) =>
										issues
											.filter((issue) =>
												path
													? issue.path?.join('.') ===
														path?.join('.')
													: true,
											)
											.map((issue) => (
												<div
													className="text-sm text-red-500"
													key={issue.path?.join('.')}
												>
													{issue.message}
												</div>
											)),
									)
								: [],
						)}
					</div>
				);
			}}
		/>
	);
}

export default FormErrors;
