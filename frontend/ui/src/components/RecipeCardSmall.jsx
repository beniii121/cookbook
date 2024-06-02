import '../styles/main.css';
import '../styles/recipecard.css';

import { useEffect, useState, forwardRef } from 'react';
import {useNavigate} from 'react-router-dom';

import ImageLoader from './ImageLoader';

/**
 * RecipeCardSmall component for the CookBook frontend
 * 
 * A component only used for displaying the random featured recipes of the day. Functions nearly the same
 * as RecipeCard, the only difference is that it doesn't display the recipe's description and appears on the
 * home page instead of the search page.
 */

const RecipeCardSmall = forwardRef((props, ref) => {
    const imageUrl = props.imageUrl;
    const recipeTitle = props.recipeTitle;
    const ingredients = props.ingredients;
    const id = props.recipeId;
    const featured = props.featured;

    const navigate = useNavigate();
    
    // navigating the user to the specific recipe's page
    function navigateRecipe() {
        navigate('/showRecipe?id='+id);
    }


    return(
        <div className='recipe-card-small flex' onClick={navigateRecipe} ref={ref}>
            <div className='image-container'>
                <ImageLoader imageUrl={imageUrl} className='recipe-image' />
            </div>
            <h2 className='recipe-title small truncate'>{recipeTitle}</h2>
            {featured && <div className='featured-tag'>Featured recipe</div>}
        </div>
    );
});

export default RecipeCardSmall;