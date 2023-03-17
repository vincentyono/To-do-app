import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface linkToProps {
  className?: string;
  children?: string;
  path: string;
}

const linkTo = ({ className, children, path }: linkToProps) => {
  return (
    <Link to={path} className={className}>
      {children}
    </Link>
  );
};

export const LinkTo = styled(linkTo)`
  color: #5c56c0;
`;
