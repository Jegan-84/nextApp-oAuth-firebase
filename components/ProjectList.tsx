import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { collection, query, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import AddProjectForm from "./AddProjectForm";
import EditProjectForm from "./EditProjectForm";
import { withRoleAccess } from "./withRoleAccess";
import styles from "../styles/ProjectList.module.scss";

interface Project {
  id: string;
  title: string;
  description: string;
  priority: string;
  projectId: string;
}

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [openAddForm, setOpenAddForm] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    if (!user) return;
    const q = query(collection(db, "projects"));
    const querySnapshot = await getDocs(q);
    const fetchedProjects: Project[] = [];
    querySnapshot.forEach((doc) => {
      fetchedProjects.push({ id: doc.id, ...doc.data() } as Project);
    });
    setProjects(fetchedProjects);
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setOpenEditForm(true);
  };

  const handleDelete = (project: Project) => {
    setSelectedProject(project);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (selectedProject) {
      await deleteDoc(doc(db, "projects", selectedProject.id));
      setOpenDeleteDialog(false);
      fetchProjects();
    }
  };

  return (
    <div className={styles.projectList}>
      {user?.role === "admin" && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenAddForm(true)}
          className={styles.addButton}
        >
          Add New Project
        </Button>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Project ID</TableCell>
              {user?.role === "admin" && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.title}</TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>{project.priority}</TableCell>
                <TableCell>{project.projectId}</TableCell>
                {user?.role === "admin" && (
                  <TableCell>
                    <IconButton
                      onClick={() => handleEdit(project)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(project)}
                      color="secondary"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AddProjectForm
        open={openAddForm}
        onClose={() => setOpenAddForm(false)}
        onProjectAdded={fetchProjects}
      />

      {selectedProject && (
        <EditProjectForm
          open={openEditForm}
          onClose={() => setOpenEditForm(false)}
          project={selectedProject}
          onProjectUpdated={fetchProjects}
        />
      )}

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this project?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default withRoleAccess(ProjectList, ["user", "admin"]);
