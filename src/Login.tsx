
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useContext, useState } from 'react';
import { userContext } from './userContext';
import { user } from './Types';
import { TextField, Button, Typography, Container, Snackbar, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login = () => {
 
    const {setMyUser } = useContext(userContext);
  const [msg, setMsg] = useState("");
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');
  const [showPassword, setShowPassword] = useState(false); // מצב להצגת הסיסמה

  const reset = () => {
    setName("");
    setPass("");
  };

  const { handleSubmit } = useForm<user>();

  const onSubmit: SubmitHandler<user> = async () => {
    try {
      
      const res = await axios.post<user>("http://localhost:8080/api/user/login", 
        { UserName: name, Password: pass },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setMyUser(res.data);
      reset();
      setMsg(`${res.data.Name} ההתחברת בהצלחה`);
    } catch (error: any) {
      console.log(error);
      setMsg(error.response?.data || 'אירעה שגיאה'); // הוסף הודעת שגיאה
    }
   
  };
  return (
    <Container maxWidth="xs" style={{ marginTop: '50px' }}>
      <Typography variant="h5" align="center">התחברות</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField 
          label="שם משתמש" 
          variant="outlined" 
          fullWidth 
          margin="normal" 
          value={name} 
          required 
          onChange={({ target }) => setName(target.value)} 
        />
        <TextField 
          label="סיסמה" 
          type={showPassword ? 'text' : 'password'} 
          variant="outlined" 
          fullWidth 
          margin="normal" 
          value={pass} 
          required 
          onChange={({ target }) => setPass(target.value)} 
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton 
                  onClick={() => setShowPassword(!showPassword)} 
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          fullWidth 
          style={{ marginTop: '20px' }}
        >
          להתחברות
        </Button>
      </form>
      <Snackbar 
        open={!!msg} 
        autoHideDuration={6000} 
        onClose={() => setMsg("")} 
        message={msg} 
      />
    </Container>
  );
};

export default Login;
