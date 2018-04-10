 /*
  Template Name: Paonid
  Version: v3.1.1
  Author: Allies Interactive
  Website: http://www.diziana.com/
  Corporate Website : http://www.diziana.com
  Contact: support@diziana.com
  Follow: https://www.twitter.com/dizianaEngage
  Like: https://www.facebook.com/diziana.engage
  Purchase: Diziana.com
  License: You must have a valid license purchased only from
  diziana.com in order to legally use the theme for your project.
  Copyright: © 2017 Allies Interactive Services Pvt. Ltd. All Rights Reserved
*/

window.onload = function() {
  //For background in IPAD and IPHONE
  'use strict';
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    $('header, section , div').addClass('b-scroll');
  }
}

/*
  * jQuery v1.9.1 included
  */

$(document).ready(function() {

  // social share popups
  $(".share a").click(function(e) {
    e.preventDefault();
    window.open(this.href, "", "height = 500, width = 500");
  });

  // show form controls when the textarea receives focus or backbutton is used and value exists
  var $commentContainerTextarea = $(".comment-container textarea"),
  $commentContainerFormControls = $(".comment-form-controls, .comment-ccs");

  $commentContainerTextarea.one("focus", function() {
    $commentContainerFormControls.show();
  });

  if ($commentContainerTextarea.val() !== "") {
    $commentContainerFormControls.show();
  }

  // Expand Request comment form when Add to conversation is clicked
  var $showRequestCommentContainerTrigger = $(".request-container .comment-container .comment-show-container"),
    $requestCommentFields = $(".request-container .comment-container .comment-fields"),
    $requestCommentSubmit = $(".request-container .comment-container .request-submit-comment");

  $showRequestCommentContainerTrigger.on("click", function() {
    $showRequestCommentContainerTrigger.hide();
    $requestCommentFields.show();
    $requestCommentSubmit.show();
    $commentContainerTextarea.focus();
  });

  // Mark as solved button
  var $requestMarkAsSolvedButton = $(".request-container .mark-as-solved:not([data-disabled])"),
    $requestMarkAsSolvedCheckbox = $(".request-container .comment-container input[type=checkbox]"),
    $requestCommentSubmitButton = $(".request-container .comment-container input[type=submit]");

  $requestMarkAsSolvedButton.on("click", function () {
    $requestMarkAsSolvedCheckbox.attr("checked", true);
    $requestCommentSubmitButton.prop("disabled", true);
    $(this).attr("data-disabled", true).closest("form").submit();
  });

  // Change Mark as solved text according to whether comment is filled
  var $requestCommentTextarea = $(".request-container .comment-container textarea");

  $requestCommentTextarea.on("keyup", function() {
    if ($requestCommentTextarea.val() !== "") {
      $requestMarkAsSolvedButton.text($requestMarkAsSolvedButton.data("solve-and-submit-translation"));
      $requestCommentSubmitButton.prop("disabled", false);
    } else {
      $requestMarkAsSolvedButton.text($requestMarkAsSolvedButton.data("solve-translation"));
      $requestCommentSubmitButton.prop("disabled", true);
    }
  });

  // Disable submit button if textarea is empty
  if ($requestCommentTextarea.val() === "") {
    $requestCommentSubmitButton.prop("disabled", true);
  }

  // Submit requests filter form in the request list page
  $("#request-status-select, #request-organization-select")
    .on("change", function() {
      search();
    });

  // Submit requests filter form in the request list page
  $("#quick-search").on("keypress", function(e) {
    if (e.which === 13) {
      search();
    }
  });

  function search() {
    window.location.search = $.param({
      query: $("#quick-search").val(),
      status: $("#request-status-select").val(),
      organization_id: $("#request-organization-select").val()
    });
  }

  $(".header .icon-menu").on("click", function(e) {
    e.stopPropagation();
    var menu = document.getElementById("user-nav");
    var isExpanded = menu.getAttribute("aria-expanded") === "true";
    menu.setAttribute("aria-expanded", !isExpanded);
  });

  if ($("#user-nav").children().length === 0) {
    $(".header .icon-menu").hide();
  }

  // Submit organization form in the request page
  $("#request-organization select").on("change", function() {
    this.form.submit();
  });

  // Toggles expanded aria to collapsible elements
  $(".collapsible-nav, .collapsible-sidebar").on("click", function(e) {
    e.stopPropagation();
    var isExpanded = this.getAttribute("aria-expanded") === "true";
    this.setAttribute("aria-expanded", !isExpanded);
  });

  $('.section-tree-title').click(function(e){
    $(this).next().slideToggle(250);
    $(this).find('.open').toggle();
    $(this).find('.close').toggle();
  });

  //Knowledge base block toggle function
  $('.collapse-block__heading').click(function(e){
    e.preventDefault();
    $(this).next().slideToggle(250);
    $(this).find('.collapse-block__state-open').toggle();
    $(this).find('.collapse-block__state-close').toggle();
  });

  // Wrap table-responsive class around table in article body content
  $('.article-body').find('table').addClass('table')
  .wrap('<div class="table-responsive"></div>');

  // Set year for copyright in footer
  var x = new Date();
  var y = x.getFullYear();
  $('#year').html(y);

  // Ajax call to get categories and sections
  function getData(count, callback, param){
    var count = count ? count : 100;
    return $.ajax({
      url: '/api/v2/help_center/en-us/categories.json?per_page='+
      count + param,
      type: 'GET',
      dataType: 'json',
      success: callback
    });
  };

  // Function to structure date
  function structureData(cb){

    $.when( getData() ).then(function(data){
      var tmpCategories    = [];

      tmpCategories = _.sortBy( data.categories, 'position' );

      cb(tmpCategories);
    });
  };

  // Function to create html
  function createHtml(cb) {
    var navigationHtml = '';
    structureData(function(tmpCategories){
      $.each(tmpCategories, function(idx, itm){
        navigationHtml += categorySidebarTemplate
                            .replace('CAT-ID', itm.id)
                            .replace('CAT-URL', itm.html_url)
                            .replace('CAT-TITLE', itm.name)
                            .replace('CAT-NAME', itm.name);
      });

      cb(navigationHtml);
    });
  }

  // Append html in DOM
  function domQuery(el) {

    var localCachedMenu = localStorage.getItem('navigation-menu'),
        localCachedUserRole = localStorage.getItem('userrole');

    if ( (localCachedMenu)
        && (HelpCenter.user.role == localCachedUserRole) ) {
      $(el).html(localCachedMenu);
    };

    createHtml(function(html){
      if ( (!localCachedMenu)
          || (HelpCenter.user.role != localCachedUserRole) ) {
        $(el).html(html);
      };

      localStorage.setItem('userrole', HelpCenter.user.role);
      localStorage.setItem('navigation-menu', html);
    });
  }

  // Add category sidebar
  var categorySidebarTemplate = "<li class='CAT-ID'><a href='CAT-URL' title='CAT-TITLE'>CAT-NAME</a></li>";
  if ( _templateName == 'categories'
      || _templateName == 'sections'
      || _templateName == 'articles' ) {
    domQuery('.hc-category-list');
    $('.'+catID).find('a').addClass('active');
  }

});
