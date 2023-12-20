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

                userName: user.userName,
                role: user.role

            }
            
        }

    }

    static allUsersInfo = (users) => {

        let newUsers = []

        for(const user of users){

            let profileImage = `/img/unknown_profile_image.jpg`

            if (user.documents){
                
                for(const document of user.documents){
                    if(document.name === "profileImage"){
                        profileImage = document.reference
                    }
                }

            }


            const newUser = {

                profileImage: profileImage,
                _id: user._id,
                email: user.email,
                userName: user.userName,
                role: user.role,
                cart: user.cart,
                last_connection: user.last_connection,
                documents: user.documents ? user.documents : undefined
            }

            newUsers.push(newUser)
        }

        return newUsers
    }
}