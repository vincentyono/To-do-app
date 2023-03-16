import styled from 'styled-components';

interface HeaderProps {
  children: string;
}

const Container = styled.header`
  margin-block: 2em;
`;

const Title = styled.h1`
  font-size: 2rem;
  text-align: center;
  font-family: 'Poppins', sans-serif;
  font-weight: 900;
  color: #3f3d56;
`;

export default function Header({ children }: HeaderProps) {
  return (
    <Container>
      <Title>{children}</Title>
    </Container>
  );
}
