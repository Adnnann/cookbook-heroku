import Recipe from "../models/recipe.model.js";
import dbErrorHandlers from "./helpers/dbErrorHandlers.js";
import _ from "lodash";
const createRecipe = (req, res) => {
  const recipe = new Recipe(req.body);
  recipe.save((err) => {
    if (req.body.ingredients.length === 0) {
      return res.send({ error: "Ingredients are required" });
    }

    if (err) {
      return res.send({ error: dbErrorHandlers.getErrorMessage(err) });
    }

    return res.send({ message: "Recipe successfuly created" });
  });
};
const getRecipes = (req, res) => {
  Recipe.find({}).exec((err, Recipes) => {
    if (err) {
      return res.send({ error: dbErrorHandlers.getErrorMessage(err) });
    }
    return res.send(Recipes);
  });
};

const getRecipe = (req, res) => {
  res.status(200).json(req.profile);
};
const updateRecipe = (req, res, next) => {
  let Recipe = req.profile;

  Recipe = _.extend(Recipe, req.body);

  //if user is not rating same produce for the first time push his rating in array
  //otherwise change his previous rating
  if (req.body.userRater) {
    if (Recipe.userRaters.includes(req.body.userRater)) {
      let index = Recipe.userRaters.indexOf(req.body.userRater);
      Recipe.userRatings[index] = req.body.userRating;
    } else {
      Recipe.userRaters.push(req.body.userRater);
      Recipe.userRatings.push(req.body.userRating);
    }

    let rating =
      Recipe.userRatings.reduce((prev, curr) => prev + curr) /
      Recipe.userRaters.length;

    if (rating.toFixed(2).includes(".50")) {
      Recipe.rating = rating.toFixed(2);
    } else {
      Recipe.rating = Math.round(rating);
    }

    //calculate rating - sum of all elements in userRatting arr divided by number of raters
    //Recipe.rating = Recipe.userRatings.reduce((prev, curr)=>prev+curr) / Recipe.userRaters.length
    Recipe.numberOfRaters = Recipe.userRaters.length;
    Recipe.ingredients = req.body.ingredients;
  }

  Recipe.updated = Date.now();
  Recipe.save((err) => {
    if (
      req.body.hasOwnProperty("ingredients") &&
      req.body.ingredients.length === 1 &&
      req.body.ingredients.includes("")
    ) {
      return res.send({ error: "Ingredients are required" });
    }
    if (err) {
      return res.send({ error: dbErrorHandlers.getErrorMessage(err) });
    }
    return res.send({ message: "Data updated" });
  });
};

const removeRecipe = (req, res, next) => {
  let Recipe = req.profile;
  Recipe.remove((err) => {
    if (err) {
      return res.send({ error: dbErrorHandlers.getErrorMessage(err) });
    }
    return res.send({ message: "Recipe deleted" });
  });
};

const recipeByID = (req, res, next, id) => {
  Recipe.findById(id).exec((err, Recipe) => {
    if (err || !Recipe) {
      return res.send({ error: dbErrorHandlers.getErrorMessage(err) });
    }
    req.profile = Recipe;
    next();
  });
};

export default {
  createRecipe,
  getRecipes,
  updateRecipe,
  removeRecipe,
  getRecipe,
  recipeByID,
};
