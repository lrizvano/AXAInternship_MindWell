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
						var api = `C:/Users/R66579/Documents/MindWell/root/test/planetList${planet.num}`;
						// ZIM async() uses JSONp 
						// the api returns JSON not JSONp so filter it through a PHP script 
						// You can too - or a sample PHP script is at the bottom of the code
						// JSONp needs a callback and async requires a dot between async and the callback 
						// we also must pass the real reference to the function as the second parameter
						//async(`https://zimjs.org/cdn/jsonp.php?api=${api}&callback=async.planetInfo`, planetInfo);
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
		// zog(data)
		if (dataShield) dataShield.clear();
		message.text = "data.name";
		terrain.text = data.terrain;
		infoBox.animate({alpha:1}, 500);
	}	
	
	// make intro
	new Label({
		text:"PRESS THE PLANETS!",
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
	var icon;  
	createIcon(30,30,button=>{icon=button.sca(.7).pos(30,30,true,true);}); 

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