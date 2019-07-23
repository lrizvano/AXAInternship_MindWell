var questionNum = 0; // keep count of question, used for IF condition.
var question = '<h1>Press Enter to Begin</h1>'; // first question

var output = document.getElementById('output'); // store id="output" in output variable
output.innerHTML = question; // ouput first question

function bot() { 
   	var input = document.getElementById("input").value;
    	console.log(input);

	if (questionNum == 0) {
    		output.innerHTML = '<h1>My name is Edison and I help ideate.</h1>'; // output response
    		document.getElementById("input").value = ""; // clear text box
    		question = '<h1>How is your project going?</h1>'; // load next question		
    		setTimeout(timedQuestion, 2000); // output next question after 2sec delay
    	}
    	else if (questionNum == 1) {
    		if (input.includes("good")) {
			output.innerHTML = '<h1>I\'m glad to hear that!</h1>';
    			document.getElementById("input").value = "";   
    			question = '<h1>Do you know how you could improve it?</h1>';					      	
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
			output.innerHTML = '<h1>Here\'s a book that I recommend:</h1><img src="https://www.amazon.com/Improvement-Guide-Practical-Organizational-Performance/dp/0470192410">';
    			document.getElementById("input").value = "";   
    			question = '<h1>Was that helpful?</h1>';					      	
    			setTimeout(timedQuestion, 2000);
		}
		else if (input.includes("no")) {
			output.innerHTML = '<h1>This guide helps you consider other possibilities.</h1>';
    			setTimeout(timedQuestion, 2000);
			document.getElementById("input").value = "";   
    			question = '<h1>Was that helpful?</h2><img src="http://images2.minutemediacdn.com/image/upload/c_fit,f_auto,fl_lossy,q_auto,w_728/v1555916687/shape/mentalfloss/cognitive_biases.png" class="centered">';					      	
    			setTimeout(timedQuestion, 2000);
		}
		else if (input.includes("time")) {
			window.open("../pages/modules.html");
		}
		else if (input.includes("stuck")) {

		}
    	}
	else if (questionNum == 3) {
		if (input.includes("yes")) {
			output.innerHTML = '<h1>That\'s very good news.</h1>';
    			document.getElementById("input").value = "";   
    			question = '<h1>What else can I help with?</h1>';					      	
    			setTimeout(timedQuestion, 2000);
		}
		else if (input.includes("no")) {
			output.innerHTML = '<h1>Let\'s see if I can try again.</h1>';
    			document.getElementById("input").value = "";   
    			question = '<h1>What exactly is bothering you?</h1>';					      	
    			setTimeout(timedQuestion, 2000);
		}
	}
	else if (questionNum == 4) {
		if (input.includes("perspective")) {
			output.innerHTML = '<h1>Take a look at this excel sheet.</h1>';
    			document.getElementById("input").value = "";   
    			question = '<h1>What else can I help with?</h1>';					      	
    			setTimeout(timedQuestion, 2000);
		}
		else if (input.includes("stockholder")) {
			output.innerHTML = '<h1>Take a look at this excel sheet.</h1>';
    			document.getElementById("input").value = "";   
    			question = '<h1>What exactly is bothering you?</h1>';					      	
    			setTimeout(timedQuestion, 2000);
		}
	}
	else {
		output.innerHTML = '<h1>I\'m sorry to hear that.</h1>';
    		document.getElementById("input").value = "";   
    		question = '<h1>What is making you feel this way?</h1>';					      	
  		setTimeout(timedQuestion, 2000);
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
