export type LoadErrorKind = 'offline' | 'http';

export class PokedexLoadError extends Error {
	readonly kind: LoadErrorKind;
	readonly status?: number;

	constructor(kind: LoadErrorKind, message: string, status?: number) {
		super(message);
		this.name = 'PokedexLoadError';
		this.kind = kind;
		this.status = status;
	}
}

export function toLoadError(error: unknown, fallbackMessage: string): PokedexLoadError {
	if (error instanceof PokedexLoadError) {
		return error;
	}

	return new PokedexLoadError('offline', fallbackMessage);
}

export function loadErrorCopy(error: PokedexLoadError): { title: string; message: string } {
	if (error.kind === 'offline') {
		return {
			title: 'Backend unavailable',
			message: error.message,
		};
	}

	return {
		title: 'Couldn’t load Pokemon',
		message: error.message,
	};
}
