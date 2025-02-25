
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useContext, useState } from 'react';
import { userContext } from './userContext';
import { user } from '../src/Types';
import { TextField, Button, Typography, Container, Snackbar, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// הגדרת כללי הוולידציה עם Yup
const validationSchema = Yup.object().shape({
  UserName: Yup.string().required('שדה זה חובה'),
  Password: Yup.string().required('שדה זה חובה').min(6, 'הסיסמה חייבת להיות באורך מינימלי של 6 תווים'),
  Name: Yup.string().required('שדה זה חובה'),
  Phone: Yup.string().required('שדה זה חובה').matches(/^[0-9]+$/, 'מספר טלפון יכול להכיל רק מספרים'),
  Email: Yup.string().required('שדה זה חובה').email('כתובת מייל לא תקינה'),
  Tz: Yup.string().required('שדה זה חובה').matches(/^[0-9]+$/, 'מספר זהות יכול להכיל רק מספרים'),
});

const SignIn = () => {
  const { setMyUser } = useContext(userContext);
  const [msg, setMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false); // מצב להצגת הסיסמה
  const { register, handleSubmit, formState: { errors }, setError, reset } = useForm<user>({
    resolver: yupResolver(validationSchema), // הוספת הוולידציה
  });

  const onSubmit: SubmitHandler<user> = async (data) => {
    console.log(data);
    try {
      const response = await axios.post('http://localhost:8080/api/user/sighin', data);
      console.log('Success:', response.data);
      setMsg("נרשמת בהצלחה");
      setMyUser(data);
      reset();
    } catch (error: any) {
      if (error.response?.data?.includes("unique")) {
        setError("UserName", { message: "המשתמש כבר רשום במערכת" });
      } else {
        setError("UserName", { message: "ההצטרפות נכשלה נא לנסות שנית" });
      }
    }
  };

  return (
    <Container maxWidth="xs" style={{ marginTop: '50px' }}>
      <Typography variant="h5" align="center">הרשמה</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField 
          label="שם משתמש" 
          variant="outlined" 
          fullWidth 
          margin="normal" 
          {...register("UserName")} 
          error={!!errors.UserName} 
          helperText={errors.UserName?.message} 
        />
        <TextField 
          label="סיסמה" 
          type={showPassword ? 'text' : 'password'} 
          variant="outlined" 
          fullWidth 
          margin="normal" 
          {...register("Password")} 
          error={!!errors.Password} 
          helperText={errors.Password?.message} 
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
        <TextField 
          label="שם" 
          variant="outlined" 
          fullWidth 
          margin="normal" 
          {...register("Name")} 
          error={!!errors.Name} 
          helperText={errors.Name?.message} 
        />
        <TextField 
          label="מספר טלפון" 
          variant="outlined" 
          fullWidth 
          margin="normal" 
          {...register("Phone")} 
          error={!!errors.Phone} 
          helperText={errors.Phone?.message} 
        />
        <TextField 
          label="כתובת מייל" 
          type="email" 
          variant="outlined" 
          fullWidth 
          margin="normal" 
          {...register("Email")} 
          error={!!errors.Email} 
          helperText={errors.Email?.message} 
        />
        <TextField 
          label="מספר זהות" 
          variant="outlined" 
          fullWidth 
          margin="normal" 
          {...register("Tz")} 
          error={!!errors.Tz} 
          helperText={errors.Tz?.message} 
        />
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          fullWidth 
          style={{ marginTop: '20px' }}
        >
          שלח
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

export default SignIn;
