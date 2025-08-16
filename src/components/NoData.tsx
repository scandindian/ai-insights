import React from "react";
import styled from "styled-components";

const NoDataWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  color: #888;
  font-size: 1.2rem;
`;

const NoData: React.FC<{ message?: string }> = ({ message }) => (
  <NoDataWrapper>
    <span role="img" aria-label="no data" style={{ fontSize: "2rem" }}>📭</span>
    <div>{message || "No data available for the selected filter."}</div>
  </NoDataWrapper>
);

export default NoData;