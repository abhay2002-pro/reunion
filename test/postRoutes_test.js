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
    postId: "63bae8a0e20ab82b7855012c",
    statusCode: 200,
    success: true,
    message: "Post deleted successfully",
  },
  {
    describeText: "Delete deletion with invalid post id",
    postId: "63b99a15b1175dc7c933c0",
    statusCode: 404,
    success: false,
    message: "Post id is invalid",
  },
  {
    describeText: "Delete deletion with valid post id but not present in DB",
    postId: "63b99a15b1175dc7c933c0a8",
    statusCode: 404,
    success: false,
    message: "Post not found",
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

// Like a post
testcases = [
  {
    describeText: "Post successful like check",
    postId: "63badda97dee347e2f2b07dc",
    statusCode: 200,
    success: true,
    message: "Post liked successfully",
  },
  {
    describeText: "Post like post with invalid id",
    postId: "63badda97dee347e2f2b07d",
    statusCode: 404,
    success: false,
    message: "Post id is invalid",
  },
  {
    describeText: "Post like post with valid post id but not present in DB",
    postId: "63bacccd4d480a739c139347",
    statusCode: 404,
    success: false,
    message: "Post not found",
  },
  {
    describeText: "Post like already liked post",
    postId: "63badda97dee347e2f2b07dc",
    statusCode: 404,
    success: false,
    message: "Post already liked by user",
  },
];
testcases.forEach((testcase) => {
  describe(`${testcase.describeText}`, () => {
    it("liking post", (done) => {
      chai
        .request(API)
        .post(`/api/like/${testcase.postId}`)
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

// Dislike a post
testcases = [
  {
    describeText: "Post successful unlike check",
    postId: "63badda97dee347e2f2b07dc",
    statusCode: 200,
    success: true,
    message: "Post unliked successfully",
  },
  {
    describeText: "Post unlike post with invalid id",
    postId: "63badda97dee347e2f2b07d",
    statusCode: 404,
    success: false,
    message: "Post id is invalid",
  },
  {
    describeText: "Post unlike post with valid post id but not present in DB",
    postId: "63bacccd4d480a739c139347",
    statusCode: 404,
    success: false,
    message: "Post not found",
  },
  {
    describeText: "Post unlike post that is not liked by the user",
    postId: "63bace15513f5cf0d718a6fd",
    statusCode: 404,
    success: false,
    message: "Post is not liked by the user",
  },
];
testcases.forEach((testcase) => {
  describe(`${testcase.describeText}`, () => {
    it("liking post", (done) => {
      chai
        .request(API)
        .post(`/api/unlike/${testcase.postId}`)
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

// Add a comment
describe(`Post sucessfully add comment to a post check`, () => {
  it("adding comment", (done) => {
    chai
      .request(API)
      .post(`/api/comment/63badda97dee347e2f2b07dc`)
      .set("Authorization", "Bearer " + process.env.SAMPLE_TOKEN)
      .send({
        description: "this is my comment's description",
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a("object");
        res.body.should.be.have.property("success");
        res.body.success.should.equal(true);
        res.body.should.be.have.property("comment_id");
        res.body.comment_id.should.be.a("string");
        done();
      });
  });
});
testcases = [
  {
    describeText: "Post add comment with invalid post id",
    postId: "63badda97dee347e2f2b07d",
    description: "this is my comment's description",
    statusCode: 404,
    success: false,
    message: "Post id is invalid",
  },
  {
    describeText:
      "Post add comment with valid post id which is not present in DB",
    postId: "63bacccd4d480a739c139347",
    description: "this is my comment's description",
    statusCode: 404,
    success: false,
    message: "Post not found",
  },
  {
    describeText: "Post add comment with empty input",
    postId: "63bace15513f5cf0d718a6fd",
    description: "",
    statusCode: 404,
    success: false,
    message: "Comment can't be empty",
  },
];
testcases.forEach((testcase) => {
  describe(`${testcase.describeText}`, () => {
    it("adding comment", (done) => {
      chai
        .request(API)
        .post(`/api/comment/${testcase.postId}`)
        .set("Authorization", "Bearer " + process.env.SAMPLE_TOKEN)
        .send({
          description: "",
        })
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

// Get post details of a specific post
describe(`Get post details successfully`, () => {
  it("getting post", (done) => {
    chai
      .request(API)
      .get(`/api/posts/63badda97dee347e2f2b07dc`)
      .set("Authorization", "Bearer " + process.env.SAMPLE_TOKEN)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.be.have.property("success");
        res.body.success.should.equal(true);
        res.body.should.be.have.property("post_details");
        res.body.post_details.should.be.a("object");
        done();
      });
  });
});

testcases = [
  {
    describe: "Get post details with invalid id",
    postId: "63badda97dee347e2f2b07d",
    message: "Post id is invalid",
  },
  {
    describe: "Get post details with valid id but not present in DB",
    postId: "63bacccd4d480a739c139347",
    message: "Post not found",
  },
];

testcases.map((testcase) => {
  console.log(testcase);
  describe(`${testcase.describe}`, () => {
    it("getting post", (done) => {
      chai
        .request(API)
        .get(`/api/posts/${testcase.postId}`)
        .set("Authorization", "Bearer " + process.env.SAMPLE_TOKEN)
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

// Get all posts
describe(`Get post details of all posts successfully`, () => {
  it("getting posts", (done) => {
    chai
      .request(API)
      .get(`/api/all_posts/`)
      .set("Authorization", "Bearer " + process.env.SAMPLE_TOKEN)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.be.have.property("success");
        res.body.success.should.equal(true);
        res.body.should.be.have.property("posts");
        res.body.posts.should.be.a("array");
        done();
      });
  });
});
