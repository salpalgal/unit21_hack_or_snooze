"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;


 
/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story,showDeleteButton=false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  // console.log(story.storyId)
  // console.log(story.url)
  // console.log(story.title)
  // console.log(story.author)
  const showStar = Boolean(currentUser)
  return $(`
      <li id="${story.storyId}">
        ${makeStarHtml(story,currentUser)}
        ${showDeleteButton?makeDeleteButton():""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}


/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();
 

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}
async function deleteStory(evt) {
  console.debug("deleteStory");

  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");

  await storyList.removeStory(currentUser, storyId);

  // re-generate story list
  await putOwnStoriesOnPage();
  
}

$myStories.on("click", ".trash-can", deleteStory)

async function postFormData(evt){
  console.debug("postFormData")
  evt.preventDefault()

  const title = document.getElementById("title").value
  const author = document.querySelector("#author").value
  const url = document.querySelector("#url").value
  const username = currentUser.username
  const formObj = {title,author,url,username}
  const story = await storyList.addStory(currentUser, formObj)
  
 
  const $story = generateStoryMarkup(story);

  
  $allStoriesList.prepend($story);
 

 

}
$("#story").on("submit", postFormData)
function makeDeleteButton(){
  return `
      <span class="trash-can">
        <i class="fas fa-trash-alt"></i>
      </span>`;

}

function makeStarHtml(story,user){
  const isFav =user.isFavourite(story)
  const status = isFav? "fas" :"far"
  return `
  <span class="star">
    <i class="${status} fa-star"></i>
  </span>`;
}

async function toggleStoryFavorite(evt) {
  console.debug("toggleStoryFavorite",evt);

  const $tgt = $(evt.target);
  const $closestLi = $tgt.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  // see if the item is already favorited (checking by presence of star)
  if ($tgt.hasClass("fas")) {
    // currently a favorite: remove from user's fav list and change star
    await currentUser.removeFav(story);
    $tgt.closest("i").toggleClass("fas far");
    console.log("fas")
  } else {
    // currently not a favorite: do the opposite
    await currentUser.addFav(story);
    $tgt.closest("i").toggleClass("fas far");
    
  }
  
}

$storiesLists.on("click",".star", toggleStoryFavorite);

function putFavStoriesOnPage(){
  console.debug("putFavStoriesOnPage");
  $favStories.empty();
  if(currentUser.favorites){
    for(let story of currentUser.favorites){
      const $story = generateStoryMarkup(story);
      $favStories.append($story)
    }
  }if(currentUser.favorites.length===0){
    $favStories.append("<h5> No favorite story </h5>")
  }
  $favStories.show()
  
}

function putOwnStoriesOnPage(){
  console.debug("putOwnStoriesOnPage");
  $myStories.empty();
  if(currentUser.ownStories){
    
    for(let story of currentUser.ownStories){
      let $story = generateStoryMarkup(story,true);
      $myStories.append($story)
    }
  }if(currentUser.ownStories.length===0){
    $myStories.append("<h5> No stories by user </h5>")
  }
  $myStories.show()
}
