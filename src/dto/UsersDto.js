export default class UsersDto {

    static getTokenDTOFrom = (user) => {

        if (user.email !== "adminCoder@coder.com") {

            return {

                _id: user._id,
                email: user.email,
                userName: user.userName,
                role: user.role,
                cart: user.cart,
                last_connection: user.last_connection

            }

        } else if (user.email === "adminCoder@coder.com") {

            return {

                userName: "admin",
                role: "admin"

            }
            
        }

    }
}