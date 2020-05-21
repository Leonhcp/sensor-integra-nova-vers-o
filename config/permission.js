/* Permission Configuration*/

module.exports = app => ({

    hasPermission: (permissions = null, permission = null) => {

        const pLabel = permission.substring(0, permission.indexOf('-'));
        const cutedPermissions = permissions.split('/');

        const hasPermLabel = cutedPermissions.filter(v => {
            return v.substring(0, permission.indexOf('-')) === pLabel;
        });

        if (hasPermLabel.length <= 0) return false;

        const userPerm = hasPermLabel[0];
        const userPermLetters = userPerm.substring(userPerm.indexOf('-') + 1).split('');
        const permissionLetters = permission.substring(permission.indexOf('-') + 1).split('');

        let counter = 0;
        for (c in userPermLetters) {
            if (permissionLetters.indexOf(userPermLetters[c]) >= 0) counter++;
        }

        if (counter === permissionLetters.length) return true;
        else return false;
    },

    permissions: (c, r, u, d) => {
        return `permissions-${c && 'c' + r && 'r' + u && 'u' + d && 'd'}`
    },

    auth: (c, r, u, d) => {
        return `auth-${c && 'c' + r && 'r' + u && 'u' + d && 'd'}`
    },

    users: (c, r, u, d) => {
        return `users-${c && 'c' + r && 'r' + u && 'u' + d && 'd'}`
    },

    rooms: (c, r, u, d) => {
        return `rooms-${c && 'c' + r && 'r' + u && 'u' + d && 'd'}`
    },
})