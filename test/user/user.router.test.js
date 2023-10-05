import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const request = supertest("http://localhost:8080");

describe("Test de integración - User", () => {
  let cookie = {};
  let userId;

  after(async () => {
    try {
      const result = await request.delete(`/api/users/${userId}`);
      const { _body } = result;
      expect(_body.message).to.be.ok;
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  });

  it("Se debe poder registrar un usuario correctamente", async () => {
    const user = {
      first_name: "testing",
      last_name: "users",
      email: "testing@testing.com",
      password: "sarasa",
    };

    try {
      const result = await request.post("/api/users/").send(user);
      const { _body } = result;
      userId = _body._id;
      expect(_body).to.be.ok;
    } catch (error) {
      console.error("Error al registrar usuario:", error);
    }
  });

  it("Se debe poder iniciar sesión correctamente (USO DE COOKIE)", async () => {
    const user = {
      email: "testing@testing.com",
      password: "sarasa",
    };

    try {
      const result = await request.post("/api/users/auth/").send(user);
      const cookieResult = result.headers["set-cookie"][0];
      expect(cookieResult).to.be.ok;
      const parts = cookieResult.split("=");
      const value = parts[1].split(";")[0];
      cookie = {
        name: cookieResult.split("=")[0],
        value: value,
      };
      expect(cookie.name).to.be.ok.and.equal("token");
      expect(cookie.value).to.be.ok;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  });

  it("La cookie del usuario debe ser enviada y desencriptada correctamente", async () => {
    try {
      const result = await request
        .get("/api/users/current")
        .set("Cookie", [`${cookie?.name}=${cookie?.value}`]);
      const { _body } = result;
      expect(_body).to.be.ok;
      expect(_body.email).to.be.ok.and.equal("testing@testing.com");
    } catch (error) {
      console.error("Error al verificar la cookie:", error);
    }
  });
});
