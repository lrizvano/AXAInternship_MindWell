var questionNum = 0; // keep count of question, used for IF condition.
var question = '<h1>What is your name?</h1>'; // first question

var output = document.getElementById('output'); // store id="output" in output variable
output.innerHTML = question; // ouput first question

function bot() { 
   	var input = document.getElementById("input").value;
    	console.log(input);

	if (questionNum == 0) {
    		output.innerHTML = '<h1>Hello ' + input + ', my name is Edison.</h1>'; // output response
    		document.getElementById("input").value = ""; // clear text box
    		question = '<h1>How is your project going?</h1>'; // load next question		
    		setTimeout(timedQuestion, 2000); // output next question after 2sec delay
    	}
    	else if (questionNum == 1) {
    		if (input.includes("good")) {
			output.innerHTML = '<h1>I\'m glad to hear that!</h1>';
    			document.getElementById("input").value = "";   
    			question = '<h1>Is there room for improvement?</h1>';					      	
    			setTimeout(timedQuestion, 2000);
		}
		else if (input.includes("bad")) {
			output.innerHTML = '<h1>I\'m sorry to hear that.</h1>';
    			document.getElementById("input").value = "";   
    			question = '<h1>What is making you feel this way?</h1>';					      	
    			setTimeout(timedQuestion, 2000);
		}
    	}
    	else if (questionNum == 2) {
    		if (input.includes("yes")) {
			output.innerHTML = '<h1>Here\'s a book that I recommend: </h1><a href="https://www.amazon.com/Improvement-Guide-Practical-Organizational-Performance/dp/0470192410">Book</a>';
    			document.getElementById("input").value = "";   
    			question = '<h1>Was that helpful?</h1>';					      	
    			setTimeout(timedQuestion, 2000);
		}
		else if (input.includes("no")) {
			output.innerHTML = '<h1>Here\'s a picture that could help: </h1><a href=""http://images2.minutemediacdn.com/image/upload/c_fit,f_auto,fl_lossy,q_auto,w_728/v1555916687/shape/mentalfloss/cognitive_biases.png>Book</a>';
    			document.getElementById("input").value = "";   
    			question = '<h1>Was that helpful?</h1>';					      	
    			setTimeout(timedQuestion, 2000);
		}
		else if (input.includes("time")) {

		}
		else if (input.includes("stuck")) {

		}
    	}
	else {
		
	}
}

function timedQuestion() {
    	output.innerHTML = question;
}

//push enter key (using jquery), to run bot function.
$(document).keypress(function(e) {
  	if (e.which == 13) {
    		bot(); // run bot function when enter key pressed
    		questionNum++; // increase questionNum count by 1
  	}
});
