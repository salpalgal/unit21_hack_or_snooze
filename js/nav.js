"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */
function navSubmit(evt){
  console.debug("navSubmit", evt);
  document.querySelector("#story").style.display = "block"
  
}
$("#nav-submit").on("click", navSubmit)


/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

function navFavorite(evt){
  console.debug("navFavorite", evt);
  hidePageComponents();
  putFavStoriesOnPage();
  $favStories.show()
}

$body.on("click", "#nav-favorites", navFavorite);

function navOwnStories(evt){
  console.debug("navOwnStories",evt);
  hidePageComponents();
  putOwnStoriesOnPage();
  $myStories.show()
}

$body.on("click","#nav-myStories", navOwnStories)
/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
