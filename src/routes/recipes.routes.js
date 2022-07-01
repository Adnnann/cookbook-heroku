import express from "express";
import recipesCtrl from "../controllers/recipes.controller.js";
import authCtrl from "../controllers/auth.controller.js";

const router = express.Router();

router
  .route("/api/recipes")
  .post(authCtrl.hasAuthorization, recipesCtrl.createRecipe)
  .get(recipesCtrl.getRecipes);

router
  .route("/api/recipes/:recipeId")
  .get(recipesCtrl.getRecipe)
  .put(authCtrl.hasAuthorization, recipesCtrl.updateRecipe)
  .delete(authCtrl.hasAuthorization, recipesCtrl.removeRecipe);

router.param("recipeId", recipesCtrl.recipeByID);

export default router;
