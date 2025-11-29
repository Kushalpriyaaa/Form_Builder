import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { shouldShowQuestion } from '../utils/conditionalLogic';
import Card from '../components/Card';
import Button from '../components/Button';
import '../styles/formViewer.css';

export default function FormViewer() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/api/forms/${formId}`);
        if (res?.form) setForm(res.form);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [formId]);

  if (!form) return <div className="container"><p>Loading form...</p></div>;

  const handleChange = (key, value) => setAnswers(prev => ({ ...prev, [key]: value }));

  const submit = async () => {
    // validate
    for (const q of form.questions) {
      if (!shouldShowQuestion(q.conditionalRules, answers)) continue;
      if (q.required && (answers[q.questionKey] === undefined || answers[q.questionKey] === null || answers[q.questionKey] === '')) {
        alert(`Please fill ${q.label}`);
        return;
      }
    }
    try {
      await api.post(`/api/forms/${formId}/responses`, { answers });
      alert('Submitted');
      navigate(`/forms/${formId}/responses`);
    } catch (err) {
      console.error(err);
      alert('Submission failed');
    }
  };

  return (
    <div className="page-formviewer container">
      <h1>{form.title}</h1>
      <Card>
        {form.questions.map(q => {
          const visible = shouldShowQuestion(q.conditionalRules, answers);
          if (!visible) return null;
          const val = answers[q.questionKey] ?? (q.type === 'multi_select' ? [] : '');
          return (
            <div className="fv-question" key={q.questionKey}>
              <label className="label">{q.label}{q.required ? ' *' : ''}</label>
              {q.type === 'short_text' && <input value={val} onChange={e => handleChange(q.questionKey, e.target.value)} />}
              {q.type === 'long_text' && <textarea value={val} onChange={e => handleChange(q.questionKey, e.target.value)} />}
              {q.type === 'single_select' &&
                <select value={val} onChange={e => handleChange(q.questionKey, e.target.value)}>
                  <option value="">-- select --</option>
                  {q.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              }
              {q.type === 'multi_select' &&
                <div className="multi-options">
                  {q.options.map(o => {
                    const checked = Array.isArray(val) ? val.includes(o) : false;
                    return <label key={o}><input type="checkbox" checked={checked} onChange={e => {
                      const prev = Array.isArray(val) ? [...val] : [];
                      if (e.target.checked) prev.push(o); else prev.splice(prev.indexOf(o), 1);
                      handleChange(q.questionKey, prev);
                    }} /> {o}</label>;
                  })}
                </div>
              }
              {q.type === 'attachment' &&
                <input value={val} placeholder="Attachment URL" onChange={e => handleChange(q.questionKey, e.target.value)} />
              }
            </div>
          );
        })}
        <div style={{ marginTop: 12 }}>
          <Button onClick={submit}>Submit</Button>
        </div>
      </Card>
    </div>
  );
}
