const express = require("express");
const jwt = require("jsonwebtoken");
const authorize = require("./Authmiddleware");
const multer = require("multer");
var cors = require("cors");
var bodyParser = require("body-parser");
var path = require("path");
var nodemailer = require("nodemailer");
const { from } = require("form-data");
var DateDiff = require("date-diff");

// const upload = multer({ dest: 'uploads/' })
app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

const db = require("./db");
var dateTime = require("node-datetime");
const DateTime = require("node-datetime/src/datetime");

app.post("/", function (req, res) {
  //   res.send("hello");
  var success_code;
  var success_message;
  var error_code;
  var error_message;

  var fname = req.body.fname;

  var lname = req.body.lname;
  var mobileno = req.body.mobileno;
  var address = req.body.address;
  var country = req.body.country;
  var pincode = req.body.pincode;
  var Idproof = req.body.Idproof;
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var dt = dateTime.create();
  var UpdatedAt = dt.format("Y-m-d H:M:S");

  var sql =
    "INSERT INTO `register`(`FirstName`, `LastName`, `MobileNo`, `Address`, `Country`, `PinCode`, `IdProof`, `UserName`, `Email`, `Password`,`date`) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
  db.query(
    sql,
    [
      fname,
      lname,
      mobileno,
      address,
      country,
      pincode,
      Idproof,
      username,
      email,
      password,
      UpdatedAt,
    ],
    function (err, result) {
      if (err) throw err;
      else {
        success_code = 1;
        success_message = "Data has been submitted!";
        error_code = "";
        error_message = "";
        var finalData = {
          Success: success_code,
          message: success_message,
          error: { error_code: error_code, error_message: error_message },
        };
        res.send(finalData);
      }
    }
  );
  // res.redirect('/document')
});

app.post("/login", function (req, res) {
  var success_code;
  var success_message;
  var error_code;
  var error_message;
  var data;
  var email = req.body.email;
  var password = req.body.password;
  var sql = `select * from register where Email=? and Password=?`;
  db.query(sql, [email, password], function (err, result) {
    if (result.length > 0) {
      // res.send("found")
      var token = jwt.sign({ email: email }, "secret", { expiresIn: "1h" });
      success_code = 1;
      success_message = "Succesfully Logged In!";
      error_code = "";
      error_message = "";
      data = { token };
      var finalData = {
        Success: success_code,
        message: success_message,
        data: data,
        error: { error_code: error_code, error_message: error_message },
      };
    } else {
      success_code = "";
      success_message = "";
      error_code = "400";
      error_message = "There is some error in the Api!";
      data = "";
      var finalData = {
        Success: success_code,
        message: success_message,
        data: data,
        error: { error_code: error_code, error_message: error_message },
      };
    }
    res.send(finalData);
  });
});

app.post("/contact", function (req, res) {
  console.log("asmkasm.......", req.body);
  var name = req.body.name;
  var email = req.body.email;
  var mobileno = req.body.mobileno;
  var address = req.body.address;
  var message = req.body.message;
  var dt = dateTime.create();
  var UpdatedAt = dt.format("Y-m-d H:M:S");

  var sql =
    "INSERT INTO `contact`(`Name`, `Email`, `MobileNo`, `Address`, `Message`,`date`) VALUES (?,?,?,?,?,?)";
  db.query(
    sql,
    [name, email, mobileno, address, message, UpdatedAt],
    function (err, result) {
      if (err) throw err;
      else {
        res.send(
          "Your query has been submitted. we'll contact you as soon as possible."
        );
      }
    }
  );
});

app.get("/contact-list", function (req, res) {
  var sql = "SELECT * FROM `contact` ";
  var success_code;
  var success_message;
  var error_code;
  var error_message;
  var data;

  db.query(sql, function (err, result) {
    console.log("sq...", sql);
    if (err) throw err;
    else {
      success_code = 1;
      success_message = "All Contacts";
      error_code = "";
      error_message = "";
      data = result;
      var finalData = {
        Success: success_code,
        message: success_message,
        error: { error_code: error_code, error_message: error_message },
        data: data,
      };
      res.send(finalData);
    }
  });
});
app.post("/upload", function (req, res) {
  var fname = req.body.fname;
  var lname = req.body.lname;
  var mobileno = req.body.mobileno;
  var address = req.body.address;
  var document = req.body.document;
  var status = 0;
  var dt = dateTime.create();
  var UpdatedAt = dt.format("Y-m-d H:M:S");

  var sql =
    "INSERT INTO `upload`(`FirstName`, `LastName`, `MobileNo`, `Address`, `Document`, `Status`, `UpdatedAt`) VALUES (?,?,?,?,?,?,?)";
  db.query(
    sql,
    [fname, lname, mobileno, address, document, status, UpdatedAt],
    function (err, result) {
      if (err) throw err;
      else {
        res.send("Successfully Uploaded!");
      }
    }
  );
});

app.post("/onetoone", authorize(), function (req, res) {
  var fname = req.body.fname;
  var lname = req.body.fname;
  var mobileno = req.body.mobileno;
  var address = req.body.address;
  var upload = req.body.upload;
  // var dt = dateTime.create();
  // var UpdatedAt = dt.format('Y-m-d H:M:S');

  var sql =
    "INSERT INTO `onetoone`(`FirstName`, `LastName`, `Mobile`, `Address`, `Upload`) VALUES (?,?,?,?,?)";

  db.query(
    sql,
    [fname, lname, mobileno, address, upload],
    function (err, result) {
      if (err) throw err;
      else {
        res.send("Successfull!");
      }
    }
  );
});

app.post("/course", function (req, res) {
  var success_code;
  var success_message;
  var error_code;
  var error_message;
  var data;
  var name = req.body.name;
  var subject = req.body.subject;
  var thumbnail = req.body.thumbnail;
  var time = req.body.time;
  var status = req.body.status;
  // var dt = dateTime.create();
  // var UpdatedAt = dt.format('Y-m-d H:M:S');

  var sql =
    "INSERT INTO `courses`(`name`, `subject`, `thumbnail`, `time(inDays)`,`status`) VALUES (?,?,?,?,?)";

  db.query(
    sql,
    [name, subject, thumbnail, time, status],
    function (err, result) {
      if (err) throw err;
      else {
        success_code = 1;
        success_message = "Course added Successfully!!";
        error_code = "";
        error_message = "";
        var finalData = {
          Success: success_code,
          message: success_message,
          error: { error_code: error_code, error_message: error_message },
        };
        res.send(finalData);
      }
    }
  );
});

app.get("/students", authorize(), function (req, res) {
  var id = req.body.id;
  var sql = `select * from student where id=?`;
  db.query(sql, id, function (err, result) {
    if (err) throw err;
    else {
      res.send(result);
    }
  });
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 100000,
    //  fileFilter	:['.jpg', '.jpeg', '.png', '.gif', '.pdf']
  },
});

//   const upload = multer({ storage: storage })

app.post("/document", authorize(), upload.single("doc"), function (req, res) {
  var username = req.username;
  var file = req.file;
  // console.log(file, req.body)
  if (!file) {
    return res.status(400).send({ message: "Please upload a file." });
  }

  var sql = "INSERT INTO `documents`(`Username`, `Document`) VALUES (?,?)";

  db.query(sql, [username, req.file.filename], function (err, result) {
    return res.send({ message: "File uploaded successfully.", file });
  });
});

app.post("/avail", function (req, res) {
  var student_id = req.body.student_id;
  var student_name = req.body.student_name;
  var course_id = req.body.course_id;
  var course_name = req.body.course_name;
  var dt = dateTime.create();
  var isueDate = dt.format("Y-m-d H:M:S");

  var sql =
    "INSERT INTO `course_student`(`student_id`,`student_name`, `course_id`, `course_name`, `issue_date`) VALUES (?,?,?,?,?)";
  db.query(
    sql,
    [student_id, student_name, course_id, course_name, isueDate],
    function (err, result) {
      if (err) throw err;
      var sql_sql = "select email from register where username=?";
      db.query(sql_sql, student_name, function (err, result) {
        if (err) throw err;
        console.log(result[0].email);
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "radssharma18@gmail.com",
            pass: "otjpgllhyfibqigs",
          },
        });

        var mailOptions = {
          from: "radssharma18@gmail.com", // sender address
          to: result[0].email, // comma separated list of receivers
          subject: "SMS from Courses.com ",
          // Subject line
          text: "You have successfully enrolled in " + course_name, // plaintext body
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      });
    }
  );
});

app.post("/active", function (req, res) {
  var student_id = req.body.student_id;
  var sql = "select student_id from course_student where student_id=?";

  db.query(sql, student_id, function (err, result) {
    if (result.length == 0) {
      res.send("You havn't enrolled in any course yet!");
    } else {
      res.send("You are already enrolled!");
    }
  });
});

app.post("/timeLeft", function (req, res) {
  var student_id = req.body.student_id;
  var t = new Date();
  // var time=t.getDate()+","+t.getMonth()+","+t.getFullYear()
  // console.log(time)
  var sql = `select issue_date from course_student where student_id=?`;
  db.query(sql, student_id, function (err, result) {
    // res.send(result)
    // console.log(result[0].issue_date.getTime())
    // result=result[0].issue_date.getDate()+","+result[0].issue_date.getMonth()+","+result[0].issue_date.getFullYear()
    // console.log(result)
    // var Difference_In_Time = time.getTime() - result.getTime();
    // var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    // res.send("you have "+Difference_In_Days+" Days only!")
    Time_ = getDifferenceInDays(t, result[0].issue_date);
    if (Time_ < 30) {
      res.send("you have " + (30 - Time_) + " Days to complete this course.");
    }
    if (Time_ > 30) {
      res.send(
        "your Plan has been expired! you need to enroll this course again."
      );
    }
    if (Time_ == 30) {
      res.send("Today is the last day. Please complete all the assignment.");
    }

    // res.send("you have "+Time_+" Days to complete this course.")

    function getDifferenceInDays(date1, date2) {
      const diffInMs = Math.abs(date2 - date1);
      return Math.round(diffInMs / (1000 * 60 * 60 * 24));
    }
  });
});

app.post("/addProducts", function (req, res) {
  //   res.send("hello");
  var productName = req.body.productName;
  var productImage = req.body.productImage;
  var productDescription = req.body.productDescription;
  var productPrice = req.body.productPrice;
  var status = req.body.status;
  var dt = dateTime.create();
  var UpdatedAt = dt.format("Y-m-d H:M:S");

  var sql =
    "INSERT INTO `products`(`ProductName`, `ProductImage`, `ProductDescription`, `ProductPrice`, `Status`, `Date`) VALUES (?,?,?,?,?,?)";
  db.query(
    sql,
    [
      productName,
      productImage,
      productDescription,
      productPrice,
      status,
      UpdatedAt,
    ],
    function (err, result) {
      if (err) throw err;
      else {
        res.send("Data has been submitted!");
      }
    }
  );
  // res.redirect('/document')
});

app.post("/editProducts", async function (req, res) {
  //   res.send("hello");
  var productId = req.body.productId;
  var productName = req.body.productName;
  var productImage = req.body.productImage;
  var productDescription = req.body.productDescription;
  var productPrice = req.body.productPrice;
  var status = req.body.status;
  var dt = dateTime.create();
  var UpdatedAt = dt.format("Y-m-d H:M:S");

  await db.query(
    "UPDATE products SET ProductName = '" +
      productName +
      "' , ProductImage = '" +
      productImage +
      "', ProductDescription = '" +
      productDescription +
      "' , ProductPrice = '" +
      productPrice +
      "', Status = '" +
      status +
      "', Date = '" +
      UpdatedAt +
      "' WHERE  id = '" +
      productId +
      "' "
  );
  res.send("Data has been updated!");
});

app.get("/all-products", function (req, res) {
  var sql = "SELECT * FROM `products` WHERE `Status`=0 ";
  var success_code;
  var success_message;
  var error_code;
  var error_message;
  var data;

  db.query(sql, function (err, result) {
    console.log("sq...", sql);
    if (err) throw err;
    else {
      success_code = 1;
      success_message = "All Products";
      error_code = "";
      error_message = "";
      data = result;
      var finalData = {
        Success: success_code,
        message: success_message,
        error: { error_code: error_code, error_message: error_message },
        data: data,
      };
      res.send(finalData);
    }
  });
});

app.get("/all-courses", function (req, res) {
  var sql = "SELECT * FROM `courses` ";
  var success_code;
  var success_message;
  var error_code;
  var error_message;
  var data;

  db.query(sql, function (err, result) {
    console.log("sq...", sql);
    if (err) throw err;
    else {
      success_code = 1;
      success_message = "All Courses";
      error_code = "";
      error_message = "";
      data = result;
      var finalData = {
        Success: success_code,
        message: success_message,
        error: { error_code: error_code, error_message: error_message },
        data: data,
      };
      res.send(finalData);
    }
  });
});

// app.post("/activate-deactivate-products", function (req, res) {
//   var productId = req.body.productId;
//   var action = req.body.action; // 0 deactive  1 active
//   if (action === 1) {
//     var sql = "UPDATE `products` SET `Status`=1 WHERE `id` = ?";
//   } else if (action === 0) {
//     var sql = "UPDATE `products` SET `Status`=0 WHERE `id` = ?";
//   }
//   db.query(sql, productId, function (err, result) {
//     if (err) throw err;
//     else {
//       res.send("Status has been Updated!");
//     }
//   });
// });

app.post("/single-product", function (req, res) {
  var productId = req.body.productId;
  var sql = "SELECT * FROM `products` WHERE `id` = ?";
  db.query(sql, productId, function (err, result) {
    if (err) throw err;
    else {
      success_code = 1;
      success_message = "Single Product";
      error_code = "";
      error_message = "";
      data = result;
      var finalData = {
        Success: success_code,
        message: success_message,
        error: { error_code: error_code, error_message: error_message },
        data: data,
      };
      res.send(finalData);
    }
  });
});

app.get("/getSlips", function (req, res) {
  var sql = "SELECT * FROM `upload` WHERE `Status`= 0 ";
  var success_code;
  var success_message;
  var error_code;
  var error_message;
  var data;

  db.query(sql, function (err, result) {
    if (err) throw err;
    else {
      success_code = 1;
      success_message = "All Slips";
      error_code = "";
      error_message = "";
      data = result;
      var finalData = {
        Success: success_code,
        message: success_message,
        error: { error_code: error_code, error_message: error_message },
        data: data,
      };
      res.send(finalData);
    }
  });
});

app.post("/active-deactive", async function (req, res) {
  var success_code;
  var success_message;
  var error_code;
  var error_message;
  var data;

  var actionTaken = req.body.action; //1
  var id = req.body.id;

  try {
    if (actionTaken == 1) {
      var sql = "UPDATE upload SET Status=1 WHERE Id =?";
      db.query(sql, [id], function (err, result) {
        if (err) throw err;
        else {
          success_code = 1;
          success_message = "Accepted";
          error_code = "";
          error_message = "";
          var finalData = {
            Success: success_code,
            message: success_message,
            error: { error_code: error_code, error_message: error_message },
          };
          res.send(finalData);
        }
      });
    } else if (actionTaken == 2) {
      var sql = "UPDATE upload SET Status=2 WHERE Id =?";
      db.query(sql, [id], function (err, result) {
        if (err) throw err;
        else {
          success_code = 1;
          success_message = "Rejected";
          error_code = "";
          error_message = "";
          var finalData = {
            Success: success_code,
            message: success_message,
            error: { error_code: error_code, error_message: error_message },
          };
          res.send(finalData);
        }
      });
    }
  } catch (err) {
    (success_code = 0),
      (success_message = ""),
      (error_code = 500),
      (error_message = "Something went wrong into the api");
    data = {};
  }
});

app.listen(5000);
