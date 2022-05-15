// This is a script written in chatbot language (CBL) for creating a chatbot experiment to run on Mechanical Turk 
cbl.set("audio_prefix",
	"https://privacydialoguebucket.s3.eu-central-1.amazonaws.com/");


cbl.instructions(e => {

	e.html(`<p>Willkommen zu diesem &nbsp;<b> Experiment mit einem Chatbot-System </b>. <br /><br />In diesem Experiment,&nbsp; wird Ihnen eine Aufgabe gestellt,&nbsp; die Sie mit unserem Chatbot-System lösen sollen.&nbsp; <b>Die Aufgabe wird am unteren Rand Ihres Bildschirms angezeigt</b>,&nbsp; nachdem Sie&nbsp; "weiter"&nbsp; geklickt haben.&nbsp; Am Ende Ihrer Interaktion,&nbsp; werden Sie gebeten,&nbsp; eine Umfrage über Ihre Erfahrungen mit der Interaktion auszufüllen.&nbsp;Die Studie dauert etwa 5 Minuten.</p><br/>
    <textarea rows="10" style="width: 100%;">
    Einverständniserklärung nach GDPR
    Sie erklären sich einverstanden,&nbsp; an der Studie&nbsp; "Evaluation der Nutzererfahrungen mit einem Chatbot-System" &nbsp;des Fraunhofer-Instituts für Integrierte Schaltungen IIS &nbsp;(im Folgenden Fraunhofer IIS) teilzunehmen. &nbsp;Die Teilnahme an der Studie beinhaltet eine kurze Interaktion mit einem Chatbot,&nbsp; sowie das Ausfüllen eines Fragebogens, der zur Verbesserung der Kommunikation mit Maschinen dient.&nbsp;
    Ich bin damit einverstanden,&nbsp; dass das Fraunhofer IIS,&nbsp; Am Wolfsmantel 33,&nbsp; 91058 Erlangen,&nbsp; Deutschland,&nbsp; zum Zwecke der Durchführung,&nbsp; der Auswertung und Präsentation der oben genannten Studie,&nbsp; folgende persönliche Daten von mir erheben darf: &#10;
    
    -&nbsp; Alter
    -&nbsp; Geschlecht
    -&nbsp; Subjektive Bewertungen Ihrer Erfahrung mit dem Chatbot-System
    
    (nachstehend als &nbsp; "Daten" &nbsp; bezeichnet).&#10;
    Eine weitere Verwendung der Daten ist ausgeschlossen. &#10;
    Die anonymisierten Daten werden in der Mensch-Maschine-Interaktion,&nbsp; User Experience und Natural Language Processing sowie für statistische Auswertungen der Studie verwendet.&nbsp; Die Auswertung Ihrer Daten erfolgt ausschließlich durch Mitarbeiter des Fraunhofer IIS,&nbsp; diese sind zur Vertraulichkeit verpflichtet.&#10; 
    Ich willige ferner ein,&nbsp; dass das Fraunhofer IIS meine oben genannten Daten an die folgenden Datenschutzbeauftragten und die für die Verarbeitung der Daten für den oben genannten Zweck Verantwortlichen weitergeben darf:&#10;
    
    -&nbsp; Fraunhofer-Gesellschaft
    -&nbsp; Entwicklungspartner
    -&nbsp; Universitäten
    -&nbsp; Dienstanbieter
    Soweit diese zum Zweck der Erreichung des Forschungszwecks in das Projekt eingebunden sind.&#10;
    Die Teilnahme an der Studie ist freiwillig.&nbsp; Sie können Ihre Teilnahme an der Studie jederzeit beenden und Ihre Zustimmung zur Studie ohne Angabe von Gründen ändern oder widerrufen.&#10;
    In Bezug auf die von uns verarbeiteten personenbezogenen Daten haben Sie Anspruch auf die Rechte der betroffenen Person nach GDPR,&nbsp; das Recht auf Information,&nbsp; Berichtigung,&nbsp; Widerruf oder Sperrung/Löschung Ihrer Daten,&nbsp; sowie das Recht,&nbsp; sich bei der Aufsichtsbehörde zu beschweren.&#10;
    Die Anforderungen des 32 GDPR-Formulars für den Schutz personenbezogener Daten werden erfüllt.&#10;
    Die Daten werden so lange elektronisch gespeichert,&nbsp; wie es für die Erfüllung des wissenschaftlichen Forschungszwecks erforderlich ist &nbsp;(Entwicklung benutzerfreundlicher Maschinen und wissenschaftliche Veröffentlichung der Forschungsergebnisse).&nbsp; Soweit der Forschungszweck ernsthaft beeinträchtigt wird oder seine Verwirklichung unmöglich wird,&nbsp; können im Rahmen der gesetzlichen Erlaubnisbestimmungen Ausnahmen von den in den Absätzen 15,&nbsp; 16,&nbsp; 18 und 21 GDPR genannten Rechten vorgesehen werden.&#10;
    Wenn Sie Fragen zur Erhebung und zum Datenschutz haben,&nbsp; wenden Sie sich bitte an:&#10;
    Dr. Birgit Bruggemeier,&nbsp; birgit.brueggemeier@iis.fraunhofer.de
    Fraunhofer-Datenschutzbeauftragter:&nbsp; Prof. Dr. Ralph Harter,&nbsp; ralph.harter@zv.fraunhofer.de
</textarea><br/><br/>
	`);

});


cbl.script("Privacy_Dialogue", s => {

   s.begin(() => {
    
		// NOTE: select a random category for this session:
        s.set("condition", cbl.random_item(["privacy_priming", "privacy_no_priming", "control"])); 
        $('#survey_form').append('<input type="hidden" name="condition" value="' +
            s.get("condition") + '" />');
		// NOTE: s.get(category) will now be "privacy_priming", "privacy_no_priming" or "control"
        $('#hint').html("Aufgabe: <b>Kontrollieren Sie den Kontostand </b> Ihrer Kreditkarte mit der Endung <b>5678</b> für die letzten <b>drei Monate</b>.");
        s.run("welcome");

        
   });

   // Add subscripts
   s.sub("welcome", ss => {

        ss.begin(() => {
            s.set("voice", "Mary");
            s.say("Hallo! Ich bin ein Bank-Chatbot, wie kann ich Ihnen helfen?");
        });
    
        ss.match(/Hi|Hallo|Ja|Klar/i, () => {
            s.say("Hallo nochmal! Wie kann ich Ihnen helfen?"); //CHANGE: when the user first said "yes", the mode should be "welcome"
        });

        ss.match(/kontrollieren|saldo|check|überprüfe|prüfe|Kreditkarte|Kontostand|Konto|abfragen/i, () => { 
            s.say("Okay, welche Kreditkarte möchten Sie überprüfen?")
            s.run("card_number");
        });

        ss.unknown(function() {
            s.say("Entschuldigung, ich verstehe nicht. Sie können mich bitten, Ihren Kontostand zu überprüfen.");
        });

        $('#hint').html("Aufgabe: <b>Kontrollieren Sie den Kontostand </b> Ihrer Kreditkarte mit der Endung <b>5678</b> für die letzten <b>drei Monate</b>.");

    });

    s.sub("card_number", ss => {

        ss.begin(() => {
            s.set("voice", "Mary");
        });
    
        ss.match(/5678|5 6 7 8|fünf sechs sieben acht/i, () => { 
            s.say("Für wie viele Monate möchten Sie Ihren Kontostand überprüfen?");
            s.run("duration")
        });

        ss.unknown(function() {
            s.say("Tut mir leid, ich kenne diese Karte nicht. Bitte versuchen Sie eine andere Kartenummer.");
        });

        $('#hint').html("Aufgabe: <b>Kontrollieren Sie den Kontostand </b> Ihrer Kreditkarte mit der Endung <b>5678</b> für die letzten <b>drei Monate</b>.");

    });

    s.sub("duration", ss => {

        ss.begin(() => {
            s.set("voice", "Mary");
        });
    
        ss.match(/3|drei/i, () => { 
            s.run('checking');
        });

        ss.unknown(function() {
            s.say("Tut mir leid, das kann ich nicht tun. Versuchen Sie Ihren Kontostand für drei Monate abzufragen.");
        });

        $('#hint').html("Aufgabe: <b>Kontrollieren Sie den Kontostand </b> Ihrer Kreditkarte mit der Endung <b>5678</b> für die letzten <b>drei Monate</b>.");

    });

    s.sub('checking', ss => {
        ss.begin(() =>{
            s.set("voice", "Mary");
            s.say("Ich prüfe den Saldo der Karte 5 6 7 8 für die letzten drei Monate und bearbeite Ihren Auftrag...");
            s.say("Ihr Kontostand für die letzten drei Monate ist: 99 Euro, 272 Euro und 410 Euro.");
            s.ready(() => { s.run(s.get('condition')); })
        })

        ss.unknown(function() {  
        });
    });

    s.sub("privacy_priming", ss => {

        ss.begin(() => {
            s.set("voice", "Mary");
            s.say("Möchten Sie, dass ich Ihre Daten aus dieser Interaktion jetzt lösche, um Ihre Privatsphäre zu schützen?");   
        });
        
        ss.match(/ja|jo|sicher|jaup|löschen|ok/i, () => { 

            $('#survey_form').append('<input type="hidden" name="response_yn" value="yes" />');

            s.say("Okay. Ich habe Ihre Daten aus dieser Interaktion gelöscht.");
            s.say("Auf Wiedersehen!"); 
            s.pause(1000);
            s.ready(() => { s.run("survey_subscript"); })
        });

        ss.match(/nein|nö|nicht löschen|lieber nicht|auf keinen Fall/i, () => { 

            $('#survey_form').append('<input type="hidden" name="response_yn" value="no" />');

            s.say("Okay dann.");
            s.say("Auf Wiedersehen!"); 
            s.pause(1000);
            s.ready(() => { s.run("survey_subscript"); })
        });

        ss.unknown(function() {
            s.say("Entschuldigung, ich verstehe nicht. Sie können 'ja' oder 'nein' sagen, um die Daten zu löschen, die ich aus unserer Interaktion gesammelt habe.");
        });

        $('#hint').html("Aufgabe: <b>Kontrollieren Sie den Kontostand </b> Ihrer Kreditkarte mit der Endung <b>5678</b> für die letzten <b>drei Monate</b>.");

    });


    s.sub("privacy_no_priming", ss => {

        ss.begin(() => {
            s.set("voice", "Mary");
            s.say("Möchten Sie, dass ich Ihre Daten aus dieser Interaktion jetzt lösche?");   
        });
        
        ss.match(/ja|jo|sicher|jaup|löschen|ok/i, () => { 

            $('#survey_form').append('<input type="hidden" name="response_yn" value="yes" />');

            s.say("Okay. Ich habe Ihre Daten aus dieser Interaktion gelöscht.");
            s.say("Auf Wiedersehen!"); 
            s.pause(1000);
            s.ready(() => { s.run("survey_subscript"); })
        });

        ss.match(/nein|nö|nicht löschen|lieber nicht|auf keinen Fall/i, () => { 

            $('#survey_form').append('<input type="hidden" name="response_yn" value="no" />');

            s.say("Okay dann.");
            s.say("Auf Wiedersehen!"); 
            s.pause(1000);
            s.ready(() => { s.run("survey_subscript"); })
        });

        ss.unknown(function() {
            s.say("Entschuldigung, ich verstehe nicht. Sie können 'ja' oder 'nein' sagen, um die Daten zu löschen, die ich aus unserer Interaktion gesammelt habe.");
        });

        $('#hint').html("Aufgabe: <b>Kontrollieren Sie den Kontostand </b> Ihrer Kreditkarte mit der Endung <b>5678</b> für die letzten <b>drei Monate</b>.");

    });

    s.sub("control", ss => {

        ss.begin(() => {
            s.set("voice", "Mary");
            s.say("Kann ich Ihnen sonst noch bei irgendetwas helfen?")
        });
    
        ss.match(/ja|jo|sicher|jaup|ok/i, () => { 

            $('#survey_form').append('<input type="hidden" name="response_yn" value="yes" />');

            s.say("Es tut mir leid, mehr Hilfe kann ich im Moment nicht leisten. Sie können sich stattdessen an einen menschlichen Assistenten wenden.");
            s.say("Auf Wiedersehen!"); 
            s.pause(1000);
            s.ready(() => { s.run("survey_subscript"); })
        });

        ss.match(/nein|nö|lieber nicht|auf keinen Fall|danke, nein| danke nein/i, () => { 

            $('#survey_form').append('<input type="hidden" name="response_yn" value="no" />');

            s.say("Okay dann.");
            s.say("Auf Wiedersehen!"); 
            s.pause(1000);
            s.ready(() => { s.run("survey_subscript"); })
        });

        ss.unknown(function() {
            s.say("Entschuldigung, ich verstehe nicht. Sie können 'ja' oder 'nein' sagen, wenn Sie mehr Hilfe wünschen.");
        });

        $('#hint').html("Aufgabe: <b>Kontrollieren Sie den Kontostand </b> Ihrer Kreditkarte mit der Endung <b>5678</b> für die letzten <b>drei Monate</b>.");

    });

    s.sub("survey_subscript", ss => {
        ss.begin(() => {
            s.survey("survey");
        });
    });


});

cbl.survey("survey", s => {


	s.section("Aufmerksamkeitstest");

	s.select("n_attention", "Geben Sie das Wort <b>orange</b> in das Textfeld unten ein. \n Welches Wort wurden Sie gebeten einzugeben?",
    [
        ["none", "keines"],
        ["brown", "braun"],
        ["blue", "blau"],
        ["orange", "orange"]
	], { desc_width: "70%" });
	


	s.section("<br /><br />Modalitätsprüfung");
	s.select("n_modality", "Konnten Sie die Sprachausgabe hören?",
    [
        ["yes", "Ja, durchgängig"],
        ["no", "Nein, nicht durchgängig"]
    ]);


	s.section("<br /><br />Bitte geben Sie an, wie stark Sie den folgenden Aussagen zustimmen oder nicht zustimmen:");

	s.likert_scale([
        ["q_SEC1", "Dieser Chatbot verfügt über Mechanismen, um die sichere Übertragung von Informationen seiner Benutzer zu gewährleisten." ],
        ["q_SEC2", "Dieser Chatbot zeigt große Sorge um die Sicherheit jeglicher Transaktionen." ],
        ["q_SEC5", "Wenn ich Daten an diesen Chatbot sende, bin ich sicher, dass sie nicht von unbefugten Dritten abgefangen werden." ],
        ["q_SEC6", "Dieser Chatbot hat genügend technische Kapazität, um sicherzustellen, dass die von mir gesendeten Daten nicht von Hackern abgefangen werden." ],
        ["q_SEC7", "Wenn ich Daten an diesen Chatbot sende, bin ich sicher, dass sie nicht von Dritten geändert werden können." ],
        ["q_SEC8", "Dieser Chatbot verfügt über ausreichende technische Kapazitäten, um sicherzustellen, dass die von mir gesendeten Daten nicht von Dritten verändert werden können." ]
    ], { points: 7, agree: "Ich stimme voll zu", disagree: "Ich stimme überhaupt nicht zu" });

    s.likert_scale([
        ["q_PRIV1", "Dieser Chatbot zeigt Sorge um die Privatsphäre seiner Benutzer." ],
        ["q_PRIV2", "Ich fühle mich sicher, wenn ich persönliche Informationen an diesen Chatbot sende." ],
        ["q_PRIV3", "Dieser Chatbot hält sich an die Gesetze zum Schutz persönlicher Daten." ],
        ["q_PRIV4", "Dieser Chatbot sammelt nur persönliche Daten, die für seine Tätigkeit notwendig sind." ],
        ["q_PRIV5", "Dieser Chatbot respektiert die Rechte der Nutzer, wenn er persönliche Informationen sammelt." ],
        ["q_PRIV6", "Ich denke, dass dieser Chatbot meine persönlichen Daten nicht ohne meine Zustimmung an andere Unternehmen weitergeben wird." ]
    ], { points: 7, agree: "Ich stimme voll zu", disagree: "Ich stimme überhaupt nicht zu" });

    s.likert_scale([
        ["q_USAB1", "Alles was dieser Chatbot sagt und tut ist einfach zu verstehen." ],
        ["q_USAB2", "Dieser Chatbot ist einfach zu benutzen, selbst wenn man ihn zum ersten Mal benutzt." ],
        ["q_USAB3", "Es ist einfach, die Informationen, die ich benötige, über diesen Chatbot zu finden." ],
        ["q_USAB4", "Die Struktur und der Inhalt dieses Chatbots sind leicht verständlich." ],
        ["q_USAB5", "Es ist leicht, sich in diesem Chatbot zurechtzufinden." ],
        ["q_USAB7", "Wenn ich den Chatbot benutze, habe ich das Gefühl, dass ich die Kontrolle darüber habe, was ich tun kann." ]
    ], { points: 7, agree: "Ich stimme voll zu", disagree: "Ich stimme überhaupt nicht zu" });

    s.likert_scale([
        ["q_TRUST_HON1", "Dieser Chatbot erfüllt in der Regel die von ihm übernommenen Verpflichtungen." ],
        ["q_TRUST_HON2", "Die von diesem Chatbot angebotenen Informationen sind aufrichtig und ehrlich." ],
        ["q_TRUST_HON3", "Ich denke, ich kann den Versprechen, die dieser Chatbot macht, vertrauen." ],
        ["q_TRUST_HON4", "Dieser Chatbot macht keine falschen Aussagen." ],
        ["q_TRUST_HON5", "Dieser Chatbot zeichnet sich durch Offenheit und Klarheit der Dienstleistungen aus, die er Nutzern anbietet." ]
    ], { points: 7, agree: "Ich stimme voll zu", disagree: "Ich stimme überhaupt nicht zu" });

    s.likert_scale([
        ["q_TRUST_BENEV1", "Die Ratschläge und Empfehlungen, die dieser Chatbot gibt, versuchen gegenseitigen Nutzen zu schaffen." ],
        ["q_TRUST_BENEV2", "Dieser Chatbot kümmert sich um die gegenwärtigen und zukünftigen Interessen seiner Benutzer." ],
        ["q_TRUST_BENEV3", "Dieser Chatbot berücksichtigt die Auswirkungen, die seine Aktionen auf den Verbraucher haben könnten." ],
        ["q_TRUST_BENEV4", "Dieser Chatbot würde nichts absichtlich tun, was den Benutzer schädigen würde." ],
        ["q_TRUST_BENEV5", "Das Design und das kommerzielle Angebot dieses Chatbots berücksichtigt die Wünsche und Bedürfnisse seiner Benutzer." ],
        ["q_TRUST_BENEV6", "Dieser Chatbot ist empfänglich für die Bedürfnisse seiner Benutzer." ]
    ], { points: 7, agree: "Ich stimme voll zu", disagree: "Ich stimme überhaupt nicht zu" });

    s.likert_scale([
        ["q_TRUST_COMP1", "Dieser Chatbot verfügt über die notwendigen Fähigkeiten, um seine Arbeit auszuführen."],
        ["q_TRUST_COMP2", "Dieser Chatbot hat genügend Erfahrung in der Vermarktung der von ihm angebotenen Produkte und Dienstleistungen." ],
        ["q_TRUST_COMP3", "Dieser Chatbot verfügt über die notwendigen Ressourcen, um seine Aktivitäten erfolgreich durchzuführen." ],
        ["q_TRUST_COMP4", "Dieser Chatbot kennt seine Benutzer gut genug, um ihnen Produkte und Dienstleistungen anbieten zu können, die an ihre Bedürfnisse angepasst sind."]
    ], { points: 7, agree: "Ich stimme voll zu", disagree: "Ich stimme überhaupt nicht zu" });

    s.likert_scale([
        ["q_COMMIT2", "Ich würde diesen Chatbot anderen Leuten empfehlen." ],
        ["q_COMMIT3", "Falls jemand diesen Chatbot kritisieren sollte, würde ich auf die positiven Aspekte dieses Chatbots hinweisen wollen."],
        ["q_COMMIT5", "Selbst wenn neue Online-Alternativen auftauchen, würde ich diesen Chatbot weiterhin nutzen."]
    ], { points: 7, agree: "Ich stimme voll zu", disagree: "Ich stimme überhaupt nicht zu" });

    

	s.section("<br /><br />Fragen zu Ihrer Person:");

		s.select("n_gender", "Welches Geschlecht haben Sie?",
		[
			["male", "Männlich"],
			["female", "Weiblich"],
			["diverse", "Divers"],
			["other", "Keine Angabe"]
		], { desc_width: "70%" });
	
	
	s.input_range("n_age", "Alter", 0, 199, { desc_width: "70%" });
	
	s.select("n_language", "Sind Sie Deutschmuttersprachler?",
		[
			["yes", "Ja"],
			["no", "Nein"]
		]), { desc_width: "70%" };
	
	s.select("n_usage", "Wie häufig nutzen Sie Chatbots?",
	[
		["no", "Überhaupt nicht"],
		["seldom", "Weniger als einmal im Monat"],
		["often","2-4 Mal im Monat"],
		["frequent","Mehr als einmal die Woche"]
	], { desc_width: "70%" });

});


cbl.start("Privacy_Dialogue");
