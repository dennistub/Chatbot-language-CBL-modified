// a script for the fitbit interaction

cbl.instructions(e => {

	e.html("<p>Please talk to the chatbot and then complete the survey.</p>");

});

cbl.script("css", s => {

	s.begin(() => {
		s.set("voice", "Mary");
		s.set("mode", "welcome");
		s.say("Hi! With Cell Phone skill, I can call any person in the world or send text messages. First of all, please tell me your name");
	});

    //here there are two scenarios: 1. The account linking page is displayed, or the individual peaces of 

	s.match(/goodbye|bye/i, () => {
		s.say("Goodbye!")
		s.survey("css-survey");
	});

    let regName = /^[a-zA-Z]+ [a-zA-Z]+$/;


	// this will only match in "welcome" mode
	let exp = new RegExp(/[a-z]+[a-z]/);
	s.match(exp, () => {
		s.say(`Your name is 'Name you entered above'. Am I right?`);
	  s.set("mode", "change");
	});

	// this will only match in "change" mode
	s.match_if(/red/i, s => s.get("mode") == "change", () => {
		$('body').css('background-color', 'red');
		s.restart();	
	});

	// this will only match in "change" mode
	s.match_if(/blue/i, s => s.get("mode") == "change", () => {
		$('body').css('background-color', 'blue');
		s.restart();
	});

	s.unknown(() => {
		s.say("Sorry, I don't understand.");
	});

});


s.match(
	/yes/i,
	() => {
	  s.say('Ok, Steven, I will use this name. I need your phone number in order to make calls. Please tell me your phone number in international format, starting with your country code.');
	  s.set("mode", "enterPhone");
	}
  );
  s.match_if(
	/no/i,
	s => s.get("mode") == "welcome",
	() => {
	  $("body").css("background-color", "blue");
	  s.restart();
	}
  );

  let phoneRegEx = new RegExp(/^(((\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3})|((\+44\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4})|((\+44\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/)
  s.match_if(
	  phoneRegEx,
	  s => s.get("mode") == "enterPhone",
	  () => {
		  s.say(`Your phone number is ${phoneRegEx} based in United Kingdom, am I right?`);

		s.restart();
	  }
	);


cbl.survey("css-survey", s => {

	s.section("Questions about the interaction:");

	s.likert_scale([
		["n_enjoyed", "I enjoyed this interaction" ],
		["n_again", "I would like to talk to this chatbot again" ],
	]);

	s.section("Questions about you:");

	s.select("n_gender", "Gender",
		[
			["male", "Male"],
			["female", "Female"],
			["other", "Other"]
		]);

	s.input_range("n_age", "Age", 0, 199);

});

cbl.completed(e => {

	e.html("<p>Thank you for completing the survey, please email the "+
		"following JSON to the experiment leader:</p><br/>" +
		"<pre>" + cbl.survey_results_json("css-survey")) + "</pre>";

});

cbl.start("css");
