import chai from "chai";
import chaiHttp from "chai-http";
import { config } from "dotenv";
const should = chai.should();

config({
  path: "./config/config.env",
});

const API = process.env.BASE_URL;
console.log(API)
chai.use(chaiHttp);

describe("/POST testing user authentication", () => {
  it("logging in the user", (done) => {
    chai.request(API).post("/api/authenticate").send({
      email: "abhay@gmail.com",
      password: "Abhay@123",
    }).end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.be.have.property("success");
        res.body.success.should.equal(true);
        res.body.should.be.have.property("jwt_token");
        res.body.jwt_token.should.be.a("string");
        done();
    })
  });
});

let inputs = [{
  describeText: "with invalid password",
  email: "abhay@gmail.com",
  password: "Abhay123",
  message: "Incorrect Password"
}, {
  describeText: "with invalid email",
  email: "abhay1@gmail.com",
  password: "Abhay@123",
  message: "Incorrect Email"
}]

inputs.forEach((input)=>{
  describe(`/POST testing user authentication ${input.describeText}`, () => {
    it("logging in the user", (done) => {
      chai.request(API).post("/api/authenticate").send({
        email: input.email,
        password: input.password,
      }).end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a("object");
          res.body.should.be.have.property("success");
          res.body.success.should.equal(false);
          res.body.should.be.have.property("message");
          res.body.message.should.equal(input.message);
          done();
      })
    });
  });  
})