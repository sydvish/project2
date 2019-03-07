// These are global variables being set here so that we can use them in our URL
var allowedIngredient;
var allowedDiet;
var allowedAllergy;
var recipeSearch;
var queryURL;

// When this button is clicked-we take the data from front end, convert to variables, create a yummly url with variable
$("#recipeSearch").on("click", function(event) {
  // This prevents the submit button from refreshing the page when clicked
  event.preventDefault();
  findRecipes();
  pushSearch()
  getSearch();
});

function findRecipes() {
  //   The below code is part of the API search parameters. We can modify our search by looking for chicken recipes that are also gluten free-or modify the search for eggplant recipes that are vegan, etc. I have them commented out because I wasn't sure how to implement them currently
  recipeSearch = $("#mainIngredient")
    .val()
    .trim();
  allowedIngredient = $("#allowedIngredient")
    .val()
    .trim();
  allowedDiet = $("#diet")
    .find(":selected")
    .attr("value");
  allowedAllergy = $("#allergies")
    .find(":selected")
    .attr("value");

  // Here we construct our URL
  if (
    !$("#diet")
      .find(":selected")
      .attr("value") &&
    !$("#allergies")
      .find(":selected")
      .attr("value")
  ) {
    queryURL =
      "http://api.yummly.com/v1/api/recipes?_app_id=1f483524&_app_key=099b7a16023da9a9f8e9fd29763e0aa0&q=" +
      recipeSearch +
      "&maxResult=5&allowedIngredient[]=" +
      allowedIngredient;
  } else if (
    $("#diet")
      .find(":selected")
      .attr("value") &&
    $("#allergies")
      .find(":selected")
      .attr("value")
  ) {
    queryURL =
      "http://api.yummly.com/v1/api/recipes?_app_id=1f483524&_app_key=099b7a16023da9a9f8e9fd29763e0aa0&q=" +
      recipeSearch +
      "&maxResult=5&allowedIngredient[]=" +
      allowedIngredient +
      "&allowedDiet[]=" +
      allowedDiet +
      "&allowedAllergy[]=" +
      allowedAllergy;
  } else if (
    $("#diet")
      .find(":selected")
      .attr("value") &&
    !$("#allergies")
      .find(":selected")
      .attr("value")
  ) {
    queryURL =
      "http://api.yummly.com/v1/api/recipes?_app_id=1f483524&_app_key=099b7a16023da9a9f8e9fd29763e0aa0&q=" +
      recipeSearch +
      "&maxResult=5&allowedIngredient[]=" +
      allowedIngredient +
      "&allowedDiet[]=" +
      allowedDiet;
  } else if (
    !$("#diet")
      .find(":selected")
      .attr("value") &&
    $("#allergies")
      .find(":selected")
      .attr("value")
  ) {
    queryURL =
      "http://api.yummly.com/v1/api/recipes?_app_id=1f483524&_app_key=099b7a16023da9a9f8e9fd29763e0aa0&q=" +
      recipeSearch +
      "&maxResult=5&allowedIngredient[]=" +
      allowedIngredient +
      "&allowedAllergy[]=" +
      allowedAllergy;
  }
  // console.log(queryURL);
  // Here we send our ajax call to gather the recipes from our API
  $.ajax({
    url: queryURL,
    method: "GET"

    // Then we create a function to pull the matches from our response object/array(?)
  }).then(function(response) {
    // console.log(allowedDiet);
    // console.log(allowedAllergy);
    $("#searchResults").empty();
    // we create a variable of recipes which is equal to all of the info in the "matches" array
    const recipes = response.matches;

    // The forEach function loactes each element (in this case recipe) in the array
    recipes.forEach(function(recipe) {
      // Here we console.log all the recipes in the array and list them by name
      // console.log(recipe.recipeName);
      // console.log("https://www.yummly.com/recipe/" + recipe.id + "#directions");
      // console.log(recipe.imageUrlsBySize);

      // Change this to render the results in the UL on the index.handlebars page
      var newRecipe = $("<li>").append(
        $("<h5>")
          .text(recipe.recipeName)
          .attr("class", "w3-text-brown"),
        $("<img>").attr({
          src: recipe.imageUrlsBySize["90"],
          class: "w3-round-xlarge"
        }),
        $("<a>")
          .text("Recipe Instructions")
          .attr({
            href: "https://www.yummly.com/recipe/" + recipe.id + "#directions",
            target: "_blank",
            class: "w3-right"
          })
      );

      $("#searchResults").append(newRecipe);

      // $("#searchesResults").append(
      //   $("#recipeTitle").html(recipe.recipeName),
      //   $("#recipeURL").attr(
      //     "href",
      //     "https://www.yummly.com/recipe/" + recipe.id + "#directions"
      //   ),
      //   $("#recipeURL").html("Recipe Instructions"),
      //   $("#images").html(recipe.imageUrlsBySize)
      // );
    });
    // The code below is intended to take the response we get from the code above and append it to our HTML page, replacing our current image.
    $("#searches-div").toggle(false);
    $("#searchesResults").toggle(true);
  });
}

function pushSearch() {
  var search = {
    mainIngredient: recipeSearch,
    secondaryIngredient: allowedIngredient,
    diet: allowedDiet,
    allergy: allowedAllergy,
    yummlySearch: queryURL
  };
  $.post("/api/searches", search);
}
function getSearch() {
  $.get("api/searches", function(data) {
    console.log(data);

    data.forEach(function(searches) {
      var oldSearch = $("<li>").append(
        $("<h5>")
          .text(searches.mainIngredient)
          .attr("class", "w3-text-brown"),
        $("<h5>")
          .text(searches.secondaryIngredient)
          .attr("class", "w3-text-brown"),
        $("<button>")
          .text("See Search")
          .attr({
            href: searches.yummlySearch,
          })
      );
      $("#past-searches").append(oldSearch);

    });
    //   $("#addImage").toggle(false);
    //   $("#recipeArea").toggle(true);
  });
}
// These are buttons awaiting their function instructions
// This area/button will let the user post the recipe they want to add to our recipes database-

$("#recipeAdd").on("click", function(event) {
  // This prevents the submit button from refreshing the page when clicked
  event.preventDefault();

  // when the add recipe button is clicked we want to take the recipe info and add it to our mySql database
  var recipe = {
    title: $("#titleAdd")
      .val()
      .trim(),
    mainIngredient: $("#mainAdd")
      .val()
      .trim(),
    secondaryIngredient: $("#allowedAdd")
      .val()
      .trim(),
    allowedAllergy: $("#dietAdd")
      .find(":selected")
      .text(),
    allowedDiet: $("#allergiesAdd")
      .find(":selected")
      .text(),
    instructions: $("#instructions").val(),
    ingredients: $("#ingredients").val()
  };

  $.post("/api/recipes", recipe);

  $.get("api/recipes", function(data) {
    lastEntry = data.pop();

    var addedRecipe = $("<li>").append(
      $("<h3>")
        .text(lastEntry.title)
        .attr("class", "w3-text-brown"),
      $("<p>")
        .text(lastEntry.instructions)
        .attr("class", "w3-text-brown"),
      $("<p>")
        .text(lastEntry.ingredients)
        .attr("class", "w3-text-brown"),
      $("<p>")
        .text(lastEntry.allowedDiet)
        .attr("class", "w3-text-brown"),
      $("<p>")
        .text(lastEntry.allowedAllergy)
        .attr("class", "w3-text-brown")
    );

    $("#addResults").append(addedRecipe);

    $("#addImage").toggle(false);
    $("#recipeArea").toggle(true);
  });

  $("#titleAdd").val("");
  $("#mainAdd").val("");
  $("#allowedAdd").val("");
  $("#dietAdd").val("");
  $("#allergiesAdd").val("");
  $("#instructions").val("");
  $("#ingredients").val("");

  // lastEntry.forEach(function(result) {
  //   console.log(result.title);
  //   var addedRecipe = $("<li>").append(
  //     $("<h3>")
  //       .text(result.title)
  //       .attr("class", "w3-text-brown"),
  //     $("<p>").text(result.instructions).attr("class", "w3-text-brown"),
  //     $("<p>").text(result.ingredients).attr("class", "w3-text-brown")
  //   );

  //   $("#addResults").append(addedRecipe);

  //   $("#addImage").toggle(false);
  //   $("#recipeArea").toggle(true);
  // });
});
// });
