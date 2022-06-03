const express = require("express");
const jwt = require("jsonwebtoken");
const authorize = require("./Authmiddleware");
const multer = require('multer')
var bodyParser = require('body-parser');
var path = require('path');
var nodemailer = require("nodemailer");
const { from } = require('form-data');
var DateDiff = require('date-diff');

// const upload = multer({ dest: 'uploads/' })
app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

const db = require("./db")
var dateTime = require('node-datetime');
const DateTime = require("node-datetime/src/datetime");

app.post("/", function (req, res) {

    // res.send("hello")s
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
    var UpdatedAt = dt.format('Y-m-d H:M:S');

    var sql = "INSERT INTO `register`(`FirstName`, `LastName`, `MobileNo`, `Address`, `Country`, `PinCode`, `IdProof`, `UserName`, `Email`, `Password`,`date`) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
    db.query(sql, [fname, lname, mobileno, address, country, pincode, Idproof, username, email, password, UpdatedAt], function (err, result) {
        if (err) throw err
        else {
            res.send("Data has been submitted!")
        }
    })
    // res.redirect('/document')
})

app.post("/login", function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var sql = `select * from register where Email=? and Password=?`;
    db.query(sql, [email, password], function (err, result) {
        if (result.length > 0) {
            // res.send("found")
            var token = jwt.sign({ email: email }, 'secret', { expiresIn: "1h" })
            console.log(token)
        }
        res.send("Now you are logged in!")
    })
})

app.post("/contact", authorize(), function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var mobileno = req.body.mobileno;
    var address = req.body.address;
    var message = req.body.message;
    var dt = dateTime.create();
    var UpdatedAt = dt.format('Y-m-d H:M:S');


    var sql = "INSERT INTO `contact`(`Name`, `Email`, `MobileNo`, `Address`, `Message`,`date`) VALUES (?,?,?,?,?,?)";
    db.query(sql, [name, mobileno, address, email, message, UpdatedAt], function (err, result) {
        if (err) throw err
        else {
            res.send("Your query has been submitted. we'll contact you as soon as possible.")
        }
    })
})


app.post("/upload", authorize(), function (req, res) {
    var fname = req.body.fname;
    var lname = req.body.fname;
    var mobileno = req.body.mobileno;
    var address = req.body.address;
    var document = req.body.document;
    var dt = dateTime.create();
    var UpdatedAt = dt.format('Y-m-d H:M:S');



    var sql = "INSERT INTO `upload`(`FirstName`, `LastName`, `MobileNo`, `Address`, `Document`, `UpdatedAt`) VALUES (?,?,?,?,?,?)";
    db.query(sql, [fname, lname, mobileno, address, document, UpdatedAt], function (err, result) {
        if (err) throw err
        else {
            res.send("Successfully Uploaded!")
        }
    })
})

app.post("/onetoone", authorize(), function (req, res) {
    var fname = req.body.fname;
    var lname = req.body.fname;
    var mobileno = req.body.mobileno;
    var address = req.body.address;
    var upload = req.body.upload;
    // var dt = dateTime.create();
    // var UpdatedAt = dt.format('Y-m-d H:M:S');



    var sql = "INSERT INTO `onetoone`(`FirstName`, `LastName`, `Mobile`, `Address`, `Upload`) VALUES (?,?,?,?,?)";

    db.query(sql, [fname, lname, mobileno, address, upload], function (err, result) {
        if (err) throw err
        else {
            res.send("Successfull!")
        }
    })
})


app.post("/course", authorize(), function (req, res) {
    var name = req.body.name;
    var subject = req.body.subject;
    var thumbnail = req.body.thumbnail;
    var time = req.body.time;
    // var dt = dateTime.create();
    // var UpdatedAt = dt.format('Y-m-d H:M:S');



    var sql = "INSERT INTO `courses`(`name`, `subject`, `thumbnail`, `time(inDays)`) VALUES (?,?,?,?";

    db.query(sql, [name, subject, thumbnail, time], function (err, result) {
        if (err) throw err
        else {
            res.send("Successfull!")
        }
    })
})


app.get("/students", authorize(), function (req, res) {
    var id = req.body.id;
    var sql = `select * from student where id=?`;
    db.query(sql, id, function (err, result) {
        if (err) throw err
        else {
            res.send(result)
        }
    })
})




var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 100000,
        //  fileFilter	:['.jpg', '.jpeg', '.png', '.gif', '.pdf']
    }
});


//   const upload = multer({ storage: storage })

app.post("/document", authorize(), upload.single("doc"), function (req, res) {
    var username = req.username
    var file = req.file
    // console.log(file, req.body)
    if (!file) {
        return res.status(400).send({ message: 'Please upload a file.' });
    }

    var sql = "INSERT INTO `documents`(`Username`, `Document`) VALUES (?,?)";

    db.query(sql, [username, req.file.filename], function (err, result) {
        return res.send({ message: 'File uploaded successfully.', file });
    });

})


app.post("/avail", function (req, res) {
    var student_id = req.body.student_id;
    var student_name = req.body.student_name;
    var course_id = req.body.course_id;
    var course_name = req.body.course_name;
    var dt = dateTime.create();
    var isueDate = dt.format('Y-m-d H:M:S');

    var sql = "INSERT INTO `course_student`(`student_id`,`student_name`, `course_id`, `course_name`, `issue_date`) VALUES (?,?,?,?,?)"
    db.query(sql, [student_id, student_name, course_id, course_name, isueDate], function (err, result) {
        if (err) throw err;
        var sql_sql = "select email from register where username=?"
        db.query(sql_sql, student_name, function (err, result) {
            if (err) throw err;
            console.log(result[0].email)
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: "radssharma18@gmail.com",
                    pass: "otjpgllhyfibqigs"
                }
            });

            var mailOptions = {
                from: "radssharma18@gmail.com", // sender address
                to: result[0].email, // comma separated list of receivers
                subject: "SMS from Courses.com ",
                // Subject line
                text: "You have successfully enrolled in " + course_name // plaintext body
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        })
    })

})


app.post("/active",function(req,res){
    var student_id= req.body.student_id
    var sql = "select student_id from course_student where student_id=?";

    db.query(sql, student_id, function (err, result) {
   
        if (result.length==0)
         {
            res.send("You havn't enrolled in any course yet!")
        }
        else {
            res.send("You are already enrolled!")
        }
    })
})

app.post("/timeLeft",function(req,res){
    var student_id= req.body.student_id
    var t=new Date()
    // var time=t.getDate()+","+t.getMonth()+","+t.getFullYear()
    // console.log(time)
    var sql=`select issue_date from course_student where student_id=?`
    db.query(sql,student_id,function(err,result){
        // res.send(result)
        // console.log(result[0].issue_date.getTime())
        // result=result[0].issue_date.getDate()+","+result[0].issue_date.getMonth()+","+result[0].issue_date.getFullYear()
        // console.log(result)
        // var Difference_In_Time = time.getTime() - result.getTime();
        // var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        // res.send("you have "+Difference_In_Days+" Days only!")
        Time_=getDifferenceInDays(t,result[0].issue_date);
        if (Time_<30){
            res.send("you have "+(30-Time_)+" Days to complete this course.")
        }
        if (Time_>30){
            res.send("your Plan has been expired! you need to enroll this course again.")
        }
        if (Time_==30){
            res.send("Today is the last day. Please complete all the assignment.")
        }



        // res.send("you have "+Time_+" Days to complete this course.")

        function getDifferenceInDays(date1, date2) {
            const diffInMs = Math.abs(date2 - date1);
            return Math.round(diffInMs / (1000 * 60 * 60 * 24));
          }

    })

})


app.listen(5000)