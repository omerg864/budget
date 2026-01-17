export const API_ROUTES = {
	BASE: 'api',
	AUTH: {
		BASE: '/auth',
		login: '/login', // assuming standard auth routes, but controller uses wildcard
		WILDCARD: '/*path',
	},
	USER: {
		BASE: '/user',
		ME: '/me',
	},
	LEDGER: {
		BASE: '/v1/ledger',
		CREATE: '/',
		FIND_ALL: '/',
		FIND_ONE: '/:id',
		UPDATE: '/:id',
		DELETE: '/:id',
	},
	ACCOUNT: {
		BASE: '/v1/account',
		CREATE: '/',
		FIND_ALL: '/:ledgerId',
		FIND_ONE: '/:id',
		UPDATE: '/:id',
		DELETE: '/:id',
	},
};
