export default class UsersDto {

    constructor(user) {

        this.email = user.email,
        this.userName = user.userName,
        this.role = user.role,
        this.cart = user.cart

    }

    static formatUser(user) {
        return new UsersDto(user);
    }

}