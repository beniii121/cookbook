import { useState, useEffect } from 'react';

/**
 * useFetchRecipes hook - used for fetching recipes from the backend. Fetches recipes whenever the querytext
 * or the pageNumber variable is changed. 
 * 
 * @param {*} queryText - Stores the input that was typed into the searchbar by the user, used for querying
 * @param {*} pageNumber - The current page number, it is changed whenever the user scrolls down by the "limit" variable
 * @param {*} limit - Stores the amount of recipes that are displayed at once on the search page. Whenever the user
 *                    scrolls down the amount of recipes given, the infinite scroll function loads another "limit" recipes.
 * @param {*} maxCount - The maximum amount of recipes which can be queried.
 * @returns - Destructured object
 */

export function useFetchRecipes(queryText, pageNumber, limit, maxCount) {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);


    useEffect(() => {
        var query = "";

        // assembling the query that is handed to the backend
        if (queryText == "") {
            query = "SELECT * FROM recipes ORDER BY title LIMIT "+pageNumber*limit+";"; 
        } else {
            query = "SELECT * FROM recipes WHERE title LIKE '%"+queryText+"%' OR description LIKE '%"+queryText+"%' OR ingredients LIKE '%"+queryText+"%' ORDER BY title LIMIT "+pageNumber*limit+";"; 
        }

        setLoading(true);

        // calling the endpoint
        fetch('http://localhost:8080/api/recipe/get', {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({"query":query})
        })
        .then(response => response.json())
        .then(data => {
            // processing the sent back data and setting the recipes variable
            if (data.length >= maxCount) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

            setRecipes(data);
            setLoading(false);
        })
        .catch((error) => {
            // handling errors
            setError(error);
            setLoading(false);
        });

        setLoading(false);
    }, [queryText, pageNumber]);

    return {recipes, loading, error, hasMore};
}