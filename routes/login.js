var express = require('express');
var router = express.Router();
var request = require('request');
//var session_data;

router.use(function log(req, res, next){
  next();
});



router.get('/', function(req, res){
	session_data = req.session;
	if(session_data.username){
		res.redirect('checklist');
	}
	else{
		res.render('login',{
			error: null
		});
	}
	
});

router.post('/', function(req, res){

	session_data = req.session;
	var options = {
		url: req.protocol + '://' + req.get('host') + '/logincheck', 
		form: {"username":req.body.username, "password":req.body.password}
	};

	request.post(options, function(request, response){
		var body =  JSON.parse(response.body);
		var check = body.status;

		if(check){
			session_data.username = req.body.username;
			session_data.password = req.body.password;
			req.session.save();
			res.redirect('checklist');
		}
		else{
			res.render('login',{
				error: body.error
			});
		}
	});
});


module.exports = router;