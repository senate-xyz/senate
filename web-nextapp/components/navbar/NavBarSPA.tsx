import { Flex, FlexProps, Icon } from "@chakra-ui/react";
import { FiHome, FiList } from "react-icons/fi";

import { LinkItemSPAProps, Pages } from "../../../types";

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
      {item.icon == 1 && (
        <Icon
          mr="4"
          fontSize="16"
          _groupHover={{
            color: "white",
          }}
          as={FiHome}
        />
      )}
      {item.icon == 2 && (
        <Icon
          mr="4"
          fontSize="16"
          _groupHover={{
            color: "white",
          }}
          as={FiList}
        />
      )}
      {children}
    </Flex>
  );
};
