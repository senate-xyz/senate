import { Flex, FlexProps, Icon } from "@chakra-ui/react";

import { LinkItemSPAProps, Pages } from "../../types";

interface NavItemProps extends FlexProps {
  item: LinkItemSPAProps;
  setPage: (name: Pages) => void;
  children?: string;
}

export const NavItemSPA = ({
  item,
  setPage,
  children,
  ...rest
}: NavItemProps) => {
  return (
    <Flex
      align="center"
      p="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      _hover={{
        bg: "red.400",
        color: "white",
      }}
      onClick={() => {
        setPage(item.id);
      }}
      {...rest}
    >
      {item.icon && (
        <Icon
          mr="4"
          fontSize="16"
          _groupHover={{
            color: "white",
          }}
          as={item.icon}
        />
      )}
      {children}
    </Flex>
  );
};
