import { FC } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link as MUILink,
  Grid,
  Box,
  Typography,
  Container,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { useHistory } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { useLazyQuery } from "@apollo/client";
import { useAppDispatch } from "../redux/reduxHooks";
import { initProfileData } from "../redux/profile";
import { GET_USER } from "../utils/queries";
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

const SignIn: FC = () => {
  const router = useHistory();
  const dispatch = useAppDispatch();
  const [getUser] = useLazyQuery(GET_USER, {
    onCompleted: (data) => {
      if (data.getUser.error === null && auth.currentUser !== null) {
        dispatch(initProfileData(data.getUser.user));
        router.replace("/");
      }
    },
  });

  const validationSchema = yup.object({
    email: yup
      .string()
      .email("Enter a valid email.")
      .required("Email is required."),
    password: yup
      .string()
      .min(8, "Password should be of minimum 8 characters length.")
      .required("Password is required."),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await signInWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        getUser({ variables: { email: response.user.email } });
      } catch (error: any) {
        if (error.code === "auth/wrong-password") {
          formik.setFieldError("password", "Entered password is wrong!");
        } else if (error.code === "auth/user-not-found") {
          formik.setFieldError(
            "email",
            "User is not registered with this email."
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 8,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.light" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <MUILink href="#" color="primary.light" variant="body2">
                  Forgot password?
                </MUILink>
              </Grid>
              <Grid item>
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  style={{ textDecoration: "none", color: "#5865f2" }}
                >
                  Sign Up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </motion.div>
  );
};

export default SignIn;
