import React, { createContext, useContext, useState } from 'react';

const DragContext = createContext({
  draggingProduct: null,
  setDraggingProduct: () => {},
  drawTool: null,
  setDrawTool: () => {},
});

export const DragProvider = ({ children }) => {
  const [draggingProduct, setDraggingProduct] = useState(null);
  const [drawTool, setDrawTool] = useState(null);

  return (
    <DragContext.Provider value={{ draggingProduct, setDraggingProduct, drawTool, setDrawTool }}>
      {children}
    </DragContext.Provider>
  );
};

export const useDrag = () => useContext(DragContext);