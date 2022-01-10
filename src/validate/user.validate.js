
const userValidate = {

    validateLogin: (email, password) => {
        if (!email?.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
            return {
                code: 400,
                message: 'Email không hợp lệ.'
            }
        }
        if (!password?.match(/^(?=.*?[a-z])(?=.*?[0-9]).{8,32}$/g)) {
            return {
                code: 400,
                message: 'Password không hợp lệ.'
            }
        }
    },

    validateRegister: (user) => {
        if (!user?.first_name?.match(/(^[^0-9!@#$%^&*()_+\-=[\]{};':"\\|,~`.<>/?]{2,9}$)/g) ||
            !user?.last_name?.match(/(^[^0-9!@#$%^&*()_+\-=[\]{};':"\\|,~`.<>/?]{2,9}$)/g) ||
            !user?.email?.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) ||
            !user?.password?.match(/^(?=.*?[a-z])(?=.*?[0-9]).{8,32}$/g)
        ) {
            return {
                code: 400,
                message: 'Invalid email or password or first name or last name'
            }
        }
    },

    validateUpdateUser: (user) => {
        if (!user?.first_name?.match(/(^[^0-9!@#$%^&*()_+\-=[\]{};':"\\|,~`.<>/?]{2,9}$)/g) ||
            !user?.last_name?.match(/(^[^0-9!@#$%^&*()_+\-=[\]{};':"\\|,~`.<>/?]{2,9}$)/g) ||
            !user?.email?.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
        ) {
            return {
                code: 400,
                message: 'Invalid email or first name or last name'
            }
        }
    },
    validateChangePassword: (password, newPassword) => {
        if (!password?.match(/^(?=.*?[a-z])(?=.*?[0-9]).{8,32}$/g)) {
            return {
                code: 400,
                message: 'Password không hợp lệ.'
            }
        }
        if (!newPassword?.match(/^(?=.*?[a-z])(?=.*?[0-9]).{8,32}$/g)) {
            return {
                code: 400,
                message: 'Password mới không hợp lệ.'
            }
        }
    }
}

module.exports = userValidate