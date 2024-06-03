import '../styles/main.css';
import '../styles/header.css';
import {useNavigate} from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { useRef, useEffect } from 'react';

import Search from '../pages/Search';
import Layout from './Layout';
import Home from '../pages/Home';
import CreateRecipe from '../pages/CreateRecipe';
import ShowRecipe from '../pages/ShowRecipe';
import EditRecipe from '../pages/EditRecipe';

/**
 * Header component for the CookBook frontend
 * 
 * The Header component loads on every page, located on the top of the current page. It includes the
 * "logo", which pressed takes the user back to the home page. The next element is the searchbar. With it
 * the user can search for specific recipes. The last element is the "create new recipe" button, which pressed
 * takes the user to the createRecipe page, where the user can create a recipe and store it.
 */

function Header() {
    const navigate = useNavigate();
    const queryInput = useRef();

    function handleSubmit(event) {
        event.preventDefault();

        const query = document.getElementById("query");

        navigate('/search?query='+query.value, {replace: true});
    }

    // navigating the user to the home page
    function navigateHome() {
        queryInput.current.value = "";
        navigate('/');
    }

    // navigating the user to the recipe creation page
    function navigateCreateNew() {
        queryInput.current.value = "";
        navigate('/createRecipe');
    }

    return(
        <>
            <div className="header flex">
                <div className="logo-container flex" onClick={navigateHome}>
                    <div className="logo">CookBook</div>
                </div>
                <div className="search-container flex">
                    <span>🔍</span>
                    <form method="GET" onSubmit={(event) => handleSubmit(event)}>
                        <input id="query" ref={queryInput} type="text" name="search" placeholder="Search..." />
                    </form>
                </div>
                <div className="create-container">
                    <button className="create-recipe-button" onClick={navigateCreateNew}>Create new Recipe</button>
                </div>
            </div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/createRecipe" element={<CreateRecipe />} />
                <Route path="/showRecipe" element={<ShowRecipe />}/>
                <Route path="/editRecipe" element={<EditRecipe />}/>
            </Routes>
        </>
    );
}

export default Header;