import "../styles/search.css";

import { useRef, useEffect, useState, useCallback } from 'react';
import {useSearchParams} from 'react-router-dom';
import { useFetchRecipes } from '../hooks/useFetchRecipes';

import Header from '../components/Header';
import RecipeCard from '../components/RecipeCard';

/**
 * Search page for the CookBook frontend
 * 
 * The page used for displaying the recipes queried. This page can be accessed by typing something into the searchbar
 * and submitting it in the Header component. The page turns to the backend to get the specific recipes. 
 * The custom hook, useFetchRecipes is used here.
 */

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageNumber, setPageNumber] = useState(1);
  const [maxCount, setMaxCount] = useState();
  const [queryText, setQueryText] = useState(searchParams.get('query'));
  const {recipes, loading, error, hasMore} = useFetchRecipes(queryText, pageNumber, 3, maxCount);

  const observer = useRef();

  // determining if the recipeCard that is at the bottom of the page is the last recipe in the list. If it is,
  // no more recipes are displayed, thus ending the infinite scroll
  const lastRecipe = useCallback(recipe => {
    if (loading) {
      return;
    }

    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber(prevPage => prevPage+1);
      }
    });

    if (recipe) {
      observer.current.observe(recipe);
    }
  }, [loading, hasMore]);

  // getting the maximum amount of recipes that can be queried by the custom hook
  function getMaxRecipesCount() {
    var query = "";

    if (queryText) {
      query = "SELECT COUNT(*) as maxcount FROM recipes";
    } else {
      query = "SELECT COUNT(*) as maxcount FROM recipes WHERE title LIKE '%"+queryText+"%' OR description LIKE '%"+queryText+"%' OR ingredients LIKE '%"+queryText+"%';"; 
    }

    fetch('http://localhost:8080/api/recipe/get', {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({"query":query})
    })
    .then(response => response.json())
    .then(data => {
        setMaxCount(data[0].maxcount);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  // setting variables if the query search parameter changes, meaning if the user searches for something new
  useEffect(() => {
    setQueryText(searchParams.get('query'));
    getMaxRecipesCount();
    setPageNumber(1);
  }, [searchParams]);

  return (
    <>
      <main>
        <h1>Search recipes</h1>
        {
          error && <div className='recipe-error'><p>Error: {error}</p></div>
        }
        <div className='recipes-container flex-column'>
          {
            recipes && recipes.map((recipe, index) => {
              if (recipes.length === index+1) {
                return(<RecipeCard ref={lastRecipe} key={recipes.indexOf(recipe)} imageUrl={"http://localhost:8080/"+recipe.image_path} recipeTitle={recipe.title} description={recipe.description} ingredients={recipe.ingredients} recipeId={recipe.id}/>);
              } else {
                return(<RecipeCard key={recipes.indexOf(recipe)} imageUrl={"http://localhost:8080/"+recipe.image_path} recipeTitle={recipe.title} description={recipe.description} ingredients={recipe.ingredients} recipeId={recipe.id}/>);
              }
            })
          }
          {
              loading == true ? <div className='recipe-loading'><p>Loading...</p></div> : <div className='recipe-loading'><p>All recipes loaded</p></div>
          }
        </div>
      </main>
    </>
  )
}

export default Search;
