import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const request = supertest("http://localhost:8080");

describe("Test de integración - Product", () => {
  let productId;
  let jwtToken;

  after(async () => {
    try {
      const delProduct = await request
        .delete(`/api/products/${productId}`)
        .set("Cookie", [`token=${jwtToken}`]);
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  });

  it("Se debe poder obtener una lista de productos", async () => {
    try {
      const response = await request.get("/api/products");
      expect(response.status).to.equal(201);
      expect(response._body).to.be.an("array");
    } catch (error) {
      console.error("Error al registrar usuario:", error);
    }
  });

  it("Se debe poder agregar un producto con autentificacion", async () => {
    const newProduct = {
      title: "testing",
      description: "testing",
      code: "test123",
      price: 1,
      status: true,
      stock: 100,
      category: "testing",
    };
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
        .post("/api/products")
        .set("Cookie", [`token=${jwtToken}`])
        .send(newProduct);
      expect(response.status).to.equal(201);
      expect(response._body).to.be.an("object");
      productId = response._body._id;
    } catch (error) {
      console.error("Error al agregar un producto:", error);
    }
  });

  it("Se debe poder actualizar un producto con autentificacion", async () => {
    const updatedProduct = {
      title: "testingUPDATE",
      description: "testingUPDATE",
    };
    try {
      const response = await request
        .put(`/api/products/${productId}`)
        .set("Cookie", [`token=${jwtToken}`])
        .send(updatedProduct);

      expect(response.status).to.equal(201);
      expect(response._body).to.be.an("object");
    } catch (error) {
      console.error("Error al agregar un producto:", error);
    }
  });
});
