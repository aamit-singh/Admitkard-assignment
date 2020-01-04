var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var app = express();


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

Mong =mongoose.connect('mongodb://localhost:27017/mydatabase', {useNewUrlParser: true}).then(console.log("connected"));

var schema = mongoose.Schema;
var studentSchema = new schema({
	name : {type: String, required: true},
	email : {type : String, required: true, unique:true},
	contact : {type :Number, required: true},
	course : {type: String, required: true},
	country : {type: Array, required: true},
	dob : {type: String}
});
student = mongoose.model("student",studentSchema);

app.use('/insert', (req,res) =>{
	console.log('enter insert')
	var newStudent = new student({
	name : req.body.name,
	email : req.body.email,
	contact : req.body.contact,
	course : req.body.course,
	country : [].concat(req.body.country),
	dob : req.body.dob,
	});
	if(newStudent.country[0]==null){
		res.type('html').status(500)
		res.send("Please select preffered countries")
	}
	else{
		var emailq = req.body.email
		newStudent.save( (err) => {
			console.log("entered new student")
			if(err){
				if(String(err).slice(0,18)=='MongoError: E11000'){
					
					student.findOne({email : emailq}, (err,result) =>{
						console.log("found existing student")
						if(err){
							res.type('html').status(500)
							res.send('Error '+ err)
						}
						else if (!result){
							res.type('html').status(404)
							res.send("No results")
						}
						else{
							console.log("entered updation ")
							if(req.body.name){
								result.name = req.body.name
							}
							if(req.body.contact){
								result.contact = req.body.contact
							}
							if(req.body.course){
								result.course = req.body.course
							}
							
							if(req.body.dob){
								result.dob = req.body.dob
							}
							
							console.log(result)
							result.save( (err) => {
								if(!err){
									console.log("updated")
									res.type('html').status(200);
									res.write("<h1>details updated</h1> <br/><br/>")
									res.write("<a href='http://localhost:3000/'> Back to Input details</a>");
									res.end();
								}
								else{
									res.type('html').status(500)
									res.send('Error '+ err)
								}
							})
							
						}
					})
					}
				else{
					res.type('html').status(500)
					res.send('Error '+ err)
				}
			}
			else{
				res.type('html').status(200);
				res.write("<h1>details added</h1> <br/><br/>")
				res.write("<a href='http://localhost:3000/'> Back to Input details</a>");
				res.end();
			}
		})	
	}
}
);

app.use('/getDetails', (req,res) => {
	var emailq = req.query.email;
	res.type('html')
	
	student.findOne({email : emailq}, (err,result) =>{
		if(err){
			res.type('html').status(500)
			res.send('Error '+ err)
		}
		else if (!result){
			res.type('html').status(404)
			res.send("No results")
		}
		else{
			console.log(result)
			name = result.name;
			res.type('html').status(200)
			res.write("Name : " + name + '<br/>')
			res.write("Contact : " + result.contact+ '<br/>')
			res.write("Course : " + result.course+ '<br/>')
			res.write("Country : " + result.country+ '<br/>')
			res.write("Dob : " + result.dob+ '<br/><br/>')
			res.write("<a href='http://localhost:3000/'> Back to Get details</a>");
			res.end()
		}
	})
	
	
	
	
	
}
)

app.listen('3001',()=>{
	console.log("listening on port 3000");
}
)