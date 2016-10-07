import React from 'react';

const viewSource = () => {
  return 'view-source:';
}
//<a href={`view-source:${url}`} target="_blank" title="View source"><button>vs</button></a>
export default function Panel(props) {
  const {url} = props;
  return (
    <footer>
      <a href={`${url}`} target="_top" title="Reload"><button>↻</button></a>
      <a href={`https://developers.google.com/speed/pagespeed/insights/?hl=en&url=${url}`} target="_blank" title="Page Speed Insights"><button>Psi</button></a>
      <a href={`https://www.google.com/webmasters/tools/mobile-friendly/?hl=en&url=${url}`} target="_blank" title="Mobile Friendly Test"><button>Mf</button></a>
      <a href={`https://search.google.com/structured-data/testing-tool?hl=en&url=${url}`} target="_blank" title="Structured Data Testing Tool"><button>Sd</button></a>
      <a href={`https://developers.facebook.com/tools/debug/sharing/?q=${url}`} target="_blank" title="Facebook Debugger"><button>Fbd</button></a>
    </footer>
  );
}
