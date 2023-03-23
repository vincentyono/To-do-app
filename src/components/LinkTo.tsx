import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface linkToProps {
  style?: object;
  children?: string;
  path: string;
}

const linkTo = ({ style, children, path }: linkToProps) => {
  return (
    <Link to={path} style={style}>
      {children}
    </Link>
  );
};

export const LinkTo = styled(linkTo)`
  color: #5c56c0;
`;
