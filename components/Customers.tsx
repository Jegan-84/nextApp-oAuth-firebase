import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/Customers.module.scss";
import CustomerForm from "./CustomersForm";
import { auth } from "../lib/firebase";

interface Customer {
  id: string;
  name: string;
  email: string;
  status: string;
}

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await axios.get("/api/customers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomers(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
      setCustomers([]);
      setLoading(false);
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      await axios.delete(`/api/customers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomers(customers.filter((customer) => customer.id !== id));
    } catch (err) {
      setError("Failed to delete customer");
    }
  };

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setIsFormOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (customer: Customer) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      if (editingCustomer) {
        // Edit existing customer
        const response = await axios.put(
          `/api/customers/${editingCustomer.id}`,
          customer,
          { headers }
        );
        setCustomers(
          customers.map((c) =>
            c.id === editingCustomer.id ? response.data : c
          )
        );
      } else {
        // Add new customer
        const response = await axios.post("/api/customers", customer, {
          headers,
        });
        setCustomers([...customers, response.data]);
      }
      setIsFormOpen(false);
      setEditingCustomer(null);
    } catch (err) {
      setError("Failed to save customer");
      console.error("Error saving customer:", err);
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Customers</h1>
      <button className={styles.addButton} onClick={handleAddCustomer}>
        Add Customer
      </button>
      {isFormOpen && (
        <CustomerForm
          customer={editingCustomer}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
      {customers.length === 0 ? (
        <div className={styles.noData}>
          No customers found. Click "Add Customer" to create one.
        </div>
      ) : (
        <div className={styles.customerList}>
          {customers.map((customer) => (
            <div key={customer.id} className={styles.customerCard}>
              <h2 className={styles.customerName}>{customer.name}</h2>
              <p className={styles.customerEmail}>{customer.email}</p>
              <p className={styles.customerStatus}>Status: {customer.status}</p>
              <div className={styles.actions}>
                <button
                  className={styles.editButton}
                  onClick={() => handleEditCustomer(customer)}
                >
                  Edit
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => deleteCustomer(customer.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default Customers;
