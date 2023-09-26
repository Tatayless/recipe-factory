interface Recipe {
  name: string;
  ingredients: string[];
  displayRecipe: () => string;
}

// Singleton pattern for managing all recipes
class RecipeManager {
  private static instance: RecipeManager;
  private recipes: Recipe[] = [];

  private constructor() {}

  static getInstance(): RecipeManager {
    if (!RecipeManager.instance) {
      RecipeManager.instance = new RecipeManager();
    }
    return RecipeManager.instance;
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
  }

  getRecipes(): Recipe[] {
    return this.recipes;
  }
}

// Abstract Factory pattern for creating recipes
abstract class RecipeFactory {
  abstract createRecipe(name: string, ingredients: string[]): Recipe;
}

class FilipinoRecipeFactory extends RecipeFactory {
  createRecipe(name: string, ingredients: string[]): Recipe {
    return {
      name,
      ingredients,
      displayRecipe: () =>
        `Filipino - ${name} - Ingredients: ${ingredients.join(", ")}`,
    };
  }
}

class AmericanRecipeFactory extends RecipeFactory {
  createRecipe(name: string, ingredients: string[]): Recipe {
    return {
      name,
      ingredients,
      displayRecipe: () =>
        `American - ${name} - Ingredients: ${ingredients.join(", ")}`,
    };
  }
}

class OthersRecipeFactory extends RecipeFactory {
  createRecipe(name: string, ingredients: string[]): Recipe {
    return {
      name,
      ingredients,
      displayRecipe: () =>
        `Others - ${name} - Ingredients: ${ingredients.join(", ")}`,
    };
  }
}

// Builder pattern for constructing recipes
class RecipeBuilder {
  private name: string = "";
  private ingredients: string[] = [];

  withName(name: string): this {
    this.name = name;
    return this;
  }

  withIngredients(ingredients: string[]): this {
    this.ingredients = ingredients;
    return this;
  }

  build(factory: RecipeFactory): Recipe {
    return factory.createRecipe(this.name, this.ingredients);
  }
}

const manager = RecipeManager.getInstance();
const recipeListElement = document.getElementById("recipeList");
const addRecipeForm = document.getElementById("addRecipeForm");

addRecipeForm?.addEventListener("submit", function (e) {
  e.preventDefault();

  const recipeTypeInput = document.getElementById(
    "recipeType"
  ) as HTMLSelectElement;
  const recipeNameInput = document.getElementById(
    "recipeName"
  ) as HTMLInputElement;
  const ingredientsInput = document.getElementById(
    "ingredients"
  ) as HTMLInputElement;

  const type = recipeTypeInput.value;
  const name = recipeNameInput.value;
  const ingredients = ingredientsInput.value
    .split(",")
    .map((item) => item.trim());

  let factory: RecipeFactory;

  // Determine the factory based on the selected recipe type
  if (type === "filipino") {
    factory = new FilipinoRecipeFactory();
  } else if (type === "american") {
    factory = new AmericanRecipeFactory();
  } else if (type === "others") {
    factory = new OthersRecipeFactory();
  } else {
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
  recipeListElement?.appendChild(recipeItem);

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

  recipeListElement?.appendChild(recipeItem);
});
