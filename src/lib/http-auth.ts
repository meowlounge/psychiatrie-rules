import 'server-only';

export function getBearerTokenFromRequest(request: Request) {
	const authorization = request.headers.get('authorization');

	if (!authorization) {
		return null;
	}

	const [scheme, value] = authorization.split(' ');

	if (scheme !== 'Bearer' || !value) {
		return null;
	}

	return value;
}
