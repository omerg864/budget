import type { StandardSchemaV1Issue } from '@tanstack/react-form';

export type FormErrorsProps = {
	errors: (Record<string, StandardSchemaV1Issue[]> | undefined)[];
};

function FormErrors({ errors }: FormErrorsProps) {
	return (
		<div className="space-y-1 text-sm text-danger" role="alert">
			{errors.flatMap((error) =>
				error
					? Object.values(error).flatMap((issues) =>
							issues.map((issue) => (
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
}

export default FormErrors;
