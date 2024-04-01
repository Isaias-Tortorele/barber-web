import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Button,
  Flex,
} from "@chakra-ui/react";

import { FiUser, FiScissors } from "react-icons/fi";
import { FaMoneyBillAlt } from "react-icons/fa";
import { ScheduleItem } from "../../pages/dashboard";

interface ModaInfoProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  data: ScheduleItem;
  finishService: () => Promise<void>;
}

export function ModalInfo({
  isOpen,
  onOpen,
  onClose,
  data,
  finishService,
}: ModaInfoProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={"barber.900"}>
        <ModalHeader>Próximo</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex align={"center"} mb={3}>
            <FiUser size={28} color="#FFB13E" />
            <Text ml={3} fontSize={"1xl"} fontWeight={"bold"} color={"#FFF"}>
              {data?.customer}
            </Text>
          </Flex>

          <Flex align={"center"} mb={3}>
            <FiScissors size={28} color="#FFF" />
            <Text ml={3} fontSize={"1xl"} fontWeight={"bold"} color={"#FFF"}>
              {data?.haircut?.name}
            </Text>
          </Flex>

          <Flex align={"center"} mb={3}>
            <FaMoneyBillAlt size={28} color="#FFF" />
            <Text ml={3} fontSize={"1xl"} fontWeight={"bold"} color={"#FFF"}>
              {data?.haircut?.price.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </Text>
          </Flex>

          <ModalFooter>
            <Button
              bg={"button.cta"}
              mr={3}
              _hover={{ bg: "#FFb13E " }}
              color={"#FFF"}
              onClick={() => finishService()}
            >
              Finalizar serviço
            </Button>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
