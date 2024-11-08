import React, { useState } from "react";
import {
  Button,
  Box,
  Typography,
  Paper,
  TextField,
  Divider,
  Tab,
  Tabs,
  Link,
  Modal,
  Fade,
  Backdrop,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Too Short!").required("Required"),
});

const resetPasswordValidationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
});

export default function Login() {
  const {
    signIn,
    signInWithEmail,
    signUpWithEmail,
    signInWithGitHub,
    resetPassword,
  } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [openResetPassword, setOpenResetPassword] = useState(false);
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      if (tabValue === 1) {
        await signUpWithEmail(values.email, values.password);
      } else {
        await signInWithEmail(values.email, values.password);
      }
    } catch (error) {
      console.error("Failed to log in or sign up", error);
    }
    setSubmitting(false);
  };

  const handleGoogleAuth = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error("Failed to authenticate with Google", error);
    }
  };

  const handleGitHubAuth = async () => {
    try {
      await signInWithGitHub();
    } catch (error) {
      console.error("Failed to authenticate with GitHub", error);
    }
  };

  const handleResetPassword = async (values: any, { setSubmitting }: any) => {
    try {
      await resetPassword(values.email);
      setResetPasswordSuccess(true);
    } catch (error) {
      console.error("Failed to reset password", error);
    }
    setSubmitting(false);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: 400,
          width: "100%",
        }}
      >
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{ mb: 2 }}
        >
          <Tab label="Sign In" />
          <Tab label="Sign Up" />
        </Tabs>
        <Typography variant="h4" component="h1" gutterBottom>
          {tabValue === 0 ? "Sign In" : "Create Account"}
        </Typography>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form style={{ width: "100%" }}>
              <Field
                as={TextField}
                name="email"
                label="Email"
                fullWidth
                margin="normal"
                error={touched.email && errors.email}
                helperText={touched.email && errors.email}
              />
              <Field
                as={TextField}
                name="password"
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                error={touched.password && errors.password}
                helperText={touched.password && errors.password}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                sx={{ mt: 2 }}
              >
                {tabValue === 0 ? "Sign In" : "Create Account"}
              </Button>
            </Form>
          )}
        </Formik>
        {tabValue === 0 && (
          <Box sx={{ mt: 2, width: "100%", textAlign: "right" }}>
            <Link
              component="button"
              variant="body2"
              onClick={() => setOpenResetPassword(true)}
            >
              Forgot password?
            </Link>
          </Box>
        )}
        <Divider sx={{ my: 2, width: "100%" }}>or</Divider>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleGoogleAuth}
          fullWidth
          startIcon={<GoogleIcon />}
          sx={{ mb: 1 }}
        >
          Continue with Google
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleGitHubAuth}
          fullWidth
          startIcon={<GitHubIcon />}
        >
          Continue with GitHub
        </Button>
      </Paper>
      <Modal
        open={openResetPassword}
        onClose={() => {
          setOpenResetPassword(false);
          setResetPasswordSuccess(false);
        }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openResetPassword}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              Reset Password
            </Typography>
            {resetPasswordSuccess ? (
              <Typography>
                Password reset email sent. Please check your inbox.
              </Typography>
            ) : (
              <Formik
                initialValues={{ email: "" }}
                validationSchema={resetPasswordValidationSchema}
                onSubmit={handleResetPassword}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form>
                    <Field
                      as={TextField}
                      name="email"
                      label="Email"
                      fullWidth
                      margin="normal"
                      error={touched.email && errors.email}
                      helperText={touched.email && errors.email}
                    />
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                      sx={{ mt: 2 }}
                    >
                      Reset Password
                    </Button>
                  </Form>
                )}
              </Formik>
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
}
