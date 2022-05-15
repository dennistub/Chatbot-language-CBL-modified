cbl.instructions((e) => {
  e.html(`<p>Willkommen zu diesem&nbsp;<b>Experiment mit einem Chatbot-System</b>.<br/><br/>In diesem Experiment &nbsp;wird Ihnen eine Aufgabe gestellt,&nbsp;die Sie mit unserem Chatbot-System lösen sollen.&nbsp;<b>Die Aufgabe wird am unteren Rand Ihres Bildschirms angezeigt</b>,&nbsp;nachdem Sie&nbsp;"weiter"&nbsp;geklickt haben.&nbsp;Am Ende Ihrer Interaktion &nbsp;werden Sie gebeten,&nbsp;eine Umfrage über Ihre Erfahrungen mit der Interaktion auszufüllen.&nbsp;Die Studie dauert etwa <b>5-10 Minuten</b>.</p><br/>
  <article rows="10"style="width: 100%;">
    <section>
      <h3>Einverständniserklärung nach GDPR</h3>
    </section>
    <section>
      <p>
Sie erklären sich einverstanden,&nbsp;an der Studie&nbsp;<b>"Evaluation der Nutzererfahrungen mit einem Chatbot-System auf Basis des Alexa Skills <i>Datev Lab Gehaltsrechner</i>"</b>&nbsp;des Fraunhofer-Instituts für Integrierte Schaltungen IIS&nbsp;(im Folgenden Fraunhofer IIS) teilzunehmen.&nbsp;Die Teilnahme an der Studie beinhaltet eine kurze Interaktion mit einem <b>Chatbot</b>, &nbsp;sowie das <b>Ausfüllen eines Fragebogens</b>, der zur Verbesserung der Kommunikation mit Maschinen dient.&nbsp;Ich bin damit einverstanden,&nbsp;dass das Fraunhofer IIS,&nbsp;Am Wolfsmantel 33,&nbsp;91058 Erlangen,&nbsp;Deutschland,&nbsp;zum Zwecke der Durchführung,&nbsp;der Auswertung und Präsentation der oben genannten Studie,&nbsp;folgende persönliche Daten von mir erheben darf:&#10;</p>
        <ul>
          <li>Bruttogehalt
          </li>
          <li>Steuerklasse
          </li>
          <li>Anzahl an Kindern
          </li>
          <li>Bundesland
          </li>
          <li>Wird Kirchensteuer gezahlt?
          </li>
          <li>Subjektive Bewertungen Ihrer Erfahrung mit dem Chatbot-System
          </li>
          (nachstehend als&nbsp;"Daten"&nbsp;bezeichnet).&#10;
        </ul>
      </section>
      <section>
        <p>
Eine weitere Verwendung der Daten ist ausgeschlossen.&#10;Die anonymisierten Daten werden in der Mensch-Maschine-Interaktion,&nbsp;User Experience und Natural Language Processing sowie für statistische Auswertungen der Studie verwendet.&nbsp;Die Auswertung Ihrer Daten erfolgt ausschließlich durch Mitarbeiter des Fraunhofer IIS,&nbsp;diese sind zur Vertraulichkeit verpflichtet.&#10;Ich willige ferner ein,&nbsp;dass das Fraunhofer IIS meine oben genannten Daten an die folgenden Datenschutzbeauftragten und die für die Verarbeitung der Daten für den oben genannten Zweck Verantwortlichen weitergeben darf:&#10;</p>
      <ul>
        <li>Fraunhofer-Gesellschaft</li>
        <li>Entwicklungspartner</li>
        <li>Universitäten</li>
        <li>Dienstanbieter</li>
      </ul>
        </section>
Soweit diese zum Zweck der Erreichung des Forschungszwecks in das Projekt eingebunden sind.&#10;Die Teilnahme an der Studie ist freiwillig.&nbsp;Sie können Ihre Teilnahme an der Studie jederzeit beenden und Ihre Zustimmung zur Studie ohne Angabe von Gründen ändern oder widerrufen.&#10;In Bezug auf die von uns verarbeiteten personenbezogenen Daten haben Sie Anspruch auf die Rechte der betroffenen Person nach GDPR,&nbsp;das Recht auf Information,&nbsp;Berichtigung,&nbsp;Widerruf oder Sperrung/Löschung Ihrer Daten,&nbsp;sowie das Recht,&nbsp;sich bei der Aufsichtsbehörde zu beschweren.&#10;Die Anforderungen des 32 GDPR-Formulars für den Schutz personenbezogener Daten werden erfüllt.&#10;Die Daten werden so lange elektronisch gespeichert,&nbsp;wie es für die Erfüllung des wissenschaftlichen Forschungszwecks erforderlich ist&nbsp;(Entwicklung benutzerfreundlicher Maschinen und wissenschaftliche Veröffentlichung der Forschungsergebnisse).&nbsp;Soweit der Forschungszweck ernsthaft beeinträchtigt wird oder seine Verwirklichung unmöglich wird,&nbsp;können im Rahmen der gesetzlichen Erlaubnisbestimmungen Ausnahmen von den in den Absätzen 15,&nbsp;16,&nbsp;18 und 21 GDPR genannten Rechten vorgesehen werden.&#10;<br/><br/>
<p>Wenn Sie Fragen zur Erhebung und zum Datenschutz haben,&nbsp;wenden Sie sich bitte an:&#10;
Dr.Birgit Popp,&nbsp;birgit.popp@iis.fraunhofer.de<br/>
<b>Fraunhofer-Datenschutzbeauftragter</b>:&nbsp;Prof.Dr.Ralph Harter,&nbsp;ralph.harter@zv.fraunhofer.de</p></article><br/><br/>
`);
});

cbl.script("datev-backup", (s) => {
  let grossValue = 0;
  let netSalary = 0;
  let bundesLand = "";
  let children = 0;
  let steuerKlasse = 0;
  let lzz = 2;
  let faktorVerfahren = 0;
  let married = false;
  let kirchensteuer = 0;
  s.begin(() => {
    cbl.set("say_method", "browser_tts");
    s.set("condition", cbl.random_item(["nudging", "control", "privacy_priming"]));
    
    s.run("welcome");
  });
  s.sub("welcome", (ss) => {
    ss.begin(() => {
      s.set("voice", "Mary");
      s.say(
        "Hi! Willkommen beim DATEV Lab Gehaltsrechner. Ich kann dir einen Überblick über deinen Netto-Lohn geben, wenn du mir dein Bruttogehalt, deine Steuerklasse, die Kinderanzahl und deine Kirchensteuerpflicht verrätst. Möchtest du für den Einstieg eine kurze Einführung hören?"
      );
      s.ready(() => {
        
      });
    });
    ss.match(/stop|alexa stop/i, () => {
      s.say("Tschüss. Bis dann!!");
      s.survey("css-survey");
    });
    ss.match(/ja/i, () => {
      s.run("introduction");
    });
    ss.match(/nein/i, () => {
      s.say(
        'Kein Problem! Übrigens: Wenn du die Einführung doch hören willst, sag einfach "Alexa, Hilfe". Für welchen Betrag möchtest du den Nettowert wissen?'
      );
      s.ready(() => {
        s.run("grossSalary");
      });
    });
    s.sub("introduction", (ss) => {
      ss.begin(() => {
        s.set("voice", "Mary");
      });
      s.say(
        `Alles klar. Ich kann die Lohnsteuer für Arbeitnehmer berechnen.`
      );
      s.say('Dazu stelle ich dir einige Fragen zur Steuerklasse, Kirchenbeträgen oder auch deinem Alter.')
      // s.pause(6000);
      s.say('In der Berechnung gehe ich davon aus, dass du gesetzlich versichert bist und keine weiteren geldwerten Vorteile angeben willst.')
      s.say(
        "Außerdem hast du die Möglichkeit, deine Daten zu speichern oder dir die Ergebnisse per E-Mail zusenden zu lassen."
        //
      );
      s.say('Hierfür benötige ich natürlich deine Erlaubnis. Diese kannst du in der Alexa App freigeben.');
      // s.pause(6000);

      s.say(
        `Wenn du später nochmal die Einführung hören willst, sage einfach "Alexa, Hilfe".`
      );
      s.say("Das war's auch schon. Für welchen Betrag möchtest du den Nettowert wissen?");

      s.ready(() => {
        s.run("grossSalary");
      });
    });

    ss.unknown(function () {
      s.run("introduction");
    });
  });

  s.sub("grossSalary", (ss) => {
    ss.begin(() => {
      s.set("voice", "Mary");
  
    });
    console.log("grosssalary wird ausgeführt");

    ss.match(/^[4-9][5-9][0-9]|\d{3,}/im, () => {
      grossValue = parseInt(msgArray.slice(-1).pop());
      console.log(grossValue);

      if (grossValue > 15000) {
        s.run("annualIncome");
      } else {
        s.say(
          `Alles klar! ${grossValue} Euro Bruttogehalt. Wie ist deine Steuerklasse?`
        );
        s.run("taxClass");
      }

      /* switch(grossValue){
        case grossValue <= 9984:
            netSalary = grossValue;
            s.run("taxClass");
        break;
        case grossValue >= 9985 && grossValue <= 14926:
            let yFaktor = (grossValue - 9984)/ 10000;
            netSalary = grossValue - (1008,7 * yFaktor + 1400) * yFaktor;
            s.run("taxClass");
        break;
        case grossValue >= 14927 && grossValue <= 58596:
            let zFaktor = (grossValue - 14926)/ 10000;
            netSalary = grossValue - (206,43 * zFaktor + 2397) * zFaktor + 938,24;
            s.run("annualIncome");
        break;
        case grossValue >= 58597 && grossValue <= 277825:
            netSalary = grossValue - ((0.42 * grossValue) - 9267.53);
            s.run("annualIncome");
        break;
      }*/

      /*if (grossValue > 15000) {
        s.run("annualIncome");
      } else {
        
        s.ready(() => {
          s.run("taxClass");
        });
      }*/
    });

    s.sub("annualIncome", (ss) => {
      ss.begin(() => {
        s.set("voice", "Mary");
        s.say("Ist dein Gehalt ein Jahreseinkommen?");
      });

      ss.match(/ja/i, () => {
        lzz = 1;
        s.say("Alles klar. Wie ist deine Steuerklasse?");
        s.ready(() => {
          s.run("taxClass");
        });
      });

      ss.match(/nein/i, () => {
        lzz = 2;
        s.say("Alles klar. Wie ist deine Steuerklasse?");
        s.ready(() => {
          s.run("taxClass");
        });
      });
    });

    ss.match(/hilfe/i, () => {
      s.say(
        "Nenne uns hier einen Betrag, zum Beispiel 1000 Euro. Für welchen Betrag möchtest du den Nettowert wissen?"
      );
    });

    ss.unknown(function () {
      s.say(
        "Hoppla, da scheint etwas nicht zu stimmen. Um den Nettolohn zu berechnen, benötige ich den Bruttobetrag deines monatlichen Einkommens."
      );
      s.say("Der Bruttobetrag ist dein Gehalt vor Abzug aller Steuern und Versicherungen.");
      s.say("Versuchen wir es noch einmal. Für welchen Betrag möchtest du den Nettowert wissen?")
    });
  });

  s.sub("taxClass", (ss) => {
    ss.begin(() => {
      s.set("voice", "Mary");
      
    });
    //https://www.bmf-steuerrechner.de/ekst/eingabeformekst.xhtml?ekst-result=true
    let taxClassRegex = new RegExp(/^[1-6]?$|6/im);
    ss.match(taxClassRegex, () => {

      let taxClass = msgArray.slice(-1).pop();
      steuerKlasse = taxClass;
      s.ready(() => {
        s.run("children");
      });
    });

    ss.match(/weiß nicht|weiß ich nicht|keine ahnung|kein plan/i, () => {
      s.ready(() => {
        s.run("taxesHelp");
      });
    });

    ss.match(/hilfe/i, () => {
      s.say(
        'Deine Steuerklasse beschreibt die Einstufung der Versteuerung deines Einkommens.');
      s.say(" Diese findest du in der Regel auf deinem letzten Lohnnachweis.")
      s.say("Nenne mir einfach die Ziffer, die dort steht oder sage z.B. 'Lohnsteuerklass eins'.")
      s.say(" Wie lautet deinen Steuerklasse?")
      s.ready(() => {
       
      });
    });

    s.sub("taxesHelp", (ss) => {
      ss.begin(() => {
        s.set("voice", "Mary");
        s.say(
          "Kein Problem. Ich helfe dir dabei. Handelt es sich um ein Haupt- oder Nebeneinkommen?"
        );
        s.ready(() => {
         
        });
      });

      ss.match(/haupt/i, () => {
        s.say("Alles klar! Bist du denn verheiratet?");
        s.ready(() => {
          s.ready(() => {
          });
          s.run("married");
        });
      });

      s.sub("married", (ss) => {
        ss.begin(() => {
          s.set("voice", "Mary");
        });

        ss.match(/ja/i, () => {
          s.say(
            "Kleiner Tipp: Du kannst die Berechnung auch mit Steuerklasse 3 und 5 durchführen, um zu prüfen, ob das steuerliche Vorteile für dich bringt."
          );
          s.say("Für diese Berechnung fahren wir mit Steuerklasse 4 fort, da diese die gängige ist.");
          //Original: "Okay, weiter gehts. Wieviele Kinder hast du?""
          steuerKlasse = 4;
          married = true;
          s.ready(() => {
            s.run("children");
          });
        });

        ss.match(/nein/i, () => {
          //s.say("Alles klar! Hast du minderjährige Kinder?");
          s.ready(() => {
            s.run("children");
          });
        });
      });

      ss.match(/neben/i, () => {
        s.say(
          "Für Nebeneinkünfte ist die Steuerklasse 6 vorgesehen. Dies ist unabhängig davon, ob du verheiratet bist oder Kinder hast."
        );
        s.say("Für das Haupteinkommen beeinflussen diese aber die Berechnung.")
        s.say("Okay, weiter gehts. Wieviele Kinder hast du?");
        s.pause(4000);
        steuerKlasse = 6;
        s.ready(() => {
          s.run("children_sub");
        });
      });
    });

    ss.unknown(function () {
      s.say(
        `Da stimmt was nicht ganz. Am besten du nennst mir deine Steuerklasse als Zahl.`
      );
      s.say(" Diese kann zwischen 1 und 6 liegen. Falls du deine Steuerklasse nicht kennst, kann ich dir auch helfen.");
      s.say("Sage dazu einfach 'Keine Ahnung' und wir ermitteln deine Steuerklasse gemeinsam.")
      s.say("Also: Wie lautet deine Steuerklasse?")
    });
  });

  s.sub("children", (ss) => {
    ss.begin(() => {
      s.set("voice", "Mary");
      s.say(`Super, vielen Dank! Wieviele Kinder hast du?`);
      s.ready(() => {
        s.run("children_sub");
      });
    });
  });

  s.sub("children_sub", (ss) => {
    ss.begin(() => {
      s.set("voice", "Mary");
    });

    ss.match(/^[0-9]{0,}$/im, () => {
      children = parseInt(msgArray.slice(-1).pop());
      faktorVerfahren = married ? children : 0.5 * children;
      console.log("Amount of children", children);
      console.log("Faktorverfahren", faktorVerfahren);
      s.ready(() => {
        s.run("bundeslaender");
      });
    });
    ss.unknown(function () {
      s.say(
        "Ok ich verstehe. Kinder können viel Arbeit machen, aber Kinder können auch steuerliche Vergünstigungen bringen."
      );
      s.say("Nenne mir einfach die Anzahl deiner minderjährigen Kinder oder gib '0' ein.")
    });
  });

  s.sub("bundeslaender", (ss) => {
    ss.begin(() => {
      s.set("voice", "Mary");
      s.say("Ok! Und in welchem Bundesland lebst du? ");
  
    });

    let bundesLaender = new RegExp(
      /berlin|Berlin|brandenburg|Brandenburg|sachsen|Sachsen|bayern|Bayern|sachsen anhalt|sachsen-anhalt|Sachsen Anhalt|Sachsen-Anhalt|sachsen Anhalt|sachsen-Anhalt|Sachsen-anhalt|Sachsen anhalt|Mecklenburg-Vorpommern|Mecklenburg Vorpommern|mecklenburg-vorpommern|mecklenburg vorpommern|Mecklenburg-vorpommern|Mecklenburg vorpommern|mecklenburg-Vorpommern|mecklenburg Vorpommern|Thüringen|thüringen|Saarland|saarland|Nordrhein-Westfalen|Nordrhen Westfalen|Nordrhein westfalen|Nordrhein-westfalen|nordrhein-Westfalen|nordrhein Westfalen|nordrhein westfalen|nordrhein-westfalen|Niedersachsen|niedersachsen|Rheinland-Pfalz|Rheinland Pfalz|rheinland-pfalz|rheinland pfalz|Rheinland-pfalz|Rheinland pfalz|rheinland-Pfalz|rheinland Pfalz|Hessen|hessen|Baden-Würtemberg|Baden Würtemberg|Baden würtemberg|Baden-würtemberg|baden-würtemberg|baden würtemberg|baden-Würtemberg|baden Würtemberg|Schleswig-Holstein|Schleswig Holstein|Schleswig holstein|Schlesweig-holstein|schleswig-holstein|schleswigholstein|schleswig-Holstein|schleswigHolstein|Hamburg|hamburg|Bremen|bremen/
    );
    ss.match(bundesLaender, () => {
      bundesLand = msgArray.slice(-1).pop();
      console.log("Bundesland", bundesLand);

      s.ready(() => {
        s.run("churchTax");
      });
    });

    ss.match(/hilfe|kein plan|keine ahnung|weiß nicht/i, () => {
      s.say(
        `Das Bundesland ist deswegen wichtig, da die Sozialversicherungsbeiträge je Bundesland verschieden sind.`
      );
      s.say("So hat Bayern beispielsweise einen Satz von 8%, andere Bundesländer einen Satz von 9%.")
      s.say("Sag mir jetzt bitte das Bundesland, in dem du arbeitest.")
    });

    ss.unknown(function () {
      s.say(
        "Interessant - davon habe ich noch gar nichts gehört."
      );
      s.say("Um den Nettowert zu berechnen, benötige ich das Bundesland, in dem du in Deutschland gemeldet bist.")
      s.say("Sage jetzt den Namen des Bundeslandes.");
    });
  });

  s.sub("churchTax", (ss) => {
    ss.begin(() => {
      s.set("voice", "Mary");
      s.say("Bezahlst du Kirchensteuer?");
      s.ready(() => {
        
      });
    });

    ss.match(/ja/i, async () => {
      kirchensteuer = 1;
      /*switch (bundesLand.toLowerCase()) {
        case "bayern":
          netSalary -= grossValue * 0.09;
          break;
        default:
          netSalary -= grossValue * 0.08;
      }*/
      s.ready(() => {
        s.run("calculationResult");
      });
    });

    ss.match(/nein/i, async () => {
      kirchensteuer = 0;
      s.ready(() => {
        s.run("calculationResult");
      });
    });

    ss.match(/hilfe|kein plan|keine ahnung|weiß nicht/i, () => {
      s.say(
        `Abhängig vom Bundesland in dem du lebst, bezahlst du als Mitglied der evangelischen oder katholischen Kirche eine Kirchensteuer, die dir direkt vom Bruttolohn abgezogen wird.`
      );
      s.say("Wenn du aus der Kirche ausgetreten bist, entfällt diese Steuer.")
      s.say("Ebenso müssen Angehörige anderer Kirchengemeinschaften, wie beispielsweise Hinduisten oder Muslime keinen Beitrag in die evangelische oder katholische Kirche bezahlen.")
      s.say("Bezahlst du Kirchensteuer?");
    });

    ss.unknown(function () {
      s.say(
        "Bitte sage mir mit <b>'Ja'</b> oder <b>'Nein'</b> ob du Kirchensteuer zahlst."
      );
    });
  });

  s.sub("calculationResult", (ss) => {
    ss.begin(() => {
      s.set("voice", "Mary");

      //Sozialversicherungsbeiträge
      //Pflegeversicherung 3,4% ohne Kinder, 3,05% mit Kindern https://www.bundesgesundheitsministerium.de/themen/pflege/online-ratgeber-pflege/die-pflegeversicherung/finanzierung.html#:~:text=Der%20Beitragssatz%20liegt%20seit%20dem,H%C3%A4lfte%2C%20also%20jeweils%201%2C525%20Prozent.
      lst2021 = new Lohnsteuer2021({
        RE4: grossValue * 100,
        PKV: 0,
        ALTER1: 0,
        af: faktorVerfahren > 0 ? 1 : 0,
        f: faktorVerfahren,
        PVS: 0,
        R: 0,
        LZZHINZU: 0,
        PVZ: 0,
        STKL: steuerKlasse,
        LZZ: lzz,
        KRV: 0,
      });

      lst2021.MAIN();
      let steuern =
        lst2021.getLstlzz().value / 100 +
        lst2021.getSts().value / 100 +
        lst2021.getStv().value / 100;
      let pflegeVersicherung = children > 0 ? 0.034 : 0.0305;
      let sozialabgaben =
        grossValue * (0.093 + 0.073 + 0.01875 + pflegeVersicherung);
      console.log("steuern", steuern);
      console.log("sozialabgaben", sozialabgaben);
      netSalary = grossValue - (sozialabgaben + steuern);
      netSalary = (lzz === 1 ? netSalary / 12 : netSalary).toFixed(2);

      //RV: 9,3%
      //KV: 7,3%
      //PV: 1,875
      //https://www.lohn-info.de/sozialversicherungsbeitraege2022.html

      /*
              steuer = Math.floor(parseFloat(lst2021.getLstlzz()) + parseFloat(lst2021.getStv()) + parseFloat(lst2021.getSts())) / 100.0
              soli = Math.floor(parseFloat(lst2021.getSolzlzz()) + parseFloat(lst2021.getSolzs()) + parseFloat(lst2021.getSolzv())) / 100
              stges = steuer + soli
              console.log("stges"+ stges)
              console.log("Netsalary", grossValue - stges);*/
      s.say(
        `Sehr gut. Dann habe ich auch schon alles wichtige. Bitte beachte, dass das Ergebnis nur ein Richtwert ist. Der voraussichtliche Nettolohn beträgt ${netSalary} Euro.`
      );
      s.pause(1000);
    });
    s.ready(() => {
      s.run(s.get("condition"));
    });
  });

  s.sub("nudging", (ss) => {
    ss.begin(() => {
      s.set("voice", "Mary");
      s.say(
        "Soll ich die angegebenen Daten für die nächste Berechnung speichern?"
      );
      s.ready(() => {
    
      });
    });

    ss.match(/ja|jo|sicher|jaup|ok/i, () => {
      
      s.pause(5000);
      s.ready(() => {
        s.run("nudging_sub");
      });
    });

    s.sub("nudging_sub", (ss) => {
      ss.begin(() => {
        s.set("voice", "Mary");
        s.say(
          "Soll ich die angegebenen Daten für die nächste Berechnung speichern?"
        );
        s.ready(() => {
        
        });
      });
      ss.match(/ja|jo|sicher|jaup|ok/i, () => {
        s.say("Wird gemacht.");
        s.pause(1000);
        s.say("Auf Wiedersehen");
        s.ready(() => {
          s.run("survey_subscript");
        });
      });

      ss.match(/ne|nein|nicht speichern/i, () => {

      

        s.say("In Ordnung.");
        s.say("Auf Wiedersehen");
        s.pause(1000);
        s.ready(() => {
          s.run("survey_subscript");
        });
      });
    });

    ss.match(/ne|nein|nicht speichern/i, () => {
    

      s.say("In Ordnung.");
      s.say("Auf Wiedersehen");
      s.pause(1000);
      s.ready(() => {
        s.run("survey_subscript");
      });
    });

    ss.unknown(function () {
      s.say(
        "Sag einfach 'Ja', wenn ich die Daten für die nächste Berechnung speichern soll."
      );
    });
  });

  s.sub("privacy_priming", (ss) => {
    ss.begin(() => {
      s.set("voice", "Mary");
      s.pause(1000);
      s.say(
        "Soll ich die Daten aus dieser Konversation für dich löschen?"
      );
      s.ready(() => {
        
      });
    });

    ss.match(/ja|jo|sicher|jaup|löschen|ok/i, () => {
    

      s.say(
        "Okay. Ich habe deine Daten aus dieser Interaktion gelöscht."
      );
      s.say("Auf Wiedersehen!");
      s.pause(1000);
      s.ready(() => {
        s.run("survey_subscript");
      });
    });

    ss.match(
      /nein|nö|nicht löschen|lieber nicht|auf keinen Fall/i,
      () => {
     

        s.say("Alles klar.");
        s.say("Auf Wiedersehen!");
        s.pause(1000);
        s.ready(() => {
          s.run("survey_subscript");
        });
      }
    );

    ss.unknown(function () {
      s.say(
        "Entschuldigung, ich verstehe nicht. Sie können 'ja' oder 'nein' sagen, um die Daten zu löschen, die ich aus unserer Interaktion gesammelt habe."
      );
    });
  });

  s.sub("control", (ss) => {
    ss.begin(() => {
      s.set("voice", "Mary");
      s.say(
        "Soll ich die angegebenen Daten für die nächste Berechnung speichern?"
      );
    });

    ss.match(/ja|jo|sicher|jaup|ok/i, () => {
  

      s.say("Wird gemacht.");
      s.say("Auf Wiedersehen");
      s.pause(1000);
      s.ready(() => {
        s.run("survey_subscript");
      });
    });

    ss.match(/ne|nein|nicht speichern/i, () => {
   

      s.say("In Ordnung.");
      s.say("Auf Wiedersehen");
      s.pause(1000);
      s.ready(() => {
        s.run("survey_subscript");
      });
    });

    ss.unknown(function () {
      s.say(
        "Sage einfach 'Ja', wenn ich die Daten für die nächste Berechnung speichern soll."
      );
    });

  });

  s.sub("survey_subscript", (ss) => {
    ss.begin(() => {
      s.survey("survey");
    });
  });
});