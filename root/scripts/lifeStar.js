const frame = new Frame("fit", 1920, 1080, "#333333");
frame.on("ready", ()=>{ // ES6 Arrow Function - similar to function(){}
	zog("ready from ZIM Frame"); // logs in console (F12 - choose console)

	// often need below - so consider it part of the template
	let stage = frame.stage;
	let stageW = frame.width;
	let stageH = frame.height;

	// REFERENCES for ZIM at http://zimjs.com
	// see http://zimjs.com/learn.html for video and code tutorials
	// see http://zimjs.com/docs.html for documentation
	// see https://www.youtube.com/watch?v=pUjHFptXspM for INTRO to ZIM
	// see https://www.youtube.com/watch?v=v7OT0YrDWiY for INTRO to CODE

	// CODE HERE

	const space = new Container(5000, 4000).center();

	// create visual border
	// width, height, color, borderColor, borderWidth, corner, dashed
	new Rectangle(space.width, space.height, null, dark, 1, 30, true).addTo(space);

	// create planets
	const planets = new Container().addTo(space);
	loop(60, i=>{
		let planet = new Circle(rand(10,30), [green,blue,pink,red,purple], dark, rand(5,10))
		.loc(rand(0, space.width), rand(0, space.height), planets)
		.cache();
		planet.num = i+1; // could use child index but will be changing layers later
	});

	const lifeStar = new Circle(20, white, "rgba(255,255,255,.4)", 30).center(space);
	// new to ZIM at time of creation - not in docs yet
	// this will make planets move so lifeStar is in middle of screen
	frame.follow({
		obj:lifeStar,
		lag:true // optional 
	});

	// make lifeStar move by pressing down on screen 
	// this is a new setting for MotionController to keep motion moving as view follows target
	const mob = mobile();
	const controller = new MotionController({
		target:lifeStar,
		type:"follow",
		speed:mob?40:20, // optional
		damp:mob?.1:.02, // optional
		boundary:new Boundary(0,0,space.width,space.height), // also need to set in resize event
		container:space // important if target is in a container and not directly on stage
	});

	// make labels for info
	const infoBox = new Container(200,100);
	const message = new Label({
		text:"",
		color:light,
		align:"center"
	}).center(infoBox).mov(0,-20);	
	const terrain = new Label({
		text:"",
		color:tin,
		size:20,
		align:"center"
	}).center(infoBox).mov(0,15);

	// make a highlight ring
	const highlight = new Circle(80, null, white, 30, true).alp(.1);

	// capture movement of the target with the controller
	// test to see if hitting a planet and show matching message using API
	let count = 0;
	let currentPlanet = null;
	let dataShield = null;
	controller.on("moving", ()=>{
		// not necessary but can throttle hitTest 
		if (++count%20) {
			// loop through planets and see if hitting any
			// we will return true from the loop if we are
			let isPlanet = planets.loop(planet=>{						
				if (planet.hitTestCircles(lifeStar)) {
					// do not call api if already calling api (using a " " to know we are waiting)
					// and only call if it is a different planet than our currentPlanet
					if (message.text != " " && planet!=currentPlanet) {
						// here is the API call and we insert the planet num
						var api = `https://swapi.co/api/planets/${planet.num}/?format=json`;
						// ZIM async() uses JSONp 
						// the api returns JSON not JSONp so filter it through a PHP script 
						// You can too - or a sample PHP script is at the bottom of the code
						// JSONp needs a callback and async requires a dot between async and the callback 
						// we also must pass the real reference to the function as the second parameter
						async(`https://zimjs.org/cdn/jsonp.php?api=${api}&callback=async.planetInfo`, planetInfo);
						message.text = " "; // use a " " to know we are waiting
						terrain.text = ""; // also clear terrain text
						dataShield = timeout(500, ()=>{
							// in case data is down - or sluggish
							terrain.text = "...shields are up...";

						});
						currentPlanet = planet.top(); // move planet to top
						planet.uncache(); // we will add highlight and infoBox to planet so uncache
						infoBox.center(planet).alp(0).mov(0,-130);
						highlight.center(planet);
					}
					return true; // still hitting planet
				}
			});
			// test to see the results of the loop - if no hit then reset message
			if (!isPlanet && currentPlanet) {
				highlight.removeFrom();
				message.text = "";
				terrain.text = "";
				currentIndex = -1;
				currentPlanet.cache();
				currentPlanet = null;
				if (dataShield) dataShield.clear();
			}
		}				
	});

	// this gets called by async when data is returned
	function planetInfo(data) {		
		var phrases = ["Our buisness serves a noble purpose", "We are stewards of this business for generations to come", "We aspire to be experts in our passions", "Think big and find innovative ways to enhance the value of our business", "We do the right thing for our clients, our shareholders and our communities", "We operate with strong financial rigor and risk discipline to maximize shareholder value", "We are curious and constantly learning", "We take pride in who we are and what we do", "We work to earn the trust of our clients every day, so they can live their lives with confidence", "We treat every client's dream as if it were our own and put their interest first", "We deliver on our commitments with the utmost integrity", "We strengthen the communities in which we live and work", "We respect our colleagues and  partners and treat them as we would want to be treated", "We work with humility and focus on solutions, not our egos", "We work with good grace and humor and do not tolerate unkindness", "We inspire each other to be the best we can", "We want to work with great people", "We value people from diverse backgrounds", "We set challenging goals for ourselves and take personal accountibility", "We all have a voice but once the decision is made we execute with skill and energy as one team", 

"\"Things work out best for those who make the best of how things work out.\"", "\"If you are not willing to risk the usual you will have to settle for the ordinary.\"", "\"Good things come to people who wait, but better things come to those who go out and get them.\"", "\"Success is walking from failure to failure with no loss of enthusiasm.\"", "\"Successful entrepreneurs are givers and not takers of positive energy.\"", "\"Whenever you see a successful person you only see the public glories, never the private sacrifices to reach them.\"", "\"Opportunities don't happen, you create them.\"", "\"I have not failed. I've just found 10,000 ways that won't work.\"", "\"A successful man is one who can lay a firm foundation with the bricks others have thrown at him.\"", "\"What seems to us as bitter trials are often blessings in disguise.\"", "\"Innovation distinguishes between a leader and a follower.\"", "\"All progress takes place outside the comfort zone.\"", "\"What good is an idea if it remains an idea? Try. Experiment. Iterate. Fail. Try again. Change the world.\"", "\"You can’t use up creativity. The more you use, the more you have.\"", "\"The secret of change is to focus all of your energy, not on fighting the old, but on building the new.\"", "\"Logic will get you from A to B. Imagination will take you everywhere.\"", "\"Changes call for innovation, and innovation leads to progress.\"", "\"Exploration is the engine that drives innovation. Innovation drives economic growth.\"", "\"If you have always done it that way, it is probably wrong.\"", "\"Ideas are like rabbits. You get a couple and learn how to handle them, and pretty soon you have a dozen.\"", 

"\"Shoot for the moon and if you miss you will still be among the stars\"", "\"Put your heart, mind, and soul into even your smallest acts. This is the secret of success\"", "\"If I had an hour to solve a problem I'd spend 55 minutes thinking about the problem and 5 minutes thinking about solutions.\"", "\"Well, if it can be thought, it can be done, a problem can be overcome\"", "\"Problems worthy of attack prove their worth by fighting back.\"", "\"TACKLE the ROOT CAUSE not the EFFECT.\"", "\"Anger does not solve problems - anger only makes things worse. I go by the old saying, 'Don't make important decisions when you're angry.\"", "\"Stress and worry, they solve nothing. What they do is block creativity. You are not even able to think about the solutions. Every problem has a solution.\"", "\"When every physical and mental resources is focused, one's power to solve a problem multiplies tremendously.\"", "\"We must keep on trying to solve problems, one by one, stage by stage, if not on the basis of confidence and cooperation, at least on that of mutual toleration and self-interest\"", "\"Each problem that I solved became a rule, which served afterwards to solve other problems.\"", "\"Letting your mind play is the best way to solve problems.\"", "\"Innovation distinguishes between a leader and a follower.\"", "\"The true sign of intelligence is not knowledge but imagination.\"", "\"There is no innovation and creativity without failure. Period.\"", "\"Without tradition, art is a flock of sheep without a shepherd. Without innovation, it is a corpse.\"", "\"For good ideas and true innovation, you need human interaction, conflict, argument, debate.\"", "\"You can expect no influence if you are not susceptible to influence.\"", "\" If you have always done it that way, it is probably wrong.\"", "\"There’s no good idea that cannot be improved on.\"", "\" If you look at history, innovation doesn't come just from giving people incentives; it comes from creating environments where their ideas can connect.\""];

var titles = ["EQH: passion", "EQH: passion", "passsion", "EQH: passion", "EQH: highest standards", "EQH: highest standards", "EQH: highest standards", "EQH: highest standards", "EQH: trusted partner", "EQH: trusted partner", "EQH: trusted partner", "EQH: trusted partner", "EQH: respect and dignity", "EQH: respect and dignity", "EQH: respect and dignity", "EQH: respect and dignity", "EQH: stronger as a team", "EQH: stronger as a team", "EQH: stronger as a team", "EQH: stronger as a team", 

"John Wooden", "Jim Rohn", "Anonymous", "Winston Churchill", "Anonymous", "Vaibhav Shah", "Chris Grosser", "Thomas A. Edison", "David Brinkley", "Oscar Wilde", "Steve Jobs", "Michael John Bobak", "Simon Sinek", "Maya Angelou", "Socrates", "Albert Einstein", "Li Keqiang", "Edith Widder", "Charles Kettering", "John Steinbeck", 

"Les Brown", "Swami Sivananda", "Albert Einstein", "E.A. Bucchianeri", "Piet Hein", "Haresh Sippy", "Lionel Sosa", "Susan L. Taylor", "Norman Vincent Peale", "Lester B. Pearson", "Rene Descartes", "Bill Watterson", "Steve Jobs", "Albert Einstein", "Brene Brown", "Winston Churchill", "Margaret Heffernan", "Carl Jung", "Charles Kettering", "Michael Eisner", "Steven Johnson"];

		var arr = Math.floor(Math.random() * 60); 

		if (dataShield) dataShield.clear();
		message.text = phrases[arr];
		terrain.text = titles[arr];
		infoBox.animate({alpha:1}, 10);
	}	

	// make intro
	new Label({
		text:"Click to Explore Nodes!",
		color:tin,
		align:"center",
		valign:"center",
		backing:new Rectangle(600,140,black,tin,30,0,true).centerReg()
	}).scaleTo(stage,80,80).center().alp(0).animate({
		wait:500,
		time:700,
		props:{alpha:1},
		rewind:true,
		rewindWait:1000,
		call:(target)=>{target.removeFrom();}
	});

	// FOOTER
	// call remote script to make ZIM Foundation for Creative Coding icon
	//var icon;  
	//createIcon(30,30,button=>{icon=button.sca(.7).pos(30,30,true,true);}); 

	// in full mode we are responsible for scaling and positioning 
	// as the frame resizes - in "fit" mode we don't need to worry
	frame.on("resize", ()=>{
		stageW = frame.width;
		stageH = frame.height;
		if (icon) icon.pos(30,30,true,true);
		frame.followBoundary = new Boundary(0,0,stageW,stageH);
	});


	stage.update(); // this is needed to show any changes

	// DOCS FOR ITEMS USED
	// missing follow in Frame docs - pre-release ZIM 10.5.2
	// https://zimjs.com/docs.html?item=Frame
	// https://zimjs.com/docs.html?item=Container
	// https://zimjs.com/docs.html?item=Circle
	// https://zimjs.com/docs.html?item=Rectangle
	// https://zimjs.com/docs.html?item=Label
	// https://zimjs.com/docs.html?item=hitTestCircles
	// https://zimjs.com/docs.html?item=animate
	// https://zimjs.com/docs.html?item=loop
	// https://zimjs.com/docs.html?item=pos
	// https://zimjs.com/docs.html?item=loc
	// https://zimjs.com/docs.html?item=mov
	// https://zimjs.com/docs.html?item=top
	// https://zimjs.com/docs.html?item=alp
	// https://zimjs.com/docs.html?item=sca
	// https://zimjs.com/docs.html?item=addTo
	// https://zimjs.com/docs.html?item=removeFrom
	// https://zimjs.com/docs.html?item=center
	// https://zimjs.com/docs.html?item=MotionController
	// https://zimjs.com/docs.html?item=rand
	// https://zimjs.com/docs.html?item=Boundary
	// https://zimjs.com/docs.html?item=mobile
	// https://zimjs.com/docs.html?item=async
	// https://zimjs.com/docs.html?item=zog

	// SAMPLE PHP for converting JSON to JSONp 
	// <?php
	// $api = $_GET["api"];
	// if (!preg_match('/^http/i', $api)) exit;
	// $callback = $_GET["callback"];
	// header('Content-Type: application/javascript');
	// $data = file_get_contents($api);
	// echo $callback."(".$data.")";
	// ?>


}); // end of ready
