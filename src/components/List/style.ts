import styled from "styled-components";
import { device, size } from "../../styles";

export const ListContainer = styled.section`
  overflow-y: auto;
  max-height: 50%;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-right: 6px;

  @media ${device.mobileL} {
    max-height: 60%;
  }

  @media (min-width: ${size.tablet}) and (max-width: 1023px) {
    max-height: 40%;
  }

  @media ${device.desktopL} {
    max-height: 70%;
  }

  ::-webkit-scrollbar {
    width: 0.5em;
    border-radius: 9px;
  }
  ::-webkit-scrollbar-track {
    background-color: #E4E4E4;
    border-radius: 9px;
  }
  ::-webkit-scrollbar-thumb {
  background-color: #848484;
  border-radius: 9px;
`
;

export const DisabledInput = styled.p`
  background-color: #f7f7f8;
  border: 1px solid #dbdbdb;
  border-radius: 4px;
  font-size: 16px;
  padding: 1rem 1.2rem;
  height: 48px;
  width: 100%;
  margin: 0;
  box-sizing: border-box;
  cursor: pointer;
`;