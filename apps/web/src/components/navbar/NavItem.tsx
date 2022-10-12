import { Box, Flex, Icon } from "@chakra-ui/react";
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
    <Flex
      w="full"
      justify={children ? "start" : "center"}
      p="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      _hover={{
        bg: "purple.800",
        color: "white",
      }}
      onClick={() => {
        if (setView) setView(item.id);
      }}
      {...rest}
    >
      {item.icon && (
        <Icon
          boxSize="25px"
          fontSize="16"
          _groupHover={{
            color: "white",
          }}
          as={item.icon}
        />
      )}

      <Box ml="4px">{children}</Box>
    </Flex>
  );
};
