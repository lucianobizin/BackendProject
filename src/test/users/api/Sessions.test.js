import { expect } from "chai"; // chai validates procedures
import supertest from "supertest"; // supertest makes requests

const requester = supertest("http://localhost:8080")

describe("Testing user's registration", function () {

    this.timeout(100000) // 100 seconds

    let cookieCart;

    it("Endpoint GET /register - it should open the register view", async function () {
        const response = await requester.get("/register")
        const cookieString = response.headers["set-cookie"][0];
        cookieCart = {
            name: cookieString.split("=")[0],
            value: cookieString.split("=")[1]
        }

        expect(cookieCart.name).to.be.ok.and.eql("cart");

    })

    it("Endpoint POST api/sessions/register - it should register an user", async function () {

        const mockUser = {
            firstName: "Lucho",
            lastName: "Bizin",
            email: "lucianobizin@gmaila.com",
            birthDate: "01-01-1988",
            userName: "LuchoBizina",
            password: "Coder123",
        };

        try {

            const response = await requester.post("/api/sessions/register").send(mockUser).set('Cookie', `${cookieCart.name}=${cookieCart.value}`);
            expect(response.status).to.be.eql(200);
            expect(response.body.payload._id).to.be.ok;

        } catch (error) {

            console.error(error);

        }

    })

})
