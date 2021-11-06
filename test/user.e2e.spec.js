const request = require("supertest");
const fs = require("fs/promises");

require("dotenv").config();

const db = require("../config/db");
const app = require("../app");

const User = require("../model/user");

const { newUserForRouteUser } = require("./data/data");
console.log(newUserForRouteUser);

describe("Test route users", () => {
  let token;

  beforeAll(async () => {
    await db;
    await User.deleteOne({ email: newUserForRouteUser.email });
  });

  afterAll(async () => {
    const mongo = await db;
    await User.deleteOne({ email: newUserForRouteUser.email });
    mongo.disconnect();
  });

  it("register user", async () => {
    const response = await request(app)
      .post("/api/users/signup")
      .send(newUserForRouteUser)
      .set("Accept", "application/json");
    expect(response.status).toEqual(201);
    expect(response.body).toBeDefined();
  });

  it("User exist return status 409", async () => {
    const response = await request(app)
      .post("/api/users/signup")
      .send(newUserForRouteUser)
      .set("Accept", "application/json");
    expect(response.status).toEqual(409);
    expect(response.body).toBeDefined();
  });

  it("Login user", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send(newUserForRouteUser)
      .set("Accept", "application/json");
    expect(response.status).toEqual(200);
    expect(response.body).toBeDefined();

    token = response.body.data.token;
  });

  it("Upload avatar for user", async () => {
    const buffer = await fs.readFile("./test/data/avatar.jpg");
    const response = await request(app)
      .patch("/api/users/avatars")
      .set("Authorization", `Bearer ${token}`)
      .attach("avatar", buffer, "avatar.jpg");
    expect(response.status).toEqual(200);
    expect(response.body).toBeDefined();
  });
});
