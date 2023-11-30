import { expect } from "chai"; // chai validates procedures
import supertest from "supertest"; // supertest makes requests

const requester = supertest("http://localhost:8080")

describe("Testing the creation of a new product by admin", function () {

    this.timeout(100000) // 100 seconds

    let cookieCart;
    let authCookie;

    it("Endpoint POST /api/sessions/login - it should connect to the login endpoint", async function () {

        const mockUser = {
            email: "adminCoder@coder.com",
            password: "adminCod3r123"
        };


        const response = await requester.post("/api/sessions/login").send(mockUser)

        const cookieString = response.headers["set-cookie"][0];

        cookieCart = {
            name: cookieString.split("=")[0],
            value: cookieString.split("=")[1]
        }

        const authCookieString = response.headers["set-cookie"][1];

        authCookie = {
            name: authCookieString.split("=")[0],
            value: authCookieString.split("=")[1]
        }

        expect(cookieCart.name).to.be.ok.and.eql("cart");
        expect(authCookie.name).to.be.ok.and.eql("authCookie");
    })

    it("Endpoint POST /api/sessions/login - admin should add a product", async function () {

        const mockProduct = {
            title: "3D Vision",
            description: "A tremendous course on 3D vision.",
            price: 799.99,
            stock: 100,
            code: "SP123",
            category: "Electronics",
        }

        try {
            const response = await requester.post("/api/products").set('Cookie', `${authCookie.name}=${authCookie.value}`)
            .field("title", mockProduct.title)
            .field("description", mockProduct.description)
            .field("price", mockProduct.price)
            .field("stock", mockProduct.stock)
            .field("code", mockProduct.code)
            .field("category", mockProduct.category)
            .attach("images", "./src/test/products/api/vision3d.jpg")

            expect(response._body.payload).to.be.ok;

        } catch (error) {
            console.error(error);
        }

    })



})