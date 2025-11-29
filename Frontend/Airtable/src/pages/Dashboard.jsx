import React from 'react';
import Card from '../components/Card';
import '../styles/dashboard.css';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="page-dashboard container">
      <h1>Dashboard</h1>
      <div className="grid-2">
        <Card title="Create Form">
          <p>Create a new form from Airtable base and tables.</p>
          <Link to="/builder" className="btn">Open Builder</Link>
        </Card>

        <Card title="Responses">
          <p>View all form responses stored in the database.</p>
          <Link to="/forms" className="btn">View Responses</Link>
        </Card>
      </div>
    </div>
  );
}
