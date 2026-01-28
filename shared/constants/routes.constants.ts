export const API_ROUTES = {
	BASE: 'api',
	AUTH: {
		BASE: '/auth',
		login: '/login', // assuming standard auth routes, but controller uses wildcard
		WILDCARD: '/*path',
	},
	USER: {
		BASE: '/v1/user',
		ME: '/me',
		LEDGER: '/:ledgerId',
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
	CREDIT: {
		BASE: '/v1/credit',
		CREATE: '/',
		FIND_ALL: '/:ledgerId',
		FIND_BY_ACCOUNT: '/:accountId',
		FIND_ONE: '/:id',
		UPDATE: '/:id',
		DELETE: '/:id',
	},
	TRANSACTION: {
		BASE: '/v1/transaction',
		CREATE: '/',
		FIND_ALL: '/:ledgerId',
		FIND_BY_CREDIT: '/:creditId',
		FIND_ONE: '/:id',
		UPDATE: '/:id',
		DELETE: '/:id',
	},
	RECURRING_TRANSACTION: {
		BASE: '/v1/recurring-transaction',
		CREATE: '/',
		FIND_ALL: '/:ledgerId',
		FIND_ONE: '/:id',
		UPDATE: '/:id',
		DELETE: '/:id',
	},
};

export const CLIENT_ROUTES = {
	HOME: '/',
	LOGIN: '/login',
	REGISTER: '/register',
};
