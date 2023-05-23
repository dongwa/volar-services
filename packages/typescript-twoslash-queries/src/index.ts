import type { Service, InlayHint, ServiceContext } from '@volar/language-service';
import type { Provide } from '../../typescript';

export default (): Service => (context: ServiceContext<Provide> | undefined): ReturnType<Service> => ({

	provideInlayHints(document, range) {
		if (isTsDocument(document.languageId)) {

			const ts = context!.inject('typescript/typescript');
			const languageService = context!.inject('typescript/languageService');
			const inlayHints: InlayHint[] = [];

			for (const pointer of document.getText(range).matchAll(/^\s*\/\/\s*\^\?/gm)) {
				const pointerOffset = pointer.index! + pointer[0].indexOf('^?') + document.offsetAt(range.start);
				const pointerPosition = document.positionAt(pointerOffset);
				const hoverOffset = document.offsetAt({
					line: pointerPosition.line - 1,
					character: pointerPosition.character,
				});

				const quickInfo = languageService.getQuickInfoAtPosition(context!.env.uriToFileName(document.uri), hoverOffset);
				if (quickInfo) {
					inlayHints.push({
						position: { line: pointerPosition.line, character: pointerPosition.character + 2 },
						label: ts.displayPartsToString(quickInfo.displayParts),
						paddingLeft: true,
						paddingRight: false,
					});
				}
			}

			return inlayHints;
		}
	},
});

function isTsDocument(languageId: string) {
	return languageId === 'javascript' ||
		languageId === 'typescript' ||
		languageId === 'javascriptreact' ||
		languageId === 'typescriptreact';
}
