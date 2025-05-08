import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Ingridents, Recipe } from './Types';
import { CircularProgress, Card, CardContent, Typography, Button, TextField, Grid, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { CatContext } from './categoriesContext';

const EditRecipe = () => {
    const { id } = useParams(); // מקבלים את ה-ID של המתכון מה-URL
    const [recipe, setRecipe] = useState<Recipe | null>(null); // טיפוס עבור המתכון
    const [loading, setLoading] = useState(false); // מצב טעינה
     const { categories } = useContext(CatContext);
    const navigate = useNavigate();

    const fetchRecipe = async () => {
        setLoading(true); // מתחילים טעינה
        try {
            const response = await axios.get<Recipe>(`http://localhost:8080/api/recipe/${id}`);
            setRecipe(response.data); // עדכון ה-state עם המתכון
        } catch (error) {
            console.error("Error fetching recipe:", error);
        } finally {
            setLoading(false); // מסיימים טעינה
        }
    };

    useEffect(() => {
        fetchRecipe(); // קורא לפונקציה כשמטעינים את הקומפוננטה
    }, [id]);
    //http://localhost:8080/api/recipe/edit הכתובת לשרת

    const handleUpdate = async () => {
        if (recipe) {
            try {
                console.log("before axios",recipe)
               const res= await axios.post("http://localhost:8080/api/recipe/edit", recipe); // עדכון המתכון
                navigate('/'); // הפניית המשתמש לדף הראשי לאחר העדכון
            } catch (error) {
                console.error("Error updating recipe:", error);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        if (recipe) {
            setRecipe({ ...recipe, [name]: name === "Difficulty" || name === "CategoryId" ? value : ["Duration", "UserId"].includes(name) ? Number(value) : value });
        }
    };

    const handleInstructionChange = (index: number, value: string) => {
        if (recipe) {
            const newInstructions = [...recipe.Instructions];
            newInstructions[index] = { Name: value };
            setRecipe((prevRecipe) => ({
                ...prevRecipe!,
                Instructions: newInstructions
            }));
        }
      
    };
  
    
    const handleIngredientsChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (recipe) {
            const newIngridents = [...recipe.Ingridents];
            newIngridents[index] = { ...newIngridents[index], [name]: value };
            setRecipe((prevRecipe) => ({
                ...prevRecipe!,
                Ingridents: newIngridents
            }));
        }
    };

    const addInstruction = () => {
        const newInstruction = { Name: '',  };
        if (recipe) {
            setRecipe((prevRecipe) => ({
                ...prevRecipe!,
                Instructions: [...prevRecipe!.Instructions, newInstruction]
            }));
        }
    };
  
    const addIngredient = () => {
        if (recipe) {
            setRecipe((prevRecipe) => ({
                ...prevRecipe!,
                Ingridents: [...prevRecipe!.Ingridents, { Name: '', Count: '', Type: '' }]
            }));
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            {loading ? (
                <CircularProgress /> // מראה מעגל טעינה
            ) : recipe ? (
                <Card sx={{ margin: 2, textAlign: 'right' }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>ערוך מתכון</Typography>
                        <TextField
                            label="שם המתכון"
                            name="Name"
                            value={recipe.Name}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="תיאור"
                            name="Description"
                            value={recipe.Description}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <FormControl fullWidth required>
                            <InputLabel id="difficulty-label">רמת קושי</InputLabel>
                            <Select
                                labelId="difficulty-label"
                                name="Difficulty"
                                value={recipe.Difficulty}
                                onChange={handleChange}
                            >
                                <MenuItem value="קל">קל</MenuItem>
                                <MenuItem value="בינוני">בינוני</MenuItem>
                                <MenuItem value="קשה">קשה</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="זמן הכנה"
                            name="Duration"
                            type="number"
                            value={recipe.Duration}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <FormControl fullWidth required>
                            <InputLabel id="Categoryid-label">קטגוריה</InputLabel>
                          <Select
                                                      labelId="Categoryid-label"
                                                      name="Categoryid"
                                                      value={recipe.Categoryid ? recipe.Categoryid.toString() : ''} // עדכון ה-value
                                                      onChange={handleChange}
                                                  >
                                                      {categories&&categories.map((item)=> <MenuItem key={item.Id} value={item.Id}>{item.Name}</MenuItem>)}
                                                  </Select>
                        </FormControl>
                        <TextField
                            label="כתובת תמונה"
                            name="Img"
                            value={recipe.Img}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />

                        <Typography variant="h6" gutterBottom>
                            הוראות
                        </Typography>
                        {recipe.Instructions.map((instruction, index) => (
                            <TextField
                                key={index}
                                label={`Instruction ${index + 1}`}
                                value={instruction.Name}
                                onChange={(e) => handleInstructionChange(index, e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                        ))}
                        <Button onClick={addInstruction} variant="outlined" style={{ marginTop: '10px' }}>הוסף הוראה</Button>

                        <Typography variant="h6" gutterBottom>
                            מרכיבים
                        </Typography>
                        {recipe.Ingridents.map((ingredient, index) => (
                            <Grid container spacing={2} key={index}>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        name="Name"
                                        label="שם המרכיב"
                                        fullWidth
                                        value={ingredient.Name}
                                        onChange={(e) => handleIngredientsChange(index, e)}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        name="Count"
                                        label="כמות"
                                        fullWidth
                                        value={ingredient.Count}
                                        onChange={(e) => handleIngredientsChange(index, e)}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        name="Type"
                                        label="סוג"
                                        fullWidth
                                        value={ingredient.Type}
                                        onChange={(e) => handleIngredientsChange(index, e)}
                                        required
                                    />
                                </Grid>
                            </Grid>
                        ))}
                        <Button onClick={addIngredient} variant="outlined" style={{ marginTop: '10px' }}>הוסף מרכיב</Button>

                        <Button variant="contained" color="primary" onClick={handleUpdate} style={{ marginTop: '16px' }}>
                            עדכן מתכון
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Typography variant="body1" textAlign="center">לא נמצא מתכון.</Typography>
            )}
        </div>
    );
};

export default EditRecipe;
