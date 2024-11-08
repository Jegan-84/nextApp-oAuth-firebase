import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import styles from "../styles/ProjectForm.module.scss";

interface AddProjectFormProps {
  open: boolean;
  onClose: () => void;
  onProjectAdded: () => void;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  priority: Yup.string().required("Priority is required"),
  projectId: Yup.string().required("Project ID is required"),
});

const AddProjectForm: React.FC<AddProjectFormProps> = ({
  open,
  onClose,
  onProjectAdded,
}) => {
  const { user } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
    try {
      await addDoc(collection(db, "projects"), {
        ...values,
        userId: user?.uid,
      });
      onProjectAdded();
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error adding project:", error);
    }
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Project</DialogTitle>
      <Formik
        initialValues={{
          title: "",
          description: "",
          priority: "",
          projectId: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className={styles.form}>
            <DialogContent>
              <Field
                as={TextField}
                name="title"
                label="Title"
                fullWidth
                margin="normal"
                error={touched.title && errors.title}
                helperText={touched.title && errors.title}
              />
              <Field
                as={TextField}
                name="description"
                label="Description"
                fullWidth
                margin="normal"
                multiline
                rows={4}
                error={touched.description && errors.description}
                helperText={touched.description && errors.description}
              />
              <Field
                as={TextField}
                name="priority"
                label="Priority"
                select
                fullWidth
                margin="normal"
                error={touched.priority && errors.priority}
                helperText={touched.priority && errors.priority}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Field>
              <Field
                as={TextField}
                name="projectId"
                label="Project ID"
                fullWidth
                margin="normal"
                error={touched.projectId && errors.projectId}
                helperText={touched.projectId && errors.projectId}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary" disabled={isSubmitting}>
                Add Project
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default AddProjectForm;
