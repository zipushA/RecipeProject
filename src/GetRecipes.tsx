
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Recipe } from './Types';
import { CircularProgress, Card, CardContent, Typography, Grid, Button, TextField, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { userContext } from './userContext';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
const GetRecipes = () => {
    const { Myuser } = useContext(userContext);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(false);
    const [filterCategory, setFilterCategory] = useState('');
    const [filterDuration, setFilterDuration] = useState<number | ''>('');
    const [filterDifficulty, setFilterDifficulty] = useState('');
    const [filterUserId, setFilterUserId] = useState<number | ''>('');
    const navigate = useNavigate();

    const handleDelete = async (recipeId: number, UserId: number) => {
        if (Myuser?.Id === UserId) {
            try {
                await axios.post(`http://localhost:8080/api/recipe/delete/${recipeId}`);
                setRecipes(recipes.filter(recipe => recipe.Id !== recipeId));
            } catch (error) {
                console.error("Error deleting recipe:", error);
            }
        } else {
            alert("אינך מורשה למחוק את המתכון כי לא אתה הכנסת אותו");
        }
    };

    const handleEditRecipe = (id: number, UserId: number) => {
        if (UserId === Myuser?.Id) {
            navigate(`/edit-recipe/${id}`);
        } else {
            alert("אינך מורשה לערוך את המתכון כי לא אתה הכנסת אותו");
        }
    };

    const fetchRecipes = async () => {
        setLoading(true);
        try {
            const response = await axios.get<Recipe[]>('http://localhost:8080/api/recipe');
            setRecipes(response.data);
            console.log(recipes);
            
            
        } catch (error) {
            console.error("Error fetching recipes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    const filteredRecipes = recipes.filter(recipe => {
        return (
            (filterCategory ? recipe.CategoryId.toString() === filterCategory : true) &&
            (filterDuration !== '' ? recipe.Duration <= filterDuration : true) && // שינוי כאן
            (filterDifficulty ? recipe.Difficulty === filterDifficulty : true) &&
            (filterUserId ? recipe.UserId === filterUserId : true)
        );
        
    });

    return (
        <div style={{ padding: '20px' }}>
            {loading ? (
                <CircularProgress />
            ) : (
                <>
                    <Grid container spacing={2} style={{ marginBottom: '20px', marginTop: '20px' }}>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                type="number"
                                label="זמן הכנה (דקות)"
                                value={filterDuration}
                                onChange={(e) => setFilterDuration(e.target.value ? Number(e.target.value) : '')}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                select
                                label="רמת קושי"
                                value={filterDifficulty}
                                onChange={(e) => setFilterDifficulty(e.target.value)}
                                fullWidth
                            >
                                <MenuItem value="">כל הרמות</MenuItem>
                                <MenuItem value="קל">קל</MenuItem>
                                <MenuItem value="בינוני">בינוני</MenuItem>
                                <MenuItem value="קשה">קשה</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                type="number"
                                label="נוצר על ידי"
                                value={filterUserId}
                                onChange={(e) => setFilterUserId(e.target.value ? Number(e.target.value) : '')}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        {filteredRecipes.length > 0 ? (
                            filteredRecipes.map((recipe) => (
                                <Grid item xs={12} sm={6} md={4} key={recipe.Id}>
                                    <Card sx={{ margin: 2, textAlign: 'right' }}>
                                        <CardContent>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Button onClick={() => handleDelete(recipe.Id, recipe.UserId)} style={{ color: 'red' }}>
                                                    <DeleteIcon />
                                                </Button>
                                                <Button onClick={() => handleEditRecipe(recipe.Id, recipe.UserId)} style={{ color: 'blue' }}>
                                                    <EditIcon />
                                                </Button>
                                                <Button onClick={() => console.log("Liked recipe")} style={{ color: 'green' }}>
                                                    <ThumbUpIcon />
                                                </Button>
                                            </div>
                                            <Typography variant="h5" gutterBottom>{recipe.Name}</Typography>
                                            <Typography variant="body2" paragraph>{recipe.Description}</Typography>
                                            <Typography variant="body2" gutterBottom> רמת קושי - {recipe.Difficulty}</Typography>
                                            <Typography variant="body2" gutterBottom> זמן הכנה - {recipe.Duration} דקות </Typography>
                                            <Typography variant="body2" gutterBottom> {recipe.CategoryId} - סוג</Typography>
                                            <img src={recipe.Img} alt={recipe.Name} style={{ width: '100%', height: 'auto' }} />
                                            <Typography variant="h6" gutterBottom>מרכיבים</Typography>

                                            {recipe.Ingridents && recipe.Ingridents.length > 0 ? (
                                                recipe.Ingridents.map((ing) => (
                                                    <Typography key={`${recipe.Id}-${ing.Name}`} style={{ textAlign: 'right', position: 'relative' }}>
                                                        {ing.Name} - {ing.Count} {ing.Type}
                                                    </Typography>
                                                ))
                                            ) : (
                                                <li>אין מרכיבים זמינים</li>
                                            )}

                                            <Typography variant="h6" gutterBottom>הוראות הכנה</Typography>
                                            {recipe.Instructions.length > 0 ? (
                                                recipe.Instructions.map((instruction, idx) => (
                                                    <Typography key={idx} variant="body2">
                                                        {instruction.Name}
                                                    </Typography>
                                                ))
                                            ) : (
                                                <Typography variant="body2">אין הוראות הכנה זמינות</Typography>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            <Typography variant="body1" textAlign="center">אין מתכונים זמינים.</Typography>
                        )}
                    </Grid>
                </>
            )}
        </div>
    );
};

export default GetRecipes;
