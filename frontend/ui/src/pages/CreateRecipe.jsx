import "../styles/main.css";
import "../styles/createrecipe.css";

import {useState, useRef, useEffect} from 'react';
import { useForm } from 'react-hook-form';
import {useNavigate} from 'react-router-dom';

/**
 * CreateRecipe page for the CookBook frontend
 * 
 * The page used for displaying the recipe creation form. This page can be accessed by pressing the "create new recipe" 
 * button in the Header component. When the recipe creation form is submitted, the formdata is posted to the 
 * backend. When the backend responds back with no errors, the user is redirected to the home page.
 * The page uses react-hook-form to handle form logic.
 */

function CreateRecipe() {
    const [ingredients, setIngredients] = useState([]);
    const [filePath, setFilePath] = useState("");
    const {register, control, handleSubmit} = useForm();
    const navigate = useNavigate();

    // handling form submission
    function submitNewRecipeForm(data) {
        const jsonData = {...data, image_path: filePath, ingredients_array:ingredients};

        console.log(JSON.stringify(jsonData));

        fetch("http://localhost:8080/api/recipe/create", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData)
        }).then(response => response.json())
        .then(data => {
            if (data.message) {
                navigate('/', {replace: true});
            }
        });
    }

    // handling adding new ingredient to the ingredients list
    function addNewIngredient(event) {
        event.preventDefault();

        console.log("adding new ingredient");

        const lastIngredient = ingredients[ingredients.length - 1];
        var lastId = 0;

        console.log(lastIngredient);

        if (lastIngredient && "id" in lastIngredient) {
            lastId = lastIngredient.id;
        }

        console.log("Last id: "+lastId);

        setIngredients([...ingredients, {id:lastId+1}]);
    }

    // handling removing ingredient from the ingredients list
    function removeIngredient(event, ingredientId) {
        console.log("removing item with id "+ingredientId);
        
        setIngredients(prevIngredients => prevIngredients.filter(item => item.id !== ingredientId));
    }

    // handling setting an ingredient's value
    function setIngredientValue(event, ingredientId) {
        console.log(event.target.value);

        setIngredients(prevIngredients => {
            const index = ingredients.findIndex(i => i.id === ingredientId);
            const updatedIngredients = [...prevIngredients];

            updatedIngredients[index] = {id: ingredientId, text: event.target.value};

            return updatedIngredients;
        });
    }

    // uploading the image of the recipe
    function uploadFile(event) {
        const fileToUpload = event.target.files[0];
        const uploadData = new FormData();

        uploadData.append('file', fileToUpload);

        fetch("http://localhost:8080/api/upload", {
            method: "POST",
            body: uploadData
        })
        .then(response => response.json())
        .then(data => {
            if (data.path) {
                console.log(data.path);
                setFilePath(data.path);
            }
        });
    }

    return(
    <>
        <main>
            <h1>Create new recipe</h1>
            <div className="create-new-form-container">
                <form id="newRecipeForm" onSubmit={handleSubmit((data) => submitNewRecipeForm(data))}>
                    <div className="form-inputs-container flex">
                        <div className="title-container container">
                            <p>Title of the recipe: </p>
                            <input {...register("title")} type="text" name="title" placeholder="Title of the recipe"/>
                        </div>
                        <div className="ingredients-container container">
                            <p>List of ingredients: </p>
                            <ul>
                                {
                                    ingredients.map(item => {
                                        return (
                                            <li key={item.id}>  
                                                <input type="text" className="ingredients" name={"ingredients"+item.id} value={item.text || ""} onChange={(event) => setIngredientValue(event, item.id)}/>
                                                <button onClick={(event) => addNewIngredient(event)}>+</button>
                                                <button onClick={(event) => removeIngredient(event, item.id)}>-</button>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                            {ingredients.length === 0 && <><button onClick={addNewIngredient}>Add new ingredient</button><br /></> }
                        </div>
                        <div className="description-container container">
                        <p>Description:</p>
                        <textarea {...register("description")} name="description"></textarea>
                        </div>
                        <div className="notes-container container">
                            <p>Notes for the recipe:</p>
                            <textarea {...register("notes")} name="notes"></textarea><br />
                        </div>
                        <div className="upload-container container">
                            <p>Upload image:</p>
                            <input type="file" name="images" onChange={(e) => uploadFile(e)}/>
                        </div>
                        <input type="submit" className="recipe-submit" />
                    </div>
                </form>
            </div>
        </main>
    </>);
}

export default CreateRecipe;