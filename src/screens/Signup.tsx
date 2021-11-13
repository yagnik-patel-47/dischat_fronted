import { FC } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { useAppDispatch } from "../redux/reduxHooks";
import { initProfileData } from "../redux/profile";
import { ADD_NEW_USER } from "../utils/mutations";
import { motion } from "framer-motion";

const Copyright = (props: any) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © Dischat "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

const SignUp: FC = () => {
  const dispatch = useAppDispatch();
  const router = useHistory();
  const validationSchema = yup.object({
    username: yup.string().required("Username is required."),
    email: yup
      .string()
      .email("Enter a valid email.")
      .required("Email is required."),
    password: yup
      .string()
      .min(8, "Password should be of minimum 8 characters length.")
      .required("Password is required."),
  });

  const [createNewUser] = useMutation(ADD_NEW_USER, {
    onCompleted: (data) => {
      if (auth.currentUser !== null && data.createNewUser) {
        dispatch(initProfileData(data.createNewUser));
        router.replace("/");
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        if (values.username.includes(" ")) {
          formik.setFieldError(
            "username",
            "Username should not contain space."
          );
          return;
        }
        const user = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        createNewUser({
          variables: { email: user.user.email, username: values.username },
        });
      } catch (error: any) {
        if (error.code === "auth/email-already-in-use") {
          formik.setFieldError(
            "email",
            "Email is accociated with another account"
          );
        }
      }
    },
  });

  return (
    <motion.div
      initial={{ x: -150, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 150, opacity: 0 }}
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
      style={{ overflow: "hidden" }}
    >
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.light" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={formik.handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.username && Boolean(formik.errors.username)
                  }
                  helperText={formik.touched.username && formik.errors.username}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                Already have an account?{" "}
                <Link
                  style={{ textDecoration: "none", color: "#5865f2" }}
                  to="signin"
                >
                  Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </motion.div>
  );
};

export default SignUp;
