import React from 'react';

const viewSource = () => {
  return 'view-source:';
}

export default function Panel(props) {
  const {url} = props;
  return (
    <footer>
      <a href={`view-source:${url}`} target="_top">view-source</a>
    </footer>
  );
}
