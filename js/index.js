"use strict";
// Singleton pattern for managing all recipes
class RecipeManager {
    constructor() {
        this.recipes = [];
    }
    static getInstance() {
        if (!RecipeManager.instance) {
            RecipeManager.instance = new RecipeManager();
        }
        return RecipeManager.instance;
    }
    addRecipe(recipe) {
        this.recipes.push(recipe);
    }
    getRecipes() {
        return this.recipes;
    }
}
// Abstract Factory pattern for creating recipes
class RecipeFactory {
}
class FilipinoRecipeFactory extends RecipeFactory {
    createRecipe(name, ingredients) {
        return {
            name,
            ingredients,
            displayRecipe: () => `Filipino - ${name} - Ingredients: ${ingredients.join(", ")}`,
        };
    }
}
class AmericanRecipeFactory extends RecipeFactory {
    createRecipe(name, ingredients) {
        return {
            name,
            ingredients,
            displayRecipe: () => `American - ${name} - Ingredients: ${ingredients.join(", ")}`,
        };
    }
}
class OthersRecipeFactory extends RecipeFactory {
    createRecipe(name, ingredients) {
        return {
            name,
            ingredients,
            displayRecipe: () => `Others - ${name} - Ingredients: ${ingredients.join(", ")}`,
        };
    }
}
// Builder pattern for constructing recipes
class RecipeBuilder {
    constructor() {
        this.name = "";
        this.ingredients = [];
    }
    withName(name) {
        this.name = name;
        return this;
    }
    withIngredients(ingredients) {
        this.ingredients = ingredients;
        return this;
    }
    build(factory) {
        return factory.createRecipe(this.name, this.ingredients);
    }
}
const manager = RecipeManager.getInstance();
const recipeListElement = document.getElementById("recipeList");
const addRecipeForm = document.getElementById("addRecipeForm");
addRecipeForm === null || addRecipeForm === void 0 ? void 0 : addRecipeForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const recipeTypeInput = document.getElementById("recipeType");
    const recipeNameInput = document.getElementById("recipeName");
    const ingredientsInput = document.getElementById("ingredients");
    const type = recipeTypeInput.value;
    const name = recipeNameInput.value;
    const ingredients = ingredientsInput.value
        .split(",")
        .map((item) => item.trim());
    let factory;
    // Determine the factory based on the selected recipe type
    if (type === "filipino") {
        factory = new FilipinoRecipeFactory();
    }
    else if (type === "american") {
        factory = new AmericanRecipeFactory();
    }
    else if (type === "others") {
        factory = new OthersRecipeFactory();
    }
    else {
        throw new Error("Invalid recipe type");
    }
    // Using the RecipeBuilder to create a recipe with the selected factory
    const recipe = new RecipeBuilder()
        .withName(name)
        .withIngredients(ingredients)
        .build(factory);
    manager.addRecipe(recipe);
    const recipeItem = document.createElement("div");
    recipeItem.textContent = recipe.displayRecipe();
    recipeItem.classList.add("recipe-item");
    recipeListElement === null || recipeListElement === void 0 ? void 0 : recipeListElement.appendChild(recipeItem);
    // Clear form inputs
    recipeTypeInput.value = "filipino"; // Reset to default
    recipeNameInput.value = "";
    ingredientsInput.value = "";
});
// Display existing recipes
const recipes = manager.getRecipes();
recipes.forEach((recipe) => {
    const recipeItem = document.createElement("div");
    recipeItem.textContent = recipe.displayRecipe();
    recipeListElement === null || recipeListElement === void 0 ? void 0 : recipeListElement.appendChild(recipeItem);
});
