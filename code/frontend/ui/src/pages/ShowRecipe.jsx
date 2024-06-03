import "../styles/showrecipe.css";

import { useEffect, useState } from "react";
import {useSearchParams, useNavigate} from 'react-router-dom';

import ImageLoader from "../components/ImageLoader";

/**
 * ShowRecipe page for the CookBook frontend
 * 
 * The page used for displaying a given recipe . This page can be accessed by pressing any recipe's card. 
 * This page only shows the details of the recipe, editing or removing the recipe can be done by pressing the
 * buttons located at the bottom of the page.
 */

function ShowRecipe() {
    const [recipe, setRecipe] = useState({});
    const [ingredients, setIngredients] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();

    const navigate = useNavigate();
    const recipeId = searchParams.get('id');

    // redirecting the user to the recipe's edit page
    function navigateEdit() {
        navigate('/editRecipe?id='+recipeId);
    }

    // handling deleting the recipe
    function deleteRecipe() {
        fetch('http://localhost:8080/api/recipe/delete/'+recipeId, {
            method: "DELETE"
        })
        .then(response => response.json())
        .then(data => {
            if (data.message == "ok") {
                navigate('/');
            }
        })
        .catch((error) => alert(error));
    }

    // getting the recipe's details whenever the page is first rendered
    useEffect(() => {
        fetch('http://localhost:8080/api/recipe/get/'+recipeId, {
            method: "GET"
        })
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                setRecipe(data);
                setIngredients(data.ingredients.split(','));
            }
        })
        .catch((error) => console.log(error));
    }, []);

    return(
        <>
            <main>
                <div className="recipes-container flex">
                    <div className="image-container">
                        <ImageLoader className="recipe-image" imageUrl={"http://localhost:8080/"+recipe.image_path}/>
                    </div>
                    <div className="title-container container">
                        <h1>{recipe.title}</h1>
                    </div>
                    <div className="notes-container container" >
                        <h2>Notes</h2>
                        <p>{recipe.notes}</p>
                    </div>
                    <div className="ingredients-container container">
                        <h2>Ingredients</h2>
                        <ul>
                            {
                                ingredients.map(ingredient => {
                                    return(
                                        <>
                                            <li key={ingredients.indexOf(ingredient)}>
                                                {ingredient}
                                            </li>
                                            {ingredient && <hr />}
                                        </>
                                    )
                                })
                            }
                        </ul>
                    </div>
                    <div className="description-container container">
                        <h2>Description</h2>
                        <p>{recipe.description}</p>
                    </div>
                    <div className="buttons-container flex">
                        <button onClick={navigateEdit}>Edit recipe</button>
                        <button onClick={deleteRecipe}>Delete recipe</button>
                    </div>
                </div>
            </main>
        </>
    );
}

export default ShowRecipe;