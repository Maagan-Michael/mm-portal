import React from 'react';
import Logo from './logo';

const TitleBar = () => {
  return (
    <header className="title-bar">
      <div style={{ display: "flex", verticalAlign: "bottom" }}>
        <Logo />
        <h1 style={{ marginLeft: "5px", display: "inline-block", alignSelf: "flex-end" }}>Maagan Michal Portal</h1>
      </div>
    </header>
  );
};

export default TitleBar;