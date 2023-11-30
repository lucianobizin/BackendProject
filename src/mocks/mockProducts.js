import { faker } from "@faker-js/faker/locale/af_ZA"

export const generateUsers = () => {

    const roles = ["user", "userpremium", "admin"];

    return {
        cart: faker.database.mongodbObjectId(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        birthDate: faker.date.birthdate(),
        userName: faker.internet.userName(),
        password: faker.internet.password(),
        role: faker.helpers.arrayElement(roles),
        cart: faker.database.mongodbObjectId(),
        premium: faker.datatype.boolean()

    }

}