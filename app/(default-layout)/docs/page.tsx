import React from 'react';
const GoogleDocumentViewer = () => {
  const documentURL = 'https://docs.google.com/document/d/1wyD5pFXpIl0kVHvaZyFnDELNIHgUHLQpRKP66sEOwrg/edit?usp=sharing';
  return (
    <div>
      <iframe src={documentURL} width="100%" height="600px" />
    </div>
  );
};
export default GoogleDocumentViewer;