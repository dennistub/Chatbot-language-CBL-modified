
let msgArray = [];
var cbl = new (function () {
  var self = this;
  self.vars = {};
  self.scripts = {};
  self.surveys = {};
  self.survey_defs = {};
  self.output = [];
  self.mturk_mode = false;
  self.instructions_funs = [];
  self.instructions_idx = 0;
  self.completed_fun = null;
  self.active_script = null;
  self.active_survey = null;
  self.get = function (k) {
    //console.log("cbl.get", k);
    return self.vars[k];
  };
  self.set = function (k, v) {
    // console.log("cbl.set", k, v);
    self.vars[k] = v;
  };
  self.set("audio_prefix", "audio/");
  self.set("voice_volume", 0.9);
  self.set("say_method", "audio_file");
  self.debug = true;
  //self.log = function (...l) {
  //   if (self.debug) console.log(...l);
  // };
  self.random_item = function (arr) {
    var item = arr[Math.floor(Math.random() * arr.length)];
    //  cbl.log("randomly selected", item);
    return item;
  };
  self.random_num = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  self.start = function (scriptname) {
    // cbl.log("starting " + scriptname);
    self.transcript = "";
    self.script_name = scriptname;
    self.talking = false;
    if (window.location.href.includes("mturk")) self.mturk_mode = true;
    if (self.mturk_mode) {
      $("#btn-finish")
        .clone()
        .attr("type", "submit")
        .insertAfter("#btn-finish")
        .prev()
        .remove();
      self.workerId = turkGetParam("workerId");
      self.assignmentId = turkGetParam("assignmentId");
      self.hitId = turkGetParam("hitId");
      self.answer_url = decodeURIComponent(turkGetParam("turkSubmitTo"));
      // console.log("workerId", self.workerId);
      // console.log("assignmentId", self.assignmentId);
      // console.log("hitId", self.hitId);
      // console.log("answer_url", self.answer_url);
      $("#survey_form").attr(
        "action",
        self.answer_url + "/mturk/externalSubmit"
      );
      $("input[name=assignmentId]").val(self.assignmentId);
      $("input[name=scriptName]").val(self.script_name);
    }
    $("#btn-finish").click(function () {
      if (self.active_survey && !self.validate_survey(self.active_survey))
        return false;
      if (self.completed_fun) {
        var s = new CBL2Completed();
        self.completed_fun(s);
      }
      $("#survey").hide();
      $("#completed").show();
    });
    if (self.instructions_funs.length) {
      $("#instructions").show();
      $("#content").hide();
      $("#btn-continue").click(function () {
        if (self.instructions_idx == self.instructions_funs.length - 1) {
          self.instructions_done();
        } else {
          self.instructions_idx += 1;
          self.instructions_next();
        }
      });
      self.instructions_next();
    } else {
      self.instructions_done();
    }
  };
  self.instructions_next = function () {
    var s = new CBL2Instructions();
    self.instructions_funs[self.instructions_idx](s);
  };
  self.instructions_done = function () {
    $("#instructions").hide();
    $("#content").show();
    cbl.run(self.script_name);
  };
  self.init_chat = function () {
    $("#btn-send").click(function () {
      let msg = $("#txt-input").val();
      self.msg_send(msg);
      msgArray.push(msg);
      $("#txt-input").val("");
    });
    $("#txt-input").keypress(function (e) {
      if (e.which == 13) {
        $("#btn-send").click();
      }
    });
  };
  self.msg_send = function (msg) {
    //console.log("Message send: ", msg);
    self.transcript += "[user] " + msg + "; ";
    $(".msgs").append(
      '<div class="msg-out msg-bubble msg-bubble-out"> ' + msg + "</div>"
    );
    self.scroll_to_bottom();
    self.active_script.input(msg);
  };
  self.msg_receive = function (name, msg, opts, cb) {
    msg = msg.replace(/\*([^*]+?)\*/g, "<b>$1</b>");
    msg = msg.replace(/\_([^*]+?)\_/g, "<i>$1</i>");
    self.transcript += "[" + name + "] " + msg + "; ";
    if (name)
      $(".msgs").append(
        '<div class="msg-in msg-bubble msg-bubble-in">' + msg + "</div>"
      );
    else
      $(".msgs").append(
        '<div class="msg-in msg-bubble msg-bubble-in"> ' + msg + "</div>"
      );
    self.scroll_to_bottom();
    self.play_voice(name, msg, opts);
  };
  self.play_voice = function (name, msg, opts) {
    var method = self.get("say_method");
    if (opts && opts["method"]) method = opts["method"];
    self.talking = true;
    $("#btn-send").attr("disabled", true);
    if (method == "browser_tts") {
      //  cbl.log("saying with browser tts", msg);
      var ttsmsg = new SpeechSynthesisUtterance(msg);
      ttsmsg.onend = function () {
        self.talking = false;
        $("#btn-send").attr("disabled", false);
        if (opts && opts["done"]) opts["done"]();
      };
      window.speechSynthesis.speak(ttsmsg);
    }
    if (method == "audio_file") {
      var fn = self.ttfn(name, msg);
      // cbl.log("playing audio file", fn);
      if (self.audio_playing) self.audio_playing.volume(self.audio_playing_vit);
      var sound = new Howl({
        src: [self.get("audio_prefix") + fn],
        autoplay: true,
        loop: false,
        volume: self.get("voice_volume"),
        onend: function () {
          self.talking = false;
          if (self.audio_playing)
            self.audio_playing.volume(self.audio_playing_vol);
          $("#btn-send").attr("disabled", false);
          if (opts && opts["done"]) opts["done"]();
        },
        onloaderror: function () {
          self.talking = false;
          if (self.audio_playing)
            self.audio_playing.volume(self.audio_playing_vol);
          $("#btn-send").attr("disabled", false);
        },
      });
    }
  };
  self.audio_playing = null;
  self.audio_playing_vol = 0.9;
  self.audio_playing_vit = 0.9;
  self.play_audio = function (fn, opts, cb) {
    self.audio_playing_vol = 0.9;
    self.audio_playing_vit = 0.9;
    if (opts && opts["vol"]) self.audio_playing_vol = opts["vol"];
    if (opts && opts["vol_if_talking"])
      self.audio_playing_vit = opts["vol_if_talking"];
    if (self.audio_playing) {
      self.stop_audio();
    }
    //  cbl.log("playing audio file", fn);
    self.audio_playing = new Howl({
      src: [self.get("audio_prefix") + fn],
      autoplay: true,
      loop: false,
      volume: self.audio_playing_vol,
      onend: function () {
        self.audio_playing = null;
        if (cb) cb();
      },
      onloaderror: function () {
        self.audio_playing = null;
        if (cb) cb();
      },
    });
  };
  self.play_audio_volume = function (vol) {
    if (self.audio_playing) self.audio_playing.volume(vol);
    self.audio_playing_vol = vol;
  };
  self.stop_audio = function () {
    if (self.audio_playing != null) {
      self.audio_playing.stop();
      self.audio_playing.unload();
      self.audio_playing = null;
    }
  };
  self.pause = function (ms) {
    setTimeout(function () {
      self.talking = false;
    }, ms);
  };
  self.think = function () {
    if (self.talking) return;
    var o = cbl.output.shift();
    if (!o) return;
    if (typeof o[0] == "function") {
      o[0](o[1]);
    }
    if (o[1] && o[2]) {
      //   cbl.log("saying", o[2], "as", o[1]);
      cbl.msg_receive(o[1], o[2], o[3]);
      return;
    }
    if (!o[1]) {
      self.talking = true;
      //   cbl.log("pausing (ms) ", o[0]);
      cbl.pause(o[0]);
    }
  };
  self.ttfn = function (name, text) {
    var t = self.strip_tags(text);
    t = t.replace(/ /g, "_").replace(/[^0-9a-zA-Z_\-]/gi, "");
    return name.toLowerCase() + "_" + t.toLowerCase() + ".mp3";
  };
  self.strip_tags = function (html) {
    return html.replace(/<[^>]*>?/gm, "");
  };
  self.script = function (script_name, f) {
    var s = new CBL2Script();
    f(s);
    self.scripts[script_name] = s;
  };
  self.instructions = function (f) {
    self.instructions_funs.push(f);
  };
  self.completed = function (f) {
    self.completed_fun = f;
  };
  self.survey = function (survey_name, f) {
    var s = new CBL2Survey();
    f(s);
    self.survey_defs[survey_name] = f;
    self.surveys[survey_name] = s;
  };
  self.survey_results_json = function (survey_name) {
    var f = self.survey_defs[survey_name];
    var s = new CBL2SurveyResults();
    f(s);
    return JSON.stringify(self.merge_all_results(s.results()));
  };
  self.survey_results_csv = function (survey_name) {
    var f = self.survey_defs[survey_name];
    var s = new CBL2SurveyResults();
    f(s);
    return self.obj_to_csv(self.merge_all_results(s.results()));
  };
  self.obj_to_csv = function (obj) {
    var csv = "";
    for (var k in obj) {
      csv += '"' + k + '"' + ",";
    }
    csv += "\n";
    for (var k in obj) {
      var v = obj[k];
      csv += '"' + v + '",';
    }
    csv += "\n";
    return csv;
  };
  self.merge_all_results = function (s) {
    var mr = Object.assign(s, self.custom_results);
    mr["transcript"] = self.transcript;
    return mr;
  };
  self.custom_results = {};
  self.set_result = function (k, v) {
    $("#survey_form").append(
      '<input type="hidden" name="' + k + '" value="' + v + '" />'
    );
    self.custom_results[k] = v;
  };
  self.run = function (script_name) {
    self.active_script = self.scripts[script_name];
    self.active_script.restart();
  };
  self.show_survey = function (survey_name) {
    self.active_survey = survey_name;
    $("#content").hide();
    $("#survey-qa").html(self.surveys[survey_name].html());
    $("#survey").show();
    self.transcript += "EOT";
    $("input[name=transcript]").val(self.transcript);
  };
  self.validate_survey = function (survey_name) {
    var f = self.survey_defs[survey_name];
    var s = new CBL2SurveyValidator();
    f(s);
    if (s.success) return true;
    else {
      $("#status").html(s.errmsg);
      return false;
    }
  };
  self.scroll_to_bottom = function () {
    var div = $(".msgs")[0];
    div.scrollTop = div.scrollHeight;
  };
  self.init_chat();
})();
var CBL2Script = function () {
  var self = this;
  this.script = [];
  this.subs = [];
  this.vars = {};
  this.parent = null;
  self.get = function (k) {
    return self.vars[k];
  };
  self.set = function (k, v) {
    self.vars[k] = v;
  };
  this.init = function () {
    setInterval(function () {
      cbl.think();
    }, 100);
    self.set("typing_delay_max_ms", 1000);
    self.set("thinking_delay_max_ms", 2000);
  };
  this.restart = function () {
    self.do("_begin_");
  };
  this.begin = function (f) {
    self.match("_begin_", f);
  };
  this.unknown = function (f) {
    self.match("_unknown_", f);
  };
  this.survey = function (survey_name) {
    cbl.show_survey(survey_name);
  };
  this.sub = function (label, f) {
    self.subs.push([label, f]);
  };
  this.run = function (label) {
    //    cbl.log("running subscript", label);
    var ss = new CBL2Script();
    ss.parent = self;
    cbl.active_script = ss;
    for (var si of self.subs) {
      if (si[0] == label) {
        si[1](ss);
        break;
      }
    }
    ss.do("_begin_");
  };
  this.ret = function () {
    var p = cbl.active_script.parent;
    if (p) {
      //  cbl.log("returning from subscript");
      cbl.active_script = p;
    }
  };
  this.match = function (matchable, f) {
    self.script.push([matchable, (s) => true, f]);
  };
  this.match_if = function (regexp, expr, f) {
    self.script.push([regexp, expr, f]);
  };
  this.do = function (text) {
    var done = false;
    for (var si of self.script) {
      //   cbl.log("evaluating ", si);
      var m = self.matches(si[0], text);
      if (m) {
        if (si[1](self)) {
          // cbl.log("evaluated true: ", si[1]);
          // cbl.log("doing: ", si[2]);
          si[2](m);
          done = true;
          break;
        } else {
          //  cbl.log("evaluated false: ", si[1]);
        }
      }
    }
    if (done || !self.parent) return done;
    for (var si of self.parent.script) {
      var m = self.matches(si[0], text);
      if (m) {
        if (si[1](self)) {
          //  cbl.log("evaluated true: ", si[1]);
          si[2](m);
          done = true;
          break;
        } else {
          // cbl.log("evaluated false: ", si[1]);
        }
      }
    }
    return done;
  };
  this.matches = function (s1, s2) {
    // cbl.log("match?", s1, s2);
    if (s1 == s2) {
      // cbl.log("matched", s2);
      return s1;
    }
    if (s2[0] == "_") return false;
    if (s1 instanceof RegExp) {
      var m = s2.match(s1);
      if (m) {
        //  cbl.log("matched", s2);
        return m;
      }
    }
    return false;
  };
  this.say = function (text, opts) {
    var voice = self.get("voice");
    if (Array.isArray(text)) text = cbl.random_item(text);
    var typing_delay_ms =
      self.get("typing_delay_max_ms") -
      self.get("typing_delay_max_ms") / text.length;
    if (opts && opts["voice"]) voice = opts["voice"];
    cbl.output.push([typing_delay_ms, null, null, null]);
    cbl.output.push([0, voice, text, opts]);
  };
  this.pause = function (ms) {
    cbl.output.push([ms, null, null, null]);
  };
  this.ready = function (fun) {
    cbl.output.push([fun, self, null, null]);
  };
  this.delay = function (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  this.input = function (text) {
    var thinking_delay_ms =
      self.get("thinking_delay_max_ms") -
      self.get("thinking_delay_max_ms") / text.length;
    //  cbl.log("thinking (ms) ", thinking_delay_ms);
    self.delay(thinking_delay_ms).then(function () {
      if (!self.do(text)) self.do("_unknown_");
    });
  };
  self.init();
};
var CBL2Instructions = function () {
  this.html = function (html) {
    $("#instructions-content").html(html);
  };
};
var CBL2Completed = function () {
  this.html = function (html) {
    $("#completed-content").html(html);
  };
};
var CBL2Survey = function () {
  var self = this;
  this.output = "";
  this.html = function () {
    return self.output;
  };
  this.section = function (t) {
    self.output += "<h4>" + t + "</h4>";
  };
  this.select = function (n, t, arr, opts) {
    var desc_width = "50%";
    if (opts && opts["desc_width"]) desc_width = opts["desc_width"];
    self.output +=
      '<table width="100%">' +
      "<tr>" +
      '<td width="' +
      desc_width +
      '">' +
      t +
      "</td>" +
      "<td>" +
      '<select class="form-control" name="' +
      n +
      '">';
    arr.forEach(function (a) {
      self.output += '<option value="' + a[0] + '">' + a[1] + "</option>";
    });
    self.output += "</select>" + "</td>" + "</tr>" + "</table>";
  };
  this.input_text = function (n, t, opts) {
    var desc_width = "50%";
    if (opts && opts["desc_width"]) desc_width = opts["desc_width"];
    self.output +=
      '<table width="100%"><tr>' +
      '<td width="' +
      desc_width +
      '">' +
      t +
      "</td>" +
      "<td>" +
      '<input type="text" name="' +
      n +
      '" class="form-control" />' +
      "</td>" +
      "</tr>" +
      "</table>";
  };
  this.textarea = function (n, t, opts) {
    var rows = 5;
    if (opts && opts["rows"]) rows = opts["rows"];
    self.output +=
      "<div>" +
      t +
      "</div>" +
      '<textarea name="' +
      n +
      '" rows="' +
      rows +
      '" class="form-control"></textarea>';
  };
  this.input_range = function (n, t, r0, r1, opts) {
    var desc_width = "50%";
    if (opts && opts["desc_width"]) desc_width = opts["desc_width"];
    self.output +=
      '<table width="100%"><tr>' +
      '<td width="' +
      desc_width +
      '">' +
      t +
      "</td>" +
      "<td>" +
      '<input type="number" name="' +
      n +
      '" min="' +
      r0.toString() +
      '" max="' +
      r1.toString() +
      '" class="form-control" />' +
      "</td>" +
      "</tr>" +
      "</table>";
  };
  this.likert_scale = function (arr, opts) {
    var points = 5;
    if (opts && opts["points"]) points = opts["points"];
    var disagree = "Disagree";
    var agree = "Agree";
    if (opts && opts["disagree"]) disagree = opts["disagree"];
    if (opts && opts["agree"]) agree = opts["agree"];
    self.output +=
      "<table><tr>" +
      '<td width="450px"></td>' +
      '<td width="75px">' +
      '<span class="small">' +
      disagree +
      "</span>" +
      "</td>";
    for (var i = 1; i < points - 1; i++) {
      self.output += '<td width="75px"></td>';
    }
    self.output +=
      '<td width="75px">' +
      '<span class="small">' +
      agree +
      "</span>" +
      "</td></tr>";
    arr.forEach(function (a) {
      var n = a[0];
      var q = a[1];
      self.output += "<tr>" + "<td>" + q + "</td>";
      for (var i = 1; i < points + 1; i++) {
        self.output +=
          '<td width="75px">' +
          '<input type="radio" name="' +
          n +
          '" value="' +
          i.toString() +
          '" /></td>';
      }
      self.output += "</tr>";
    });
    self.output += "</table><br/>";
  };
  this.sem_diff_scale = function (arr, opts) {
    var points = 5;
    if (opts && opts["points"]) points = opts["points"];
    self.output += '<table width="100%">';
    arr.forEach(function (a) {
      var n = a[0];
      var q1 = a[1];
      var q2 = a[2];
      self.output += "<tr><td>" + q1 + "</td>";
      for (var i = 1; i < points + 1; i++) {
        self.output +=
          '<td><input type="radio" name="' +
          n +
          '" value="' +
          i.toString() +
          '" /></td>';
      }
      self.output += "<td>" + q2 + "</td></tr>";
    });
    self.output += "</table><br/>";
  };
};
var CBL2SurveyResults = function () {
  var self = this;
  this.output = {};
  this.results = function () {
    return self.output;
  };
  this.section = function (t) {};
  this.select = function (n, t, arr) {
    self.output[n] = $('select[name="' + n + '"] :selected').val();
  };
  this.input_range = function (n, t, r0, r1) {
    self.output[n] = $('input[name="' + n + '"]').val();
  };
  this.input_text = function (n, t) {
    self.output[n] = $('input[name="' + n + '"]').val();
  };
  this.textarea = function (n, t) {
    self.output[n] = $('textarea[name="' + n + '"]').val();
  };
  this.likert_scale = function (arr) {
    arr.forEach(function (a) {
      var n = a[0];
      var q = a[1];
      self.output[n] = $('input[name="' + n + '"]:checked').val();
    });
  };
  this.sem_diff_scale = function (arr) {
    arr.forEach(function (a) {
      var n = a[0];
      var q = a[1];
      self.output[n] = $('input[name="' + n + '"]:checked').val();
    });
  };
};
var CBL2SurveyValidator = function () {
  var self = this;
  this.success = true;
  this.errmsg = "";
  this.section = function (t) {};
  this.select = function (n, t, arr) {
    var v = $('select[name="' + n + '"] :selected').val();
    if (!v) {
      self.success = false;
      self.errmsg = "Please select an option for " + t;
    }
  };
  this.input_range = function (n, t, r0, r1) {
    var v = $('input[name="' + n + '"]').val();
    if (!(parseInt(v) >= r0 && parseInt(v) <= r1)) {
      success = false;
      self.errmsg = "Please enter a valid number for " + t;
    }
  };
  this.input_text = function (n, t, opts) {
    var v = $('input[name="' + n + '"]').val();
    if (!v && opts && opts["required"]) {
      success = false;
      self.errmsg = "Please enter text for " + t;
    }
  };
  this.textarea = function (n, t, opts) {
    var v = $('textarea[name="' + n + '"]').val();
    if (!v && opts && opts["required"]) {
      success = false;
      self.errmsg = "Please enter text for " + t;
    }
  };
  this.likert_scale = function (arr) {
    arr.forEach(function (a) {
      var n = a[0];
      var q = a[1];
      var v = $('input[name="' + n + '"]:checked').val();
      if (!v) {
        self.success = false;
        self.errmsg = "Please select an option for " + q;
      }
    });
  };
  this.sem_diff_scale = function (arr) {
    arr.forEach(function (a) {
      var n = a[0];
      var q1 = a[1];
      var q2 = a[2];
      var v = $('input[name="' + n + '"]:checked').val();
      if (!v) {
        self.success = false;
        self.errmsg = "Please select an option for " + q1 + " / " + q2;
      }
    });
  };
};

cbl.instructions((e) => {
  e.html(`<p>Willkommen zu diesem&nbsp;<b>Experiment mit einem Chatbot-System</b>.<br/><br/>In diesem Experiment,&nbsp;wird Ihnen eine Aufgabe gestellt,&nbsp;die Sie mit unserem Chatbot-System l??sen sollen.&nbsp;<b>Die Aufgabe wird am unteren Rand Ihres Bildschirms angezeigt</b>,&nbsp;nachdem Sie&nbsp;"weiter"&nbsp;geklickt haben.&nbsp;Am Ende Ihrer Interaktion,&nbsp;werden Sie gebeten,&nbsp;eine Umfrage ??ber Ihre Erfahrungen mit der Interaktion auszuf??llen.&nbsp;Die Studie dauert etwa 5 Minuten.</p><br/><textarea rows="10"style="width: 100%;">Einverst??ndniserkl??rung nach GDPR
  Sie erkl??ren sich einverstanden,&nbsp;an der Studie&nbsp;"Evaluation der Nutzererfahrungen mit einem Chatbot-System"&nbsp;des Fraunhofer-Instituts f??r Integrierte Schaltungen IIS&nbsp;(im Folgenden Fraunhofer IIS)teilzunehmen.&nbsp;Die Teilnahme an der Studie beinhaltet eine kurze Interaktion mit einem Chatbot,&nbsp;sowie das Ausf??llen eines Fragebogens,der zur Verbesserung der Kommunikation mit Maschinen dient.&nbsp;Ich bin damit einverstanden,&nbsp;dass das Fraunhofer IIS,&nbsp;Am Wolfsmantel 33,&nbsp;91058 Erlangen,&nbsp;Deutschland,&nbsp;zum Zwecke der Durchf??hrung,&nbsp;der Auswertung und Pr??sentation der oben genannten Studie,&nbsp;folgende pers??nliche Daten von mir erheben darf:&#10;-&nbsp;Bruttogehalt
  -&nbsp;Steuerklasse
  -&nbsp;Anzahl an Kindern
  -&nbsp;Bundesland
  -&nbsp;Wird Kirchensteuer gezahlt?-&nbsp;Subjektive Bewertungen Ihrer Erfahrung mit dem Chatbot-System
  (nachstehend als&nbsp;"Daten"&nbsp;bezeichnet).&#10;Eine weitere Verwendung der Daten ist ausgeschlossen.&#10;Die anonymisierten Daten werden in der Mensch-Maschine-Interaktion,&nbsp;User Experience und Natural Language Processing sowie f??r statistische Auswertungen der Studie verwendet.&nbsp;Die Auswertung Ihrer Daten erfolgt ausschlie??lich durch Mitarbeiter des Fraunhofer IIS,&nbsp;diese sind zur Vertraulichkeit verpflichtet.&#10;Ich willige ferner ein,&nbsp;dass das Fraunhofer IIS meine oben genannten Daten an die folgenden Datenschutzbeauftragten und die f??r die Verarbeitung der Daten f??r den oben genannten Zweck Verantwortlichen weitergeben darf:&#10;-&nbsp;Fraunhofer-Gesellschaft
  -&nbsp;Entwicklungspartner
  -&nbsp;Universit??ten
  -&nbsp;Dienstanbieter
  Soweit diese zum Zweck der Erreichung des Forschungszwecks in das Projekt eingebunden sind.&#10;Die Teilnahme an der Studie ist freiwillig.&nbsp;Sie k??nnen Ihre Teilnahme an der Studie jederzeit beenden und Ihre Zustimmung zur Studie ohne Angabe von Gr??nden ??ndern oder widerrufen.&#10;In Bezug auf die von uns verarbeiteten personenbezogenen Daten haben Sie Anspruch auf die Rechte der betroffenen Person nach GDPR,&nbsp;das Recht auf Information,&nbsp;Berichtigung,&nbsp;Widerruf oder Sperrung/L??schung Ihrer Daten,&nbsp;sowie das Recht,&nbsp;sich bei der Aufsichtsbeh??rde zu beschweren.&#10;Die Anforderungen des 32 GDPR-Formulars f??r den Schutz personenbezogener Daten werden erf??llt.&#10;Die Daten werden so lange elektronisch gespeichert,&nbsp;wie es f??r die Erf??llung des wissenschaftlichen Forschungszwecks erforderlich ist&nbsp;(Entwicklung benutzerfreundlicher Maschinen und wissenschaftliche Ver??ffentlichung der Forschungsergebnisse).&nbsp;Soweit der Forschungszweck ernsthaft beeintr??chtigt wird oder seine Verwirklichung unm??glich wird,&nbsp;k??nnen im Rahmen der gesetzlichen Erlaubnisbestimmungen Ausnahmen von den in den Abs??tzen 15,&nbsp;16,&nbsp;18 und 21 GDPR genannten Rechten vorgesehen werden.&#10;Wenn Sie Fragen zur Erhebung und zum Datenschutz haben,&nbsp;wenden Sie sich bitte an:&#10;Dr.Birgit Popp,&nbsp;birgit.popp@iis.fraunhofer.de
  Fraunhofer-Datenschutzbeauftragter:&nbsp;Prof.Dr.Ralph Harter,&nbsp;ralph.harter@zv.fraunhofer.de</textarea><br/><br/>
  `);
});

cbl.script("datev-backup", (s) => {
  let grossValue = 0;
  let netSalary = 0;
  let bundesLand = "";

  s.begin(() => {
    s.set("condition", cbl.random_item(["privacy_priming", "control"]));
    $("#survey_form").append(
      '<input type="hidden" name="condition" value="' +
        s.get("condition") +
        '" />'
    );
    s.run("welcome");
  });
  s.sub("welcome", (ss) => {
    ss.begin(() => {
      s.set("voice", "Mary");
      s.say(
        "Hi! Willkommen beim DATEV Gehaltsrechner. Ich kann dir einen ??berblick ??ber deinen Netto-Lohn geben, wenn du mir dein Bruttogehalt, deine Steuerklasse, die Kinderanzahl und deine Kirchensteuerpflicht verr??tst. M??chtest du f??r den Einstieg eine kurze Einf??hrung h??ren?"
      );
      $("#hint").html(
        "Aufgabe: Sie k??nnen mit <b>Ja</b> oder <b>Nein</b> antworten."
      );
    });
    ss.match(/stop|alexa stop/i, () => {
      s.say("Tsch??ss. Bis dann!!");
      s.survey("css-survey");
    });
    ss.match(/ja/i, () => {
      s.run("introduction");
    });
    ss.match(/nein/i, () => {
      s.say(
        'Kein Problem! ??brigens: Wenn du die Einf??hrung doch h??ren willst, sag einfach "Alexa, Hilfe". F??r welchen Betrag m??chtest du den Nettowert wissen?'
      );
      s.run("grossSalary");
    });
    s.sub("introduction", (ss) => {
      ss.begin(() => {
        s.set("voice", "Mary");
      });
      s.say(
        `Alles klar.Ich kann die Lohnsteuer f??r Arbeitnehmer und Arbeitgeber berechnen.Um die Arbeitgeberkosten zu erhalten,sage einfach"Arbeitgeberkosten"`
      );
      s.pause(5000);
      s.say(
        "In beiden F??llen stelle ich dir einige Fragen zur Steuerklasse, Kirchenbetr??gen oder auch deinem Alter. In der Berechnung gehe ich davon aus, dass du gesetzlich versichert bist und keine weiteren Geldwerten Vorteile angeben willst."
      );
      s.pause(5000);
      s.say(
        "Au??erdem hast du die M??glichkeit, deine Daten zu speichern oder dir die Ergebnisse per E-Mail zusenden zu lassen. Hierf??r ben??tige ich nat??rlich deine Erlaubnis. Diese kannst du in der Alexa App freigeben."
      );
      s.pause(5000);
      s.say(
        `Wenn du sp??ter nochmal die Einf??hrung h??ren willst,sage einfach"Alexa, Hilfe".Das war's auch schon. F??r welchen Betrag m??chtest du den Nettowert wissen?`
      );

      s.ready(() => {
        s.run("grossSalary");
      });
      $("#hint").html("");
    });

    ss.unknown(function () {
      s.run("introduction");
    });
  });

  s.sub("grossSalary", (ss) => {
    $("#hint").html(
      "Sie k??nnen entweder ein Jahres- oder Monatsgehalt angeben."
    );

    ss.begin(() => {
      s.set("voice", "Mary");
    });
    console.log("grosssalary wird ausgef??hrt");

    ss.match(/^[4-9][5-9][0-9]|\d{3,}/im, () => {
      grossValue = parseInt(msgArray.slice(-1).pop());
      netSalary = grossValue;
      if (grossValue > 15000) {
        s.run("annualIncome");
      } else {
        s.say(
          `Alles klar! ${grossValue} Euro Bruttogehalt. Wie ist deine Steuerklasse?`
        );
        s.run("taxClass");
      }
    });

    s.sub("annualIncome", (ss) => {
      $("#hint").html("");
      ss.begin(() => {
        s.set("voice", "Mary");
        s.say("Ist dein Gehalt ein Jahreseinkommen?");
      });

      ss.match(/ja/i, () => {
        netSalary = grossValue / 12;
        s.say("Alles klar. Wie ist deine Steuerklasse?");
        s.ready(() => {
          s.run("taxClass");
        });
      });

      ss.match(/nein/i, () => {
        netSalary = grossValue;
        s.say("Alles klar. Wie ist deine Steuerklasse?");
        s.ready(() => {
          s.run("taxClass");
        });
      });
    });

    ss.match(/hilfe/i, () => {
      s.say(
        "Nenne uns hier einen Betrag, zum Beispiel 1000 Euro. F??r welchen Betrag m??chtest du den Nettowert wissen?"
      );
    });

    ss.unknown(function () {
      s.say(
        "Hoppla, da scheint etwas nicht zu stimmen. Um den Nettolohn zu berechnen, ben??tige ich den Bruttobetrag deines monatlichen Einkommens. Der Bruttobetrag ist dein Gehalt vor Abzug aller Steuern und Versicherungen. Versuchen wir es noch einmal. F??r welchen Betrag m??chtest du den Nettowert wissen?"
      );
    });
    $("#hint").html();
  });

  s.sub("taxClass", (ss) => {
    ss.begin(() => {
      s.set("voice", "Mary");
    });

    let taxClassRegex = new RegExp(/^[1-6]?$|6/im);
    ss.match(taxClassRegex, () => {
      let taxClass = msgArray.slice(-1).pop();
      switch (parseInt(taxClass)) {
        case 1:
        case 4:
          netSalary -= grossValue * 0.1887;
          console.log("SK 1/ 4");
          break;
        case 2:
          netSalary -= grossValue * 0.164;
          console.log("SK 2");

          break;
        case 3:
          netSalary -= grossValue * 0.1119;
          console.log("SK 3");
          break;
        case 5:
          netSalary -= grossValue * 0.2806;
          console.log("SK 5");

          break;
        case 6:
          netSalary -= grossValue * 0.2884;
          console.log("SK 6");

          break;
      }
      console.log("Net salary after taxes", netSalary);
      s.say(`Super, vielen Dank! Wieviele Kinder hast du?`);
      s.ready(() => {
        s.run("children");
      });
    });

    ss.match(/wei?? nicht|wei?? ich nicht|keine ahnung|kein plan/i, () => {
      s.run("taxesHelp");
    });

    ss.match(/hilfe/i, () => {
      s.say(
        'Deine Steuerklasse beschreibt die Einstufung der Versteuerung deines Einkommens. Diese findest du in der Regel auf deinem letzten Lohnnachweis. Nenne mir einfach die Ziffer, die dort steht oder sage z.B. "Lohnsteuerklass eins". Wie lautet deinen Steuerklasse?'
      );
    });

    s.sub("taxesHelp", (ss) => {
      ss.begin(() => {
        s.set("voice", "Mary");
        s.say(
          "Kein Problem. Ich helfe dir dabei. Handelt es sich um ein Haupt- oder Nebeneinkommen?"
        );
      });

      ss.match(/Haupteinkommen/i, () => {
        s.say("Alles klar! Bist du denn verheiratet?");
        s.run("married");
      });

      s.sub("marrried", (ss) => {
        ss.begin(() => {
          s.set("voice", "Mary");
        });

        ss.match(/ja/i, () => {
          s.say(
            "Kleiner Tipp: Du kannst die Berechnung auch mit Steuerklasse 3 und 5 durchf??hren, um zu pr??fen, ob das steuerliche Vorteile f??r dich bringt. F??r diese Berechnung fahren wir mit Steuerklasse 4 fort, da diese die g??ngige ist. Okay, weiter gehts. Wieviele Kinder hast du?"
          );
          s.run("children");
        });

        ss.match(/nein/i, () => {
          s.say("Alles klar! Hast du minderj??hrige Kinder?");
          s.run("children");
        });
      });

      ss.match(/Nebeneinkommen/i, () => {
        s.say(
          "F??r Nebeneink??nfte ist die Steuerklasse 6 vorgesehen. Dies ist unabh??ngig davon, ob du verheiratet bist oder Kinder hast. F??r das Haupteinkommen beeinflussen diese aber die Berechnung. Okay, weiter gehts. Wieviele Kinder hast du?"
        );
        s.run("children");
      });
    });

    ss.unknown(function () {
      s.say(
        `Da stimmt was nicht ganz. Am besten du nennst mir deine Steuerklasse als Zahl. Diese kann zwischen 1 und 6 liegen. Falls du deine Steuerklasse nicht kennst, kann ich dir auch helfen. Sage dazu einfach "Keine Ahnung" und wir ermitteln deine Steuerklasse gemeinsam. Also: Wie lautet deine Steuerklasse?`
      );
    });
    $("#hint").html("Bitte geben Sie einen Wert zwischen 1 und 6 an.");
  });

  s.sub("children", (ss) => {
    ss.begin(() => {
      s.set("voice", "Mary");
    });

    ss.match(/^[0-9]{0,}$/im, () => {
      s.say("Ok! Und in welchem Bundesland lebst du? ");
      s.run("bundeslaender");
    });

    ss.unknown(function () {
      s.say("");
    });
    $("#hint").html("Wenn du keine Kinder hast, gib 0 ein.");
  });

  s.sub("bundeslaender", (ss) => {
    ss.begin(() => {
      s.set("voice", "Mary");
    });

    let bundesLaender = new RegExp(
      /berlin|Berlin|brandenburg|Brandenburg|sachsen|Sachsen|bayern|Bayern|sachsen anhalt|sachsen-anhalt|Sachsen Anhalt|Sachsen-Anhalt|sachsen Anhalt|sachsen-Anhalt|Sachsen-anhalt|Sachsen anhalt|Mecklenburg-Vorpommern|Mecklenburg Vorpommern|mecklenburg-vorpommern|mecklenburg vorpommern|Mecklenburg-vorpommern|Mecklenburg vorpommern|mecklenburg-Vorpommern|mecklenburg Vorpommern|Th??ringen|th??ringen|Saarland|saarland|Nordrhein-Westfalen|Nordrhen Westfalen|Nordrhein westfalen|Nordrhein-westfalen|nordrhein-Westfalen|nordrhein Westfalen|nordrhein westfalen|nordrhein-westfalen|Niedersachsen|niedersachsen|Rheinland-Pfalz|Rheinland Pfalz|rheinland-pfalz|rheinland pfalz|Rheinland-pfalz|Rheinland pfalz|rheinland-Pfalz|rheinland Pfalz|Hessen|hessen|Baden-W??rtemberg|Baden W??rtemberg|Baden w??rtemberg|Baden-w??rtemberg|baden-w??rtemberg|baden w??rtemberg|baden-W??rtemberg|baden W??rtemberg|Schleswig-Holstein|Schleswig Holstein|Schleswig holstein|Schlesweig-holstein|schleswig-holstein|schleswigholstein|schleswig-Holstein|schleswigHolstein|Hamburg|hamburg|Bremen|bremen/
    );
    ss.match(bundesLaender, () => {
      bundesLand = msgArray.slice(-1).pop();
      console.log("Bundesland", bundesLand);

      s.run("churchTax");
    });

    ss.match(/hilfe|kein plan|keine ahnung|wei?? nicht/i, () => {
      s.say(
        `Das Bundesland ist deswegen wichtig, da die Sozialversicherungsbeitr??ge je Bundesland verschieden sind. So hat Bayern beispielsweise einen Satz von 8%, andere Bundesl??nder einen Satz von 9%. Sag mir jetzt bitte das Bundesland, in dem du arbeitest.`
      );
    });

    ss.unknown(function () {
      s.say(
        "Interessant - davon habe ich noch gar nichts geh??rt. Um den Nettowert zu berechnen, ben??tige ich das Bundesland, in dem du in Deutschland gemeldet bist. Sage jetzt den Namen des Bundeslandes"
      );
    });
  });

  s.sub("churchTax", (ss) => {
    ss.begin(() => {
      s.set("voice", "Mary");
      s.say("Bezahlst du Kirchensteuer?");
    });

    ss.match(/ja/i, async () => {
      console.log("Nettolohn vor Kirchensteuer", netSalary);
      switch (bundesLand.toLowerCase()) {
        case "bayern":
          netSalary -= grossValue * 0.09;
          break;
        default:
          netSalary -= grossValue * 0.08;
      }
      console.log("Nettolohn nach Kirchensteuer", netSalary);
      netSalary -= grossValue * 0.2;
      s.say(
        `Sehr gut. Dann habe ich auch schon alles wichtige. Bitte beachte, dass das Ergebnis nur ein Richtwert ist. Der voraussichtliche Nettolohn betr??gt ${netSalary} Euro.`
      );
      s.ready(() => {
        s.run(s.get("condition"));
      });
    });

    ss.match(/nein/i, async () => {
      //calculate correct amount. church tax: 9%, normal tax below
      // if (grossValue >= 579000) {
      //   netSalary -= grossValue * 0.42;
      // } else {
      //   console.log("Kein spitzensteuersatz");
      //   netSalary -= grossValue * 0.16;
      //   console.log(netSalary);
      // }

      //sozialversicherung + Krankenversicherung
      netSalary -= grossValue * 0.2;
      s.say(
        `Sehr gut. Dann habe ich auch schon alles wichtige. Bitte beachte, dass das Ergebnis nur ein Richtwert ist. Der voraussichtliche Nettolohn betr??gt ${netSalary} Euro.`
      );
      s.ready(() => {
        s.run(s.get("condition"));
      });
    });

    ss.match(/hilfe|kein plan|keine ahnung|wei?? nicht/i, () => {
      s.say(
        `Abh??ngig vom Bundesland in dem du lebst, bezahlst du als Mitglied der evangelischen oder katholischen Kirche eine Kirchensteuer, die dir direkt vom Bruttolohn abgezogen wird. Wenn du aus der Kirche ausgetreten bist, entf??llt diese Steuer. Ebenso m??ssen Angeh??rige anderer Kirchengemeinschaften, wie beispielsweise Hinduisten oder Muslime keinen Beitrag in die evangelische oder katholische Kirche bezahlen. Bezahlst du Kirchensteuer? `
      );
    });

    ss.unknown(function () {});
  });

  s.sub("privacy_priming", (ss) => {
    ss.begin(() => {
      s.set("voice", "Mary");
      s.say(
        "Wollen Sie, dass ihre Daten gel??scht werden, um ihre Privatsph??re zu sch??tzen?"
      );
    });

    ss.match(/ja|jo|sicher|jaup|l??schen|ok/i, () => {
      $("#survey_form").append(
        '<input type="hidden"name="response_yn"value="yes"/>'
      );

      s.say("Okay. Ich habe Ihre Daten aus dieser Interaktion gel??scht.");
      s.say("Auf Wiedersehen!");
      s.pause(1000);
      s.ready(() => {
        s.run("survey_subscript");
      });
    });

    ss.match(/nein|n??|nicht l??schen|lieber nicht|auf keinen Fall/i, () => {
      $("#survey_form").append(
        '<input type="hidden"name="response_yn"value="no"/>'
      );

      s.say("Alles klar.");
      s.say("Auf Wiedersehen!");
      s.pause(1000);
      s.ready(() => {
        s.run("survey_subscript");
      });
    });

    ss.unknown(function () {
      s.say(
        "Entschuldigung, ich verstehe nicht. Sie k??nnen 'ja' oder 'nein' sagen, um die Daten zu l??schen, die ich aus unserer Interaktion gesammelt habe."
      );
    });

    $("#hint").html(
      "Aufgabe: Sie haben die m??glichkeit ihre Daten speichern zu lassen. Geben Sie <b>'Ja'</b> ein, wenn Sie das wollen, oder <b>'Nein'</b>, wenn Sie ihre Daten nicht speichern lassen wollen."
    );
  });

  s.sub("control", (ss) => {
    ss.begin(() => {
      s.set("voice", "Mary");
      s.say(
        "Soll ich die angegebenen Daten f??r die n??chste Berechnung speichern?"
      );
    });

    ss.match(/ja|jo|sicher|jaup|ok/i, () => {
      $("#survey_form").append(
        '<input type="hidden" name="response_yn" value="yes" />'
      );

      s.say("Wird gemacht.");
      s.say("Auf Wiedersehen");
      s.pause(1000);
      s.ready(() => {
        s.run("survey_subscript");
      });
    });

    ss.match(/ne|nein|nicht speichern/i, () => {
      $("#survey_form").append(
        '<input type="hidden" name="response_yn" value="no" />'
      );

      s.say("In Ordnung.");
      s.say("Auf Wiedersehen");
      s.pause(1000);
      s.ready(() => {
        s.run("survey_subscript");
      });
    });

    ss.unknown(function () {
      s.say(
        "Sagen Sie einfach 'Ja', wenn ich die Daten f??r die n??chste Berechnung speichern soll."
      );
    });

    $("#hint").html(
      "Aufgabe: Sie haben an dieser Stelle die M??glichkeit ihre Daten l??schen zu lassen um ihre Privatsph??re zu sch??tzen. Geben Sie <b>'Ja'</b> ein, wenn Sie das w??nschen, oder <b>'Nein'</b>, wenn Sie nicht wollen, dass ihre Daten gel??scht werden."
    );
  });

  s.sub("survey_subscript", (ss) => {
    ss.begin(() => {
      s.survey("survey");
    });
  });
});

cbl.survey("survey", (s) => {
  s.section("Aufmerksamkeitstest");

  s.select(
    "n_attention",
    "Geben Sie das Wort <b>orange</b> in das Textfeld unten ein. \n Welches Wort wurden Sie gebeten einzugeben?",
    [
      ["none", "keines"],
      ["brown", "braun"],
      ["blue", "blau"],
      ["orange", "orange"],
    ],
    { desc_width: "70%" }
  );

  s.section(
    "<br /><br />Bitte geben Sie an, wie stark Sie den folgenden Aussagen zustimmen oder nicht zustimmen:"
  );



  s.likert_scale(
    [
      ["q_COMMIT2", "Ich w??rde diesen Chatbot anderen Leuten empfehlen."],
      [
        "q_COMMIT3",
        "Falls jemand diesen Chatbot kritisieren sollte, w??rde ich auf die positiven Aspekte dieses Chatbots hinweisen wollen.",
      ],
      [
        "q_COMMIT5",
        "Selbst wenn neue Online-Alternativen auftauchen, w??rde ich diesen Chatbot weiterhin nutzen.",
      ],
    ],
    {
      points: 7,
      agree: "Ich stimme voll zu",
      disagree: "Ich stimme ??berhaupt nicht zu",
    }
  );

  s.section("<br /><br />Fragen zu Ihrer Person:");

  s.select(
    "n_gender",
    "Welches Geschlecht haben Sie?",
    [
      ["male", "M??nnlich"],
      ["female", "Weiblich"],
      ["diverse", "Divers"],
      ["other", "Keine Angabe"],
    ],
    { desc_width: "70%" }
  );

  s.input_range("n_age", "Alter", 0, 199, { desc_width: "70%" });

  s.select("n_language", "Sind Sie Deutschmuttersprachler?", [
    ["yes", "Ja"],
    ["no", "Nein"],
  ]),
    { desc_width: "70%" };

  s.select(
    "n_usage",
    "Wie h??ufig nutzen Sie Chatbots?",
    [
      ["no", "??berhaupt nicht"],
      ["seldom", "Weniger als einmal im Monat"],
      ["often", "2-4 Mal im Monat"],
      ["frequent", "Mehr als einmal die Woche"],
    ],
    { desc_width: "70%" }
  );
});

cbl.completed(e => {

	e.html("<p>Thank you for completing the survey, please email the "+
		"following JSON to the experiment leader:</p><br/>" +
		"<pre>" + cbl.survey_results_json("survey")) + "</pre>" +
    "<a href='/post'> Send results</a>";


  


});


cbl.start("datev-backup");
