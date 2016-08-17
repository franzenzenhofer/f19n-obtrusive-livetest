import React from 'react';
import ResultList from './ResultList';
import Footer from './Footer';

export default function Panel(props) {
  const { onClosePanelRequest, storeKey, results, url } = props;
  return (
    <div>
      <ResultList onClosePanelRequest={onClosePanelRequest} storeKey={storeKey} results={results} />
      <Footer url={url} />
    </div>
  );
}
