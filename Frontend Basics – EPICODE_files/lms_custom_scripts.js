function get_quiz_results(user_id, quiz_id, quiz_post_id, course_id, th) {
  let wrap = th.find(".learndash");

  if (th.find(".wpProQuiz_points").length) {
    wrap = th.find(".wpProQuiz_points");
  }
  let last = th.is(":last-child"),
    passingPercent = parseInt(
      th.find("[data-passingpercent]").attr("data-passingpercent")
    );

  th.find(".quiz_continue_link").hide();

  jQuery.ajax({
    type: "POST",
    url: ajax_object_lmscs.ajaxurl,
    data: {
      action: "check_user_progress",
      srctsecurity: ajax_object_lmscs.srct_security,
      user_id: user_id,
      quiz_id: quiz_post_id,
      course_id: course_id,
    },
    success: function (output) {
      let data = JSON.parse(output);
      var gtutor = $("#content_tiketing").data("gtutor");

      if (Object.keys(data).length > 0) {
        let lastKey = Object.keys(data)[Object.keys(data).length - 1],
          percent = data[lastKey]["percentage"];
        if (percent >= passingPercent) {
          if (last) {
            if (gtutor == "always") {
              wrap.after(
                '<div class="btn-center"><a href="" class="btn-dark contact_teacher always-contact">Contatta il tutor</a></div>'
              );
            }

            wrap.after(
              '<div class="btn-center joinclass-container">' +
                '<p class="p-visible">Ora puoi entrare in classe </p>' +
                '<button onclick="vaiPrecedente()" type="button" class="btn btn-dark sw-btn-next precedente-solo-button">Precedente</button><a target="_blank" href="' +
                joinClassURL +
                '" class="btn-dark joinclass">' +
                joinClassText +
                "</a>" +
                "</div>"
            );

            $(".wpProQuiz_text").hide();
          } else {
            attempt = 0;

            //wrap.after('<div class="btn-center"><button type="button" class="btn btn-dark sw-btn-prev">Precedente</button><button type="button" class="btn btn-dark sw-btn-next">Successivo</button></div>');

            if (gtutor == "always") {
              wrap.after(
                '<div class="btn-center"><button type="button" class="btn btn-dark sw-btn-next success_btn successivo-button">Successivo</button></div>'
              );
              wrap.after(
                '<div class="btn-center"><a href="" class="btn-dark contact_teacher always-contact">Contatta il tutor</a></div>'
              );
            } else {
              wrap.after(
                '<div class="btn-center"><button type="button" class="btn btn-dark sw-btn-next success_btn successivo-button">Successivo</button></div>'
              );
            }

            $(".wpProQuiz_text").hide();
          }
        } else {
          // alert("user: " + user_id);
          // alert("course: " + course_id);
          // alert("quiz: " + quiz_post_id);
          errori =
            parseInt(data[lastKey]["count"]) - parseInt(data[lastKey]["score"]);
          errori = errori + "-" + data[lastKey]["count"];
          // alert("errori: " + errori);

          var gtutor = $("#content_tiketing").data("gtutor");
          /* if(gtutor == 'always'){
					  wrap.after('<div class="btn-center"><a href="" class="btn-dark contact_teacher always-contact" attrib-errori="' + errori + '">Contatta il tutor</a></div>');
					}else */
          if (gtutor == "si" || gtutor == "always") {
            wrap.after(
              '<div class="btn-center second-attempt"><p>Il quiz è già stato fatto,<br> non sono rimasti più tentativi</p><a href="" class="btn-dark contact_teacher" attrib-errori="' +
                errori +
                '">Contatta il tutor</a></div>'
            );
          }

          if (last && gtutor != "si") {
            wrap.after(
              '<div class="btn-center second-attempt"><button onclick="vaiPrecedente()" type="button" class="btn btn-dark sw-btn-next precedente-solo-button">Precedente</button><a target="_blank" href="' +
                joinClassURL +
                '" class="btn-dark joinclass">' +
                joinClassText +
                "</a></div>"
            );
          }

          if (!last && gtutor == "no") {
            wrap.after(
              '<div class="btn-center second-attempt"><button type="button" class="btn btn-dark sw-btn-next success_btn successivo-button" attrib-errori="' +
                errori +
                '">Successivo</button></div>'
            );
          }

          if (attempt == 0) {
            jQuery(".logica-avanzamento").hide();
            jQuery(".second-attempt").hide();
            jQuery(".wpProQuiz_button_reShowQuestion").hide();

            var elements = document.getElementsByClassName(
              "messaggio-primo-tentativo-fallito"
            );
            for (var i = 0; i < elements.length; i++) {
              elements[i].style.display = "block";
            }

            var elements = document.getElementsByClassName(
              "messaggio-secondo-tentativo-fallito"
            );
            for (var i = 0; i < elements.length; i++) {
              elements[i].style.display = "none";
            }
            jQuery(".wpProQuiz_button_restartQuiz").show();
          } else if (attempt > 0) {
            jQuery(".logica-avanzamento").hide();
            jQuery(".wpProQuiz_button_reShowQuestion").show();
            jQuery(".second-attempt").show();

            var elements = document.getElementsByClassName(
              "messaggio-primo-tentativo-fallito"
            );
            for (var i = 0; i < elements.length; i++) {
              elements[i].style.display = "none";
            }

            var elements = document.getElementsByClassName(
              "messaggio-secondo-tentativo-fallito"
            );
            for (var i = 0; i < elements.length; i++) {
              elements[i].style.display = "block";
            }

            jQuery(".wpProQuiz_button_restartQuiz").hide();

            if (last) {
              if (gtutor != "always") {
                wrap.after(
                  '<div class="btn-center joinclass-container hide">' +
                    '<p class="p-visible">Ora puoi entrare in classe </p>' +
                    '<button onclick="vaiPrecedente()" type="button" class="btn btn-dark sw-btn-next precedente-solo-button">Precedente</button><a target="_blank" href="' +
                    joinClassURL +
                    '" class="btn-dark joinclass">' +
                    joinClassText +
                    "</a>" +
                    "</div>"
                );
              }
            } else {
              if (gtutor == "always") {
                wrap.after(
                  '<div class="btn-center second-attempt"><button type="button" class="btn btn-dark sw-btn-next success_btn successivo-button" attrib-errori="' +
                    errori +
                    '">Successivo</button></div>'
                );
              }
            }
          }
        }
      }
    },
  });
}

function vaiPrecedente() {
  var tab_attuale_tag = $("a.nav-link.active").attr("href");
  var tab_attuale = tab_attuale_tag.substr(tab_attuale_tag.indexOf("-") + 1);
  var n_tab = parseInt(tab_attuale);

  var ulr_completo = window.location.href;

  var url = ulr_completo.substr(0, ulr_completo.indexOf("#"));
  var successiva = n_tab - 1;
  window.location.href = url + "#step-" + successiva;
  location.reload(true);
}

function contact_teacher(
  user_id,
  quiz_post_id,
  course_id,
  module_id,
  topic_id,
  errori,
  th
) {
  let last = th.is(":last-child");
  jQuery.ajax({
    type: "POST",
    url: ajax_object_lmscs.ajaxurl,
    data: {
      action: "contact_tutor",
      srctsecurity: ajax_object_lmscs.srct_security,
      user_id: user_id,
      quiz_id: quiz_post_id,
      course_id: course_id,
      module_id: module_id,
      topic_id: topic_id,
      errori: errori,
    },
    success: function (output) {
      let data = JSON.parse(output);
      //console.log(data)

      let arrData = data.split("/");
      let items = arrData.length;

      let server = arrData[items - 2];
      let channel = arrData[items - 1];

      /*
			$('body').append('<div class="popup-widgetbot"><widgetbot' +
			  '            server="' + server + '"' +
			  '            channel="' + channel + '"' +
			  '    ></widgetbot><span class="close-widgetbot close_widgetbot"></span></div>' +
			  '<script src="https://cdn.jsdelivr.net/npm/@widgetbot/html-embed"></script>')
			*/

      //$('.contact_teacher').hide();
      th.find(".contact_teacher").hide(); // nascondo solo il bottone ceh è stato cliccato
      if (last) {
        $(".joinclass-container").removeClass("hide");
      }

      Swal.fire({
        title: "Richiesta di supporto",
        icon: "info",
        html: "La tua richiesta è stata inoltrata!",
        showCloseButton: true,
      });
      // alert('La tua richiesta è stata inoltrata!')
    },
  });
}

/* STEPPER Check Quiz Button */
function checkQuizButton() {
  var currentStep = $(
    "body.single-sfwd-topic .block-block-video-quiz-stepper li.smartwizard-item .nav-link.active"
  ).attr("href");
  var currentTab = $(currentStep);
  var iframe = currentTab.find("iframe");
  var player = new Vimeo.Player(iframe);
  var isCurrentQuizTaken = currentTab.find(".quiz-taken").length;
  var currentQuiz = currentTab.find(".wpProQuiz_quiz");
  var startQuizButton = currentTab.find(".wpProQuiz_text");
  if (!isCurrentQuizTaken) {
    player.on("ended", function () {
      startQuizButton.css("display", "block");
    });

    player.on("timeupdate", function (data) {
      if (data.percent >= 0.95) {
        startQuizButton.css("display", "block");
      }
    });

    setTimeout(function () {
      if (
        $(".successivo-button").is(":visible") ||
        $(".contact_teacher").is(":visible") ||
        currentQuiz.is(":visible") ||
        $(".joinclass-container").is(":visible")
      ) {
        // do nothing
      } else {
        startQuizButton.css("display", "block");
      }
      // TEMPORIZZATORE
    }, 1000);
  } else {
    startQuizButton.css("display", "block");
  }
}
/* END STEPPER Check Quiz Button */

function controllaTabs() {
  selElements = $(".nav-link.inactive.active").length;

  if (selElements > 1) {
    elem = $(".nav-link.inactive.active").first();
    href = $(elem).attr("href");

    $(elem).removeClass("active");
    $(elem).addClass("done");
    $(href).css("display", "none");

    clearInterval(intervalTabs);
  }
}

jQuery(document).ready(function ($) {
  intervalTabs = setInterval(controllaTabs, 2000);
  //Remove inside stepper from quiz list
  $(".lms-quiz-list").parent().find(".quiz_inside_stepper").remove();
  $(".lms-course-quizzes-list .lms-course-quizzes-heading").remove();

  //-----Stepper--------
  $(document).on("click", ".close_widgetbot", function () {
    $(this).parents(".popup-widgetbot").remove();
  });

  if ($(".smartwizard").length) {
    $(".smartwizard").smartWizard({
      enableURLhash: true,
      toolbarSettings: {
        showNextButton: false,
        showPreviousButton: false,
      },
    });

    var gtutor = $("#content_tiketing").data("gtutor");

    $(".smartwizard .tab-pane").each(function () {
      var th = $(this);
      th.find(
        '.wpProQuiz_list .wpProQuiz_listItem:last-child .wpProQuiz_button[name="next"]'
      ).wrap('<span class="check_user_quiz_wrap" />');
      th.find(".check_user_quiz_wrap").append(
        '<span class="check_user_quiz"></span>'
      );

      th.find('.wpProQuiz_button[name="startQuiz"]')
        .parent("div")
        .prepend("<p>Hai finito di guardare il video?</p>");

      let last = th.is(":last-child");

      if (th.find(".remove_on_start_quiz").length) {
        th.find(".wpProQuiz_text").prepend(th.find(".remove_on_start_quiz"));
        th.find(".remove_on_start_quiz").removeClass("remove_on_start_quiz");
      }

      /* if (last) {
			  if(gtutor != 'always' && gtutor != 'si' ){
				  if (th.find('.remove_if_last_tab').length) {
					  console.log('appendo entra in classe ultimo tab');
				  th.find('.remove_if_last_tab').html('<p class="p-visible">Ora puoi entrare in classe</p><button onclick="vaiPrecedente()" type="button" class="btn btn-dark sw-btn-next precedente-solo-button">Precedente</button><a target="_blank" href="'+joinClassURL+'" class="btn-dark joinclass">'+joinClassText+'</a>');
			  	
				  }
			  }
			} */
    });

    $(document).on("click", ".contact_teacher", function (e) {
      e.preventDefault();
      let th = $(this).parents(".tab-pane"),
        user_id = th.attr("data-user_id"),
        quiz_post_id = th.attr("data-quiz_post_id"),
        course_id = th.attr("data-course_id"),
        errori = $(this).attr("attrib-errori");

      var gtutor = $("#content_tiketing").data("gtutor");

      let last = th.is(":last-child");

      // Visualizza modale per conferma richiesta supporto tutor
      Swal.fire({
        title: "Confermi la richiesta di supporto?",
        showCancelButton: false,
        confirmButtonText: "Conferma",
        cancelButtonText: "Chiudi senza confermare",
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          contact_teacher(
            user_id,
            quiz_post_id,
            course_id,
            moduleID,
            topicID,
            errori,
            th
          );

          if (last) {
            if (gtutor == "always") {
              $(this).after(
                '<div class="btn-center"><a href="" class="btn-dark contact_teacher always-contact" >Contatta il tutor</a></div>'
              );
            }
          } else {
            if (gtutor == "always") {
              $(this).after(
                '<div class="btn-center"><a href="" class="btn-dark contact_teacher always-contact" >Contatta il tutor</a></div>'
              );
              //$(this).after('<div class="btn-center"><button type="button" class="btn btn-dark sw-btn-next success_btn successivo-button">Successivo</button></div>');
            } else {
              $(this).after(
                '<div class="btn-center second-attempt"><button type="button" class="btn btn-dark sw-btn-next success_btn successivo-button">Successivo</button></div>'
              );
            }

            //$(this).after('<div class="btn-center"><button type="button" class="btn btn-dark sw-btn-prev">Precedente</button><button type="button" class="btn btn-dark sw-btn-next">Successivo</button></div>');
          }
        }
      });

      // contact_teacher(user_id, quiz_post_id, course_id, errori);
      attempt = 0;
    });

    $(document).on("click", ".success_btn", function () {
      attempt = 0;
      var elements = document.getElementsByClassName(
        "messaggio-primo-tentativo-fallito"
      );
      for (var i = 0; i < elements.length; i++) {
        elements[i].style.display = "none";
      }

      var elements = document.getElementsByClassName(
        "messaggio-secondo-tentativo-fallito"
      );
      for (var i = 0; i < elements.length; i++) {
        elements[i].style.display = "none";
      }

      $(".smartwizard").smartWizard("next");
    });
  }

  jQuery(document).on("click", ".check_user_quiz", function (e) {
    let th = $(this).parents(".tab-pane");
    let user_id = th.attr("data-user_id"),
      quiz_id = 0,
      quiz_post_id = th.attr("data-quiz_post_id"),
      course_id = th.attr("data-course_id");

    $(this).parents(".check_user_quiz_wrap").find(".wpProQuiz_button").click();

    setTimeout(function () {
      get_quiz_results(user_id, quiz_id, quiz_post_id, course_id, th);

      if (
        $(".successivo-button").is(":visible") ||
        $(".contact_teacher").is(":visible")
      ) {
        $(".wpProQuiz_text").hide();
      }
    }, 2000);
  });

  // var intervalQuiz = setInterval(function(){
  //
  // 	if($(".wpProQuiz_points").is(":visible")){
  // 		if($(".wpProQuiz_points").text().indexOf("100%") !== -1){
  // 			if($(".stepsuccessivo").is(":visible")){
  // 			} else {
  // 				$(".quiz_continue_link").hide();
  // 				$(".wpProQuiz_points").after('<input type="button" class="btn btn-primary stepsuccessivo" value="Successivo">');
  // 			}
  // 		} else {
  // 			$(".wpProQuiz_points").after('<input type="button" class="btn btn-primary" value="Contatta il tutor">');
  // 			clearInterval(intervalQuiz);
  // 		}
  // 	}
  // }, 1000);

  //-----Stepper End--------

  //Edit Evaluation table columns
  $("button.edit_evalnote").click(function (event) {
    //event.preventDefault();
    var current_edit_ID = $(this).parents("tr").find("td");
    $(current_edit_ID).find("#update_evaluationval").show();
    $(current_edit_ID).find(".update_notes").show();
  });

  //Update Coaching table project evaluation
  $("button.update_evalnote").click(function (event) {
    //event.preventDefault();
    var current_update_ID = $(this).parents("tr").find("td");
    var evaluation_val = $(current_update_ID)
      .find("#update_evaluationval")
      .val();
    var notes_val = $(current_update_ID).find("textarea.update_notes").val();
    var post_id = $(this).data("cpostid");
    var row_id = $(this).data("rowid");

    $.ajax({
      type: "POST",
      url: ajax_object_lmscs.ajaxurl,
      data: {
        action: "update_coaching_table_data",
        srctsecurity: ajax_object_lmscs.srct_security,
        post_id: post_id,
        row_id: row_id,
        eval: evaluation_val,
        notes: notes_val,
      },
      success: function (response) {
        var jsonData = JSON.parse(response);
        //console.log(jsonData.eval_data);
        //console.log(jsonData.notes_data);

        $(current_update_ID).find(".teval_ud span").text(jsonData.eval_data);
        $(current_update_ID).find(".notes_ud span").text(jsonData.notes_data);
        $(current_update_ID).find("#update_evaluationval").hide();
        $(current_update_ID).find(".update_notes").hide();

        window.location.reload();
      },
    });
  });

  // edit url project table topic lesson
  $("button.edit_urlproject").click(function (event) {
    //event.preventDefault();
    var current_edit_ID = $(this).parents("tr").find("td");
    $(current_edit_ID).find("button.update_url").show();
    $(current_edit_ID).find("button.edit_urlproject").hide();
    $(current_edit_ID).find(".update_projecturl").show();
  });

  //Update Project URL table for student
  $("button.update_url").click(function (event) {
    //event.preventDefault();
    var current_update_ID = $(this).parents("tr").find("td");
    //var evaluation_val = $(current_update_ID).find('#update_evaluationval').val();
    var update_projecturl_val = $(current_update_ID)
      .find("input.update_projecturl")
      .val();
    var post_id = $(this).data("cpostid");
    var row_id = $(this).data("rowid");

    $.ajax({
      type: "POST",
      url: ajax_object_lmscs.ajaxurl,
      data: {
        action: "update_projecturl_table_data",
        srctsecurity: ajax_object_lmscs.srct_security,
        post_id: post_id,
        row_id: row_id,
        url: update_projecturl_val,
      },
      success: function (response) {
        var jsonData = JSON.parse(response);
        //console.log(jsonData.url_update);

        //$(current_update_ID).find('.teval_ud span').text(jsonData.eval_data);
        $(current_update_ID).find("button.update_url").hide();
        $(current_update_ID).find("button.edit_urlproject").show();
        $(current_update_ID).find(".update_projecturl").hide();
        $(current_update_ID)
          .find("span.no-link")
          .replaceWith(
            '<a class="btn-dark" href="' +
              jsonData.url_data +
              '" target="_blank">Progetto</a>'
          );

        //window.location.reload();
      },
    });
  });

  //Course tabs load calendar
  $(".ld-tabs-navigation .ld-tab ").on("click", function () {
    var calendarEl = document.getElementById("calendar");
    calendar = new FullCalendar.Calendar(calendarEl, {
      locale: "en",
      themeSystem: "standard",
      expandRows: true,
      //noEventsText: 'There are no lessons and topics to view',
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
      },
      initialView: "dayGridMonth",
      weekNumbers: false,
      navLinks: true, // can click day/week names to navigate views
      editable: false,
      selectable: false,
      nowIndicator: true,
      dayMaxEvents: false, // allow "more" link when too many events
      events: lessonsArr,
    });
    setTimeout(function () {
      calendar.render();
      //calendar.setOption('locale','it');
    }, 500);
  });

  //Evaluation
  $(".rating_selection span")
    .on("mouseover", function () {
      var onStar = $(this).data("rating");

      $(this)
        .parent()
        .children("span")
        .each(function (e) {
          if (e < onStar) {
            $(this).removeClass("bb-icon-l").addClass("bb-icon-f");
          } else {
            $(this).removeClass("bb-icon-f").addClass("bb-icon-l");
          }
        });
    })
    .on("mouseout", function () {
      $(this)
        .parent()
        .children("span")
        .each(function (e) {
          $(this).removeClass("bb-icon-star-fill");
        });
    });

  $(".rating_selection span").click(function (e) {
    var ratingval = $(this).data("rating");
    var stars = $(this).parent().children("span");
    $(this).parent().find("input").val(ratingval);

    for (i = 0; i < stars.length; i++) {
      $(stars[i]).removeClass("selected");
    }
    for (i = 0; i < ratingval; i++) {
      $(stars[i]).addClass("selected");
    }
  });

  //Save Coaching table project evaluation
  $("button#save_evaluation").click(function (event) {
    event.preventDefault();
    var eval_obj_arr = {};

    $(".rating_selection .rating-value").each(function (index) {
      var data_obj = {};
      var etype = $(this).data("etype");
      var u_id = $(this).data("uid");
      var rtval = $(this).val();
      if (rtval !== "0") {
        data_obj["etype"] = etype;
        data_obj["uid"] = u_id;
        data_obj["rtval"] = rtval;

        eval_obj_arr[index] = data_obj;
      }
    });

    var studentID = $("input[name=studentID]").val();
    var courseID = $("input[name=courseID]").val();
    var courseName = $("input[name=courseName]").val();
    var lessonID = $("input[name=lessonID]").val();
    var lessonName = $("input[name=lessonName]").val();
    //Popup Text
    var ptitle = $(this).data("ptitle");
    var ptext = $(this).data("ptext");
    var pconfbtn = $(this).data("pconfbtn");
    var pcabtn = $(this).data("pcabtn");

    Swal.fire({
      title: ptitle,
      text: ptext,
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff2751",
      cancelButtonColor: "#f00",
      confirmButtonText: pconfbtn,
      cancelButtonText: pcabtn,
      closeOnConfirm: false,
      closeOnCancel: false,
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          type: "POST",
          url: ajax_object_lmscs.ajaxurl,
          data: {
            action: "evaluation_by_student",
            srctsecurity: ajax_object_lmscs.srct_security,
            studentID: studentID,
            courseID: courseID,
            courseName: courseName,
            lessonID: lessonID,
            lessonName: lessonName,
            contentEval: eval_obj_arr,
          },
          success: function (response) {
            var jsonData = JSON.parse(response);
            //console.log(jsonData);
            window.location.reload();
          },
        });
      }
    });
  });

  /* STEPPER CHECK QUIZ BUTTON */
  checkQuizButton();
  var stepperLinks = $(
    "body.single-sfwd-topic .block-block-video-quiz-stepper .nav-link"
  );
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.attributeName === "class") {
        checkQuizButton();
      }
    });
  });
  stepperLinks.each(function (index) {
    observer.observe(stepperLinks[index], {
      attributes: true,
    });
  });
  /* END STEPPER QUIZ BUTTON */
});
