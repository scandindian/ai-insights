import React, { useState } from "react";
import styled from "styled-components";
import { MdExpandMore, MdExpandLess } from "react-icons/md";

const CardContainer = styled.div`
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(60, 64, 67, 0.15);
  padding: 1rem 1.5rem;
  margin: 0.75rem 0;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 4px 16px rgba(60, 64, 67, 0.25);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

const Rank = styled.span`
  font-weight: bold;
  color: #1976d2;
  margin-right: 1rem;
`;

const Title = styled.span`
  flex: 1;
  font-size: 1.1rem;
  font-weight: 500;
`;

const SubTitle = styled.span`
  background: #e3f2fd;
  color: #1565c0;
  border-radius: 6px;
  padding: 0.25rem 0.75rem;
  font-weight: 500;
  margin-left: 1rem;
`;

const ExpandIcon = styled.span`
  margin-left: 1rem;
  font-size: 1.5rem;
  color: #888;
`;

const CardDetails = styled.div`
  margin-top: 1rem;
  padding-top: 0.5rem;
  border-top: 1px solid #eee;
  color: #444;
  font-size: 0.95rem;
`;

type CardProps = {
  key: string;
  title: string;
  subtitle: string;
  rank: number;
  details?: React.ReactNode;
};

const Card: React.FC<CardProps> = ({ title, subtitle, rank, details }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <CardContainer>
      <CardHeader onClick={() => details && setExpanded((prev) => !prev)}>
        <Rank>#{rank}</Rank>
        <Title>{title}</Title>
        <SubTitle>{subtitle}</SubTitle>
        {details && (
          <ExpandIcon>
            {expanded ? <MdExpandLess /> : <MdExpandMore />}
          </ExpandIcon>
        )}
      </CardHeader>
      {expanded && details && <CardDetails>{details}</CardDetails>}
    </CardContainer>
  );
};

export default Card;