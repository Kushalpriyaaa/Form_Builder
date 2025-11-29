import React from 'react';
import '../styles/button.css';

export default function Button({ children, variant = 'primary', ...props }) {
  const cls = `btn ${variant === 'secondary' ? 'btn-secondary' : variant === 'danger' ? 'btn-danger' : 'btn-primary'}`;
  return <button className={cls} {...props}>{children}</button>;
}
