import '../styles/main.css';
import '../styles/home.css';

import RecipeCardSmall from "../components/RecipeCardSmall";
import { useEffect, useState, useRef } from 'react';

/**
 * Home page for the CookBook frontend
 * 
 * The home page. It is the index page of this app, the user lands here first. Here, the user can search using
 * the searchbar, create a recipe, or view the daily recipes.
 */

function Home() {

  const [recipesOTD, setRecipesOTD] = useState([]);

  const data = {"query":"SELECT * FROM recipes LIMIT 3"};

  // getting the recipes of the day, whenever the page is first rendered
  useEffect(() => {
    fetch("http://localhost:8080/api/recipe/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(response => response.json()).then(data => {
      setRecipesOTD(data);
    });
  }, []);

  return (
    <>
      <div className='banner-container'>
        <h1>The best recipes in the best place</h1>
      </div>
      <div className='recipes-otd'>
        <h2>Featured recipes</h2>
        <div className='flex'>
          {
            (recipesOTD.length != 0) ? recipesOTD.map(recipe => {
              return(<RecipeCardSmall key={recipe.id} featured="true" recipeId={recipe.id} imageUrl={'http://localhost:8080/'+recipe.image_path} recipeTitle={recipe.title} ingredients={recipe.ingredients} />)
            }) : <div className='message'>There are no recipes to show. Add some!</div>
          }
        </div>
      </div>
    </>
  )
}

export default Home;
