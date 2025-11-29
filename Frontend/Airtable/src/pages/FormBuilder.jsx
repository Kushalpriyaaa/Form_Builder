import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import Card from '../components/Card';
import Button from '../components/Button';
import '../styles/formBuilder.css';

const emptyQuestion = () => ({
  questionKey: `q_${Math.random().toString(36).slice(2, 8)}`,
  airtableFieldId: '',
  label: '',
  type: 'short_text',
  required: false,
  options: [],
  conditionalRules: null
});

export default function FormBuilder() {
  const { formId } = useParams();
  const [title, setTitle] = useState('');
  const [baseId, setBaseId] = useState('');
  const [tableId, setTableId] = useState('');
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [, setLoading] = useState(false);

  useEffect(() => {
    if (!formId) return;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/forms/${formId}`);
        if (res?.form) {
          setTitle(res.form.title || '');
          setBaseId(res.form.airtableBaseId || '');
          setTableId(res.form.airtableTableId || '');
          setQuestions(res.form.questions || []);
        }
      } catch (err) {
        console.error(err);
      } finally { setLoading(false); }
    })();
  }, [formId]);

  const addQuestion = () => setQuestions(prev => [...prev, emptyQuestion()]);
  const updateQuestion = (idx, patch) => setQuestions(prev => {
    const arr = [...prev]; arr[idx] = { ...arr[idx], ...patch }; return arr;
  });
  const removeQuestion = (idx) => setQuestions(prev => prev.filter((_, i) => i !== idx));

  const saveForm = async () => {
    try {
      const payload = { title, airtableBaseId: baseId, airtableTableId: tableId, airtableTableName: tableId, questions };
      if (formId) {
        await api.put(`/api/forms/${formId}`, payload);
        alert('Form updated');
      } else {
        const res = await api.post('/api/forms', payload);
        alert('Form created');
        // redirect to builder with new id
        window.location.href = `/builder/${res.form._id}`;
      }
    } catch (err) {
      console.error(err);
      alert('Save error: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="page-formbuilder container">
      <h1>Form Builder</h1>
      <Card>
        <div className="input-group">
          <label className="label">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="input-row">
          <div className="input-col">
            <label className="label">Airtable Base ID</label>
            <input value={baseId} onChange={(e) => setBaseId(e.target.value)} />
          </div>
          <div className="input-col">
            <label className="label">Table ID/Name</label>
            <input value={tableId} onChange={(e) => setTableId(e.target.value)} />
          </div>
        </div>

        <h3>Questions</h3>
        {questions.map((q, i) => (
          <div key={q.questionKey} className="question-card">
            <div className="input-row">
              <div className="input-col">
                <label className="label">Label</label>
                <input value={q.label} onChange={(e) => updateQuestion(i, { label: e.target.value })} />
              </div>

              <div className="input-col">
                <label className="label">Question Key</label>
                <input value={q.questionKey} onChange={(e) => updateQuestion(i, { questionKey: e.target.value })} />
              </div>
            </div>

            <div className="input-row">
              <div className="input-col">
                <label className="label">Type</label>
                <select value={q.type} onChange={(e) => updateQuestion(i, { type: e.target.value })}>
                  <option value="short_text">Short text</option>
                  <option value="long_text">Long text</option>
                  <option value="single_select">Single select</option>
                  <option value="multi_select">Multi select</option>
                  <option value="attachment">Attachment</option>
                </select>
              </div>

              <div className="input-col">
                <label className="label">Required</label>
                <input type="checkbox" checked={q.required} onChange={(e) => updateQuestion(i, { required: e.target.checked })} />
              </div>
            </div>

            {(q.type === 'single_select' || q.type === 'multi_select') && (
              <div className="input-group">
                <label className="label">Options (comma separated)</label>
                <input value={q.options.join(',')} onChange={(e) => updateQuestion(i, { options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
              </div>
            )}

            <div className="input-group">
              <label className="label">Conditional Rules (JSON)</label>
              <textarea value={q.conditionalRules ? JSON.stringify(q.conditionalRules) : ''} onChange={(e) => {
                try {
                  const parsed = e.target.value ? JSON.parse(e.target.value) : null;
                  updateQuestion(i, { conditionalRules: parsed });
                } catch { /* ignore until valid */ }
              }} />
              <small className="muted">Example: {"{ \"logic\":\"AND\", \"conditions\":[{\"questionKey\":\"role\",\"operator\":\"equals\",\"value\":\"Engineer\"}] }"}</small>
            </div>

            <div className="question-actions">
              <Button variant="secondary" onClick={() => removeQuestion(i)}>Remove</Button>
            </div>
          </div>
        ))}

        <div className="builder-actions">
          <Button onClick={addQuestion}>Add Question</Button>
          <Button variant="primary" onClick={saveForm}>Save Form</Button>
        </div>
      </Card>
    </div>
  );
}
