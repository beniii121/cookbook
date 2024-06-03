import '../styles/main.css';
import '../styles/recipecard.css';

import { useEffect, useState, forwardRef } from 'react';
import {useNavigate} from 'react-router-dom';

import ImageLoader from './ImageLoader';

/**
 * RecipeCard component for the CookBook frontend
 * 
 * A simple component that pops up whenever a user searches for a recipe. The recipes are shown using this component,
 * their title, image, ingredients list and a part of their desciption are displayed. Used only on the search page.
 */

const RecipeCard = forwardRef((props, ref) => {
    const imageUrl = props.imageUrl;
    const recipeTitle = props.recipeTitle;
    const ingredients = props.ingredients;
    const id = props.recipeId;
    const featured = props.featured;
    const description = props.description;

    const navigate = useNavigate();
    
    // navigating the user to a specific recipes page
    function navigateRecipe() {
        navigate('/showRecipe?id='+id);
    }


    return(
        <div className='recipe-card flex' onClick={navigateRecipe} ref={ref}>
            <div className='image-container'>
                <ImageLoader imageUrl={imageUrl} className='recipe-image' />
            </div>
            <div className='flex-column'>
                <h2 className='recipe-title'>{recipeTitle}</h2>
                <div className='ingredients-card'>
                    <h2>Ingredients</h2>
                    <p>{ingredients}</p>
                </div>
                <div className='description-card'>
                    <h2>Description</h2>
                    <p className='truncate'>{description}</p>
                </div>
            </div>
        </div>
    );
});

export default RecipeCard;