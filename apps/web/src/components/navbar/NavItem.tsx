import { IconType } from "react-icons";
import { ViewsEnum } from "./NavBar";

export interface NavItemProps {
  name: string;
  id: ViewsEnum;
  icon: IconType;
}

export const NavItem = ({
  item,
  children,
  setView,
  ...rest
}: {
  item: NavItemProps;
  setView?: (name: number) => void;
  children?: string;
}) => {
  return (
    <div
      onClick={() => {
        if (setView) setView(item.id);
      }}
      {...rest}
    >
      <div>{children}</div>
    </div>
  );
};
