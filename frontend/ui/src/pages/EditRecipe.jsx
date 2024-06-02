import "../styles/main.css";
import "../styles/createrecipe.css";

import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import {useSearchParams, useNavigate} from 'react-router-dom';

import ImageLoader from "../components/ImageLoader";

/**
 * EditRecipe page for the CookBook frontend
 * 
 * The page used for displaying the recipe edit form. This page can be accessed by pressing the "edit recipe" 
 * button on the ShowRecipe page. When the recipe edit form is submitted, the formdata is posted to the 
 * backend. When the backend responds back with no errors, the user is redirected to the home page, and the 
 * desired recipe is modified. This page also uses react-hook-form to handle form logic.
 */

function EditRecipe() {
    const [recipe, setRecipe] = useState({});
    const [ingredients, setIngredients] = useState([]);
    const [filePath, setFilePath] = useState("");
    const [notes, setNotes] = useState("");
    const [desc, setDesc] = useState("");
    const [title, setTitle] = useState("");

    const [searchParams, setSearchParams] = useSearchParams();
    const {register, control, handleSubmit} = useForm();

    const navigate = useNavigate();
    const recipeId = searchParams.get('id');

    // handling edit form submission
    function submitEditRecipeForm(data) {
        const jsonData = {id:recipe.id, title:title, description:desc, notes:notes, image_path: filePath, liked:0, ingredients_array:ingredients};

        console.log(JSON.stringify(jsonData));

        fetch("http://localhost:8080/api/recipe/edit", {
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

    // deleting the previous image of the recipe to reduce waste
    function deleteFile() {
        const filePath = recipe.image_path;

        fetch("http://localhost:8080/api/files/delete", {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
            },
            body: JSON.stringify({"image_path":filePath})
        })
        .then(response => response.json())
        .then(data => {
            if (data.message == "ok") {
                return true;
            } else {
                return false;
            }
        })
        .catch((error) => {
            return false;
        });
    }

    // uploading the image of the recipe
    function uploadFile(event) {
        const fileToUpload = event.target.files[0];
        const uploadData = new FormData();

        // deleting previous image
        deleteFile();

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

    useEffect(() => {
        fetch('http://localhost:8080/api/recipe/get/'+recipeId, {
            method: "GET"
        })
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                setRecipe(data);

                console.log(data);

                const ingredients_array = data.ingredients.split(',');
                const ingredients_tmp = ingredients_array.map(ingredient => {
                    return {id:ingredients_array.indexOf(ingredient), text:ingredient};
                });

                setIngredients(ingredients_tmp);
                setFilePath(data.image_path);
                setDesc(data.description);
                setNotes(data.notes);
                setTitle(data.title);
            }
        })
        .catch((error) => console.log(error));
    }, []);

    return(
        <>
            <main>
                <div className="edit-form-container">
                    <form id="editForm" onSubmit={handleSubmit((data) => submitEditRecipeForm(data))}>
                        <div className="form-inputs-container flex">
                            <div className="title-container container">
                                <p>Title of the recipe: </p>
                                <input {...register("title")} type="text" name="title" value={title} placeholder="Title of the recipe" onChange={(event) => setTitle(event.target.value)}/>
                            </div>
                            <div className="image-container container">
                                <p>Uploaded image of the recipe: </p>
                                <ImageLoader imageUrl={"http://localhost:8080/"+recipe.image_path}/>
                                <input type="file" name="images" onChange={(e) => uploadFile(e)}/>
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
                                <br />
                            </div>
                            <div className="description-container container">
                                <p>Description:</p>
                                <textarea {...register("description")} name="description" value={desc} onChange={(event) => setDesc(event.target.value)}></textarea><br />
                            </div>
                            <div className="notes-container container">
                                <p>Notes for the recipe:</p>
                                <textarea {...register("notes")} name="notes" value={notes} onChange={(event) => setNotes(event.target.value)}></textarea><br />
                            </div>
                            <input type="submit" className="recipe-submit" />
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}

export default EditRecipe;