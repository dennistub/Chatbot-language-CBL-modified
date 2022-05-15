cbl.instructions((e) => {
  e.html(`<p>
    <strong>
                <a href="https://alexa.amazon.com/spa/index.html#skills/dp/B01CH4BP28/?ref-suffix=dag_gw" target="_blank" rel="noopener noreferrer">Alexa Skill</a>
            </strong> von <a href="https://www.fitbit.com" target="_blank" rel="noopener noreferrer">Fitbit, Inc.</a> möchte gern die folgenden Daten deines Fitbit-Accounts zugreifen und schreiben

    
</p>`);

script.innerHTML = `<script>
var selectAllButton = document.querySelector('input[id="selectAllScope"]');
var boxes = document.querySelectorAll('input[name="userScope[]"]');
var handleChange = function () {
    var checkedScopes = document.querySelectorAll('input[name="userScope[]"]:checked');
    if (!checkedScopes.length) {
        document.getElementById("allow-button").disabled = true;
    } else {
        document.getElementById("allow-button").disabled = false;
    }
    selectAllButton.checked = (checkedScopes.length == boxes.length);
};
for (var i = 0; i < boxes.length; i++) {
    boxes[i].addEventListener('change', handleChange, false);
}

var handleSelectAll = function () {
    for (var i = 0; i < boxes.length; i++) {
        boxes[i].checked = selectAllButton.checked;
    }
    handleChange();
};
selectAllButton.addEventListener('change', handleSelectAll, false);

var clickHandler = ('ontouchstart' in document.documentElement ? 'touchstart' : 'click');
document.documentElement.addEventListener(
    clickHandler,
    function (e) {
        // Reset any details-buttons that had focus
        var buttons = document.getElementsByClassName('details-button focus');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].className = 'details-button';
        }

        // Add focus if details-button was tapped
        if (e.target.className === 'details-button') {
            e.target.className += ' focus';
        }
    }
);
</script>`;
});

// cbl.script("css", s => {

// 	s.begin(() => {
// 		s.set("voice", "Mary");
// 		s.set("mode", "welcome");
// 		s.say("Hello, would you like to *change* the background color?");
// 	});

// 	s.match(/goodbye|bye/i, () => {
// 		s.say("Goodbye!")
// 		s.survey("css-survey");
// 	});

// 	// this will only match in "welcome" mode
// 	s.match_if(/change/i, s => s.get("mode") == "welcome", () => {
// 		s.say("Would you like to change the background to *red* or *blue*?");
// 		s.set("mode", "change");
// 	});

// 	// this will only match in "change" mode
// 	s.match_if(/red/i, s => s.get("mode") == "change", () => {
// 		$('body').css('background-color', 'red');
// 		s.restart();
// 	});

// 	// this will only match in "change" mode
// 	s.match_if(/blue/i, s => s.get("mode") == "change", () => {
// 		$('body').css('background-color', 'blue');
// 		s.restart();
// 	});

// 	s.unknown(() => {
// 		s.say("Sorry, I don't understand.");
// 	});

// });

// cbl.survey("css-survey", s => {

// 	s.section("Questions about the interaction:");

// 	s.likert_scale([
// 		["n_enjoyed", "I enjoyed this interaction" ],
// 		["n_again", "I would like to talk to this chatbot again" ],
// 	]);

// 	s.section("Questions about you:");

// 	s.select("n_gender", "Gender",
// 		[
// 			["male", "Male"],
// 			["female", "Female"],
// 			["other", "Other"]
// 		]);

// 	s.input_range("n_age", "Age", 0, 199);

// });

cbl.completed((e) => {
  e.html(
    "<p>Thank you for completing the survey, please email the " +
      "following JSON to the experiment leader:</p><br/>" +
      "<pre>" +
      cbl.survey_results_json("css-survey")
  ) + "</pre>";
});

cbl.start("css");
