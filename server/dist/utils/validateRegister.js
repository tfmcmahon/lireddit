"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
exports.validateRegister = (options) => {
    if (!options.email.includes('@')) {
        return [
            {
                field: 'email',
                message: 'Invalid email',
            },
        ];
    }
    if (options.username.length <= 2) {
        return [
            {
                field: 'username',
                message: 'Length bust be greater than 2',
            },
        ];
    }
    if (options.username.includes('@')) {
        return [
            {
                field: 'username',
                message: 'Cannot include @',
            },
        ];
    }
    if (options.password.length <= 3) {
        return [
            {
                field: 'password',
                message: 'Length bust be greater than 3',
            },
        ];
    }
    return null;
};
//# sourceMappingURL=validateRegister.js.map