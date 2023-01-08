import chai from "chai";
import chaiHttp from "chai-http";
import { config } from "dotenv";
const should = chai.should();

config({
  path: "./config/config.env",
});

const API = process.env.BASE_URL;
chai.use(chaiHttp);

// Create post
let testcases = [
  {
    describeText: "Post creating post with title field missing",
    title: "",
    description: "test post description",
    message: "Title can't be empty",
  },
  {
    describeText: "Post creating post with description field missing",
    title: "test post",
    description: "",
    message: "Description can't be empty",
  },
];

describe("Post successful creation check", () => {
  it("adding post", (done) => {
    chai
      .request(API)
      .post("/api/posts")
      .set("Authorization", "Bearer " + process.env.SAMPLE_TOKEN)
      .send({
        title: "test post",
        description: "this is my test post",
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a("object");
        res.body.should.be.have.property("success");
        res.body.success.should.equal(true);
        res.body.should.be.have.property("post_details");
        res.body.post_details.should.be.a("object");
        done();
      });
  });
});

testcases.forEach((testcase) => {
  describe(`${testcase.describeText}`, () => {
    it("adding post", (done) => {
      chai
        .request(API)
        .post("/api/posts")
        .set("Authorization", "Bearer " + process.env.SAMPLE_TOKEN)
        .send({
          title: testcase.title,
          description: testcase.description,
        })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a("object");
          res.body.should.be.have.property("success");
          res.body.success.should.equal(false);
          res.body.should.be.have.property("message");
          res.body.message.should.equal(testcase.message);
          done();
        });
    });
  });
});

// Delete post
testcases = [
  {
    describeText: "Delete successful deletion check",
    postId: "63b993ab5337fe2ba2597f87",
    statusCode: 200,
    success: true,
    message: "Post deleted successfully",
  },
  {
    describeText: "Delete successful deletion check",
    postId:"63badfd6cdd3d63abba9b57",
    statusCode: 404,
    success: false,
    message: "Post id is invalid",
  },
];
testcases.forEach((testcase) => {
  describe(`${testcase.describeText}`, () => {
    it("deleting post", (done) => {
      chai
        .request(API)
        .delete(`/api/posts/${testcase.postId}`)
        .set("Authorization", "Bearer " + process.env.SAMPLE_TOKEN)
        .end((err, res) => {
          res.should.have.status(testcase.statusCode);
          res.body.should.be.a("object");
          res.body.should.be.have.property("success");
          res.body.success.should.equal(testcase.success);
          res.body.should.be.have.property("message");
          res.body.message.should.equal(testcase.message);
          done();
        });
    });
  });
});
