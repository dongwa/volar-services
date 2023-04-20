import type { LanguageServicePlugin } from '@volar/language-service';
import { formatDiagnostic } from 'pretty-ts-errors-lsp';

export default (format: (text: string) => string): LanguageServicePlugin => (contextOrNull): ReturnType<LanguageServicePlugin> => {

	if (!contextOrNull) return {};

	return {
		provideDiagnosticMarkupContent(diagnostic) {
			return {
				kind: 'markdown',
				value: formatDiagnostic(diagnostic, format),
			};
		},
	};
};