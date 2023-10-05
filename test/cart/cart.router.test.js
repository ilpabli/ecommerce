import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const request = supertest("http://localhost:8080");

describe("Test de integración - Carts", () => {
  let cartId;
  let productId;
  let jwtToken;

  after(async () => {
    try {
      const delCart = await request
        .delete(`/api/carts/destroy/${cartId}`)
        .set("Cookie", [`token=${jwtToken}`]);
    } catch (error) {
      console.error("Error al eliminar el carrito:", error);
    }
  });

  it("Se debe poder agregar un carrito", async () => {
    try {
      const response = await request.post("/api/carts");
      expect(response.status).to.equal(201);
      expect(response._body.products).to.be.an("array");
      cartId = response._body._id;
    } catch (error) {
      console.error("Error al registrar usuario:", error);
    }
  });

  it("Se debe poder ver un carrito por ID", async () => {
    try {
      const response = await request.get(`/api/products/${cartId}`);
      expect(response.status).to.equal(201);
    } catch (error) {
      console.error("Error al registrar usuario:", error);
    }
  });

  it("Se debe agregar un producto al carrito creado", async () => {
    const products = await request.get("/api/products");
    productId = products._body[0]._id;
    const user = {
      email: "t@t.com",
      password: "t",
    };

    try {
      const login = await request.post("/api/users/auth/").send(user);
      const cookieResult = login.headers["set-cookie"][0];
      expect(cookieResult).to.be.ok;
      const parts = cookieResult.split("=");
      jwtToken = parts[1].split(";")[0];

      const response = await request
        .post(`/api/carts/${cartId}/products/${productId}`)
        .set("Cookie", [`token=${jwtToken}`]);
      expect(response.status).to.equal(302);
    } catch (error) {
      console.error("Error al agregar un producto al carrito:", error);
    }
  });

  it("Se debe actualizar un producto del carrito creado", async () => {
    const update = { quantity: 5 };
    try {
      const response = await request
        .put(`/api/carts/${cartId}/products/${productId}`)
        .set("Cookie", [`token=${jwtToken}`])
        .send(update);
      expect(response._body.products[0].quantity).to.equal(5);
    } catch (error) {
      console.error("Error al actualizar un producto del carrito:", error);
    }
  });

  it("Se debe eliminar un producto al carrito creado", async () => {
    try {
      const response = await request
        .delete(`/api/carts/${cartId}/products/${productId}`)
        .set("Cookie", [`token=${jwtToken}`]);
      expect(response.status).to.equal(201);
    } catch (error) {
      console.error("Error al borrar un producto del carrito:", error);
    }
  });

  it("Se debe vaciar el carrito creado", async () => {
    try {
      const response = await request
        .delete(`/api/carts/${cartId}`)
        .set("Cookie", [`token=${jwtToken}`]);
      expect(response._body.products).to.be.an("array").that.is.empty;
    } catch (error) {
      console.error("Error al vaciar el carrito:", error);
    }
  });

  it("Al estar el carrito vacio no permite la compra", async () => {
    try {
      const response = await request
        .post(`/api/carts/${cartId}/purchase`)
        .set("Cookie", [`token=${jwtToken}`]);
      expect(response.status).to.equal(400);
      expect(response._body.status).to.equal("error");
    } catch (error) {
      console.error("Error al agregar un producto al carrito:", error);
    }
  });
});
