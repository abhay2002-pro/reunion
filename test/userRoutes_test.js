import chai from "chai";
import chaiHttp from "chai-http";
import { config } from "dotenv";
const should = chai.should();

config({
  path: "./config/config.env",
});

const API = process.env.BASE_URL;
console.log(API);
chai.use(chaiHttp);

// User authentication
describe("/POST Successful user authentication check", () => {
  it("logging in the user", (done) => {
    chai
      .request(API)
      .post("/api/authenticate")
      .send({
        email: "abhay@gmail.com",
        password: "Abhay@123",
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.be.have.property("success");
        res.body.success.should.equal(true);
        res.body.should.be.have.property("jwt_token");
        res.body.jwt_token.should.be.a("string");
        done();
      });
  });
});

let inputs = [
  {
    describeText: "invalid password",
    email: "abhay@gmail.com",
    password: "Abhay123",
    message: "Incorrect Password",
  },
  {
    describeText: "invalid email",
    email: "abhay1@gmail.com",
    password: "Abhay@123",
    message: "Incorrect Email",
  },
];

inputs.forEach((input) => {
  describe(`POST User authentication with ${input.describeText}`, () => {
    it("logging in the user", (done) => {
      chai
        .request(API)
        .post("/api/authenticate")
        .send({
          email: input.email,
          password: input.password,
        })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a("object");
          res.body.should.be.have.property("success");
          res.body.success.should.equal(false);
          res.body.should.be.have.property("message");
          res.body.message.should.equal(input.message);
          done();
        });
    });
  });
});

// Follow user
inputs = [{
  testcase_description: "Successful follow user check",
  follow_id: "63b97922215c8ab4f721aecf",
  statusCode: 200,
  success: true,
  message: "User followed successfully"
}, {
  testcase_description: "Follow user without id",
  follow_id: "63b97922215c8ab4f721aec",
  statusCode: 404,
  success: false,
  message: "Invalid Follow ID"
}]

inputs.forEach(input => {
  describe(`POST ${input.testcase_description}`, () => {
    it("following user", (done) => {
      chai
        .request(API)
        .post(`/api/follow/${input.follow_id}`)
        .set("Authorization", "Bearer " + process.env.SAMPLE_TOKEN)
        .end((err, res) => {
          console.log(res.body);
          res.should.have.status(input.statusCode);
          res.body.should.be.a("object");
          res.body.should.be.have.property("success");
          res.body.success.should.equal(input.success);
          res.body.should.be.have.property("message");
          res.body.message.should.equal(input.message);
          done();
        });
    });
  });
});
