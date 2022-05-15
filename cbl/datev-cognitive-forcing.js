// a simple example script that plays audio files

cbl.set("voice_volume", 0.9);

cbl.script("audio", s => {

	s.begin(() => {
		s.set("voice", "Mary");
		s.say("Alles klar! 3600 Euro Bruttogehalt. Wie ist deine Steuerklasse?");
	});

});

cbl.start("audio");
