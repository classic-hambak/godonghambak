import type { NavigationRoutes } from '~types/navigation';
import type { UnderlineAnimation } from '~types/animation';

import Link from 'next/link';
import styled from 'styled-components';

import DownArrowSVG from '~public/svgs/down-arrow.svg';

import { useToggle, useStopAnimationOnResize } from '~hooks/index';
import { underlineAnimation } from '~styles/animation';
import { pixelToRem } from '~utils/style-utils';

interface NavItemProps {
  text: string;
  href: string;
  subRoutes: Omit<NavigationRoutes, 'subRoutes'>[];
  isActive: boolean;
}

const NavItem = ({ text, href, subRoutes, isActive }: NavItemProps) => {
  const [isOpen, toggle] = useToggle();
  const { ref, isOnResize } = useStopAnimationOnResize<HTMLUListElement>();

  return (
    <>
      <Link href={href} passHref>
        <Item
          href="replace"
          color="#fdc47c"
          height={4}
          bottom={0}
          isActive={isActive}
          isOpen={isOpen}
          onClick={toggle}
        >
          {text}
          <DownArrowSVG width={18} height={14} />
        </Item>
      </Link>
      <SubList ref={ref} isOpen={isOpen} isOnResize={isOnResize}>
        {subRoutes.map(({ text: subText, href: subHref }) => (
          <li key={subText}>
            <Link href={subHref} passHref>
              <a href="replace" aria-label={subText}>
                {subText}
              </a>
            </Link>
          </li>
        ))}
      </SubList>
    </>
  );
};

// prettier-ignore
const Item = styled.a<{ isActive: boolean; isOpen: boolean } & UnderlineAnimation>`
  position: relative;
  padding: ${pixelToRem(32)} 0;
  font-weight: 600;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme, isActive }) =>
    isActive ? theme.colors.yellow : theme.colors.dark};

  &:hover + ul {
    opacity: 1;
    visibility: visible;
  }

  &:before {
    content: '';
    position: absolute;
    bottom: -${pixelToRem(16)};
    width: 100%;
    padding: ${pixelToRem(8)};
  }

  ${underlineAnimation};

  svg {
    display: none;
  }

  @media ${({ theme }) => theme.breakPoints.large} {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${pixelToRem(8)};

    &:before,
    &:after {
      display: none;
    }

    &:hover + ul {
      opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
      visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
    }

    svg {
      display: inline-block;
      color: ${({ theme }) => theme.colors.dark};
      transform: ${({ isOpen }) => isOpen && `rotate(180deg)`};
      transition: transform 200ms linear;
    }
  }
`;

const SubList = styled.ul<{ isOpen: boolean; isOnResize: boolean }>`
  position: absolute;
  top: ${pixelToRem(100)};
  left: -${pixelToRem(24)};
  width: fit-content;
  padding: ${pixelToRem(16)};
  padding-right: ${pixelToRem(32)};
  border-radius: ${pixelToRem(10)};
  background-color: ${({ theme }) => theme.colors.light};
  font-weight: 500;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: ${({ isOnResize }) =>
    isOnResize ? 'none' : 'all 400ms ease-in-out'};
  visibility: hidden;
  opacity: 0;
  z-index: 1010;

  &:hover {
    opacity: 1;
    visibility: visible;
  }

  a {
    display: inline-block;
    font-size: 16px;
    white-space: nowrap;
    padding: ${pixelToRem(12)};

    &:hover {
      color: ${({ theme }) => theme.colors.yellow};
    }
  }

  @media ${({ theme }) => theme.breakPoints.large} {
    position: unset;
    max-height: ${({ isOpen }) => (isOpen ? pixelToRem(500) : 0)};
    border-radius: none;
    box-shadow: none;
    opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
    visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  }
`;

export default NavItem;
