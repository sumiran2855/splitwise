export const API_ROUTES = {
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        LOGOUT: '/api/auth/logout',
        REFRESH: '/api/auth/refresh',
        FORGOT_PASSWORD: '/api/auth/forgot-password',
        RESET_PASSWORD: '/api/auth/reset-password',
        VERIFY_EMAIL: '/api/auth/verify-email',
    },
    PROFILE: {
        GET: '/api/profile',
        ENSURE: '/api/profile/ensure',
        UPDATE: '/api/profile',
        UPDATE_AVATAR: '/api/profile/avatar',
        UPLOAD: '/api/profile/upload',
    },
} as const;

// Helper functions for dynamic routes
export const getGroupRoute = (route: string, groupId: string): string => {
    return route.replace(':id', groupId);
};

export const getGroupMemberRoute = (route: string, groupId: string, userId: string): string => {
    return route.replace(':id', groupId).replace(':userId', userId);
};

export const getExpenseRoute = (route: string, expenseId: string): string => {
    return route.replace(':id', expenseId);
};

export const getFriendRoute = (route: string, friendId: string): string => {
    return route.replace(':friendId', friendId);
};

export const getBalanceRoute = (route: string, friendId: string): string => {
    return route.replace(':friendId', friendId);
};

// // Type-safe route builders
// export const buildRoutes = {
//   group: {
//     details: (groupId: string) => getGroupRoute(API_ROUTES.GROUPS.DETAILS, groupId),
//     update: (groupId: string) => getGroupRoute(API_ROUTES.GROUPS.UPDATE, groupId),
//     delete: (groupId: string) => getGroupRoute(API_ROUTES.GROUPS.DELETE, groupId),
//     members: (groupId: string) => getGroupRoute(API_ROUTES.GROUPS.MEMBERS, groupId),
//     addMember: (groupId: string) => getGroupRoute(API_ROUTES.GROUPS.ADD_MEMBER, groupId),
//     removeMember: (groupId: string, userId: string) => getGroupMemberRoute(API_ROUTES.GROUPS.REMOVE_MEMBER, groupId, userId),
//   },
//   expense: {
//     details: (expenseId: string) => getExpenseRoute(API_ROUTES.EXPENSES.DETAILS, expenseId),
//     update: (expenseId: string) => getExpenseRoute(API_ROUTES.EXPENSES.UPDATE, expenseId),
//     delete: (expenseId: string) => getExpenseRoute(API_ROUTES.EXPENSES.DELETE, expenseId),
//     groupExpenses: (groupId: string) => getGroupRoute(API_ROUTES.EXPENSES.GROUP_EXPENSES, groupId),
//   },
//   friend: {
//     remove: (friendId: string) => getFriendRoute(API_ROUTES.FRIENDS.REMOVE, friendId),
//     search: (friendId: string) => getFriendRoute(API_ROUTES.FRIENDS.SEARCH, friendId),
//   },
//   balance: {
//     withFriend: (friendId: string) => getBalanceRoute(API_ROUTES.BALANCES.WITH_FRIEND, friendId),
//   },
// };
