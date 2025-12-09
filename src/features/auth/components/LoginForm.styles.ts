import styled from "styled-components";

export const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(
    to bottom right,
    var(--slate-900),
    var(--slate-800),
    var(--slate-900)
  );
  color: white;
`;

export const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  padding: 3rem 1.5rem;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;

  @media (min-width: 1024px) {
    flex-direction: row;
    gap: 5rem;
    padding: 3rem 3rem;
    align-items: center;
  }
`;


export const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 36rem;
  margin: 0 auto 3rem auto;

  @media (min-width: 1024px) {
    margin: 0;
  }
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
`;

export const BrandIcon = styled.div`
  background: linear-gradient(
    to bottom right,
    var(--primary),
    var(--primary-dark)
  );
  padding: 0.75rem;
  border-radius: 0.75rem;

  span {
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
  }
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  line-height: 1.2;
  margin-bottom: 1rem;

  span {
    color: var(--primary);
  }

  @media (min-width: 640px) {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
  }

  @media (min-width: 1024px) {
    font-size: 3rem;
  }
`;

export const Description = styled.p`
  font-size: 1rem;
  color: var(--text-light);
  margin-bottom: 1.5rem;

  @media (min-width: 640px) {
    font-size: 1.125rem;
    margin-bottom: 2rem;
  }
`;

export const Stats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const StatItem = styled.div<{ color?: string }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ color }) => color || "var(--text-light)"};

  span {
    font-size: 0.875rem;
    font-weight: 500;
  }
`;

export const RightSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 28rem;
  margin: 0 auto;

  @media (min-width: 1024px) {
    margin: 0;
  }
`;

export const Card = styled.div`
  width: 100%;
  background: var(--card-bg);
  backdrop-filter: blur(12px);
  border: 1px solid var(--card-border);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);

  @media (min-width: 640px) {
    padding: 2rem;
  }

  @media (min-width: 1024px) {
    padding: 2.5rem;
  }

  h2 {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 0.5rem;

    @media (min-width: 640px) {
      font-size: 1.5rem;
    }
  }

  p {
    font-size: 0.875rem;
    color: var(--text-muted);
    margin-bottom: 1.5rem;

    @media (min-width: 640px) {
      font-size: 1rem;
      margin-bottom: 1.75rem;
    }
  }
`;

export const TextDemo = styled.p`
    margin-bottom: 0 !important;
    font-size: 0.8rem !important;
    text-align: center;
    color: var(--text-opacity) !important;
`;