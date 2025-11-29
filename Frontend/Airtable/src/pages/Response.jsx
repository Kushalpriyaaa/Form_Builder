import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import Card from '../components/Card';
import '../styles/responses.css';

export default function Responses() {
  const { formId } = useParams();
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/api/forms/${formId}/responses`);
        setResponses(res.responses || []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [formId]);

  return (
    <div className="page-responses container">
      <h1>Responses</h1>
      {responses.length === 0 ? <p>No responses yet.</p> : responses.map(r => (
        <Card key={r._id}>
          <div className="response-meta">
            <strong>{new Date(r.createdAt).toLocaleString()}</strong>
            <span className="muted"> status: {r.status}</span>
          </div>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(r.answers, null, 2)}</pre>
        </Card>
      ))}
    </div>
  );
}
