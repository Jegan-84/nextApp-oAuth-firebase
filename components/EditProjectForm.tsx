import React from "react";
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
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import styles from "../styles/ProjectForm.module.scss";

interface EditProjectFormProps {
  open: boolean;
  onClose: () => void;
  project: any;
  onProjectUpdated: () => void;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  priority: Yup.string().required("Priority is required"),
  projectId: Yup.string().required("Project ID is required"),
});

const EditProjectForm: React.FC<EditProjectFormProps> = ({
  open,
  onClose,
  project,
  onProjectUpdated,
}) => {
  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const projectRef = doc(db, "projects", project.id);
      await updateDoc(projectRef, values);
      onProjectUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating project:", error);
    }
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Project</DialogTitle>
      <Formik
        initialValues={{
          title: project.title,
          description: project.description,
          priority: project.priority,
          projectId: project.projectId,
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
                Update Project
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default EditProjectForm;
