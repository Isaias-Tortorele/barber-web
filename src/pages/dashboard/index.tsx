import { useState } from "react";
import Head from "next/head";
import {
  Flex,
  Text,
  Heading,
  Button,
  Link as ChakraLink,
  useMediaQuery,
  useDisclosure,
  filter,
} from "@chakra-ui/react";
import Link from "next/link";
import { IoMdPerson } from "react-icons/io";

import { canSSRAuth } from "../../utils/canSSRAuth";
import { Sidebar } from "../../components/sidebar";
import { setupAPIClient } from "../../services/api";
import { ModalInfo } from "../../components/modal";

export interface ScheduleItem {
  id: string;
  customer: string;
  haircut: {
    id: string;
    name: string;
    price: string | number;
    user_id: string;
  };
}

interface DashboardProps {
  schedule: ScheduleItem[];
}

export default function Dashboard({ schedule }: DashboardProps) {
  const [list, setList] = useState(schedule);
  const [service, setService] = useState<ScheduleItem>();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isMobile] = useMediaQuery("(max-width: 500px)");

  function handleOpenModal(item: ScheduleItem) {
    setService(item);
    onOpen();
  }

  async function handleFinish(id: string) {
    try {
      const apiClient = setupAPIClient();
      await apiClient.delete("schedule", {
        params: {
          schedule_id: id,
        },
      });

      const filterItem = list.filter((item) => {
        return item?.id !== id;
      });

      setList(filterItem);
      onClose();
    } catch (error) {
      console.log(error);
      onClose();
      alert("erro ao finalizar serviço");
    }
  }

  return (
    <>
      <Head>
        <title>BarberPro- Minha barbearia</title>
      </Head>

      <Sidebar>
        <Flex
          direction={"column"}
          alignItems={"flex-start"}
          justifyContent={"flex-start"}
        >
          <Flex
            w={"100%"}
            direction={"row"}
            align={"center"}
            justify={"flex-start"}
          >
            <Heading fontSize={"3xl"} mt={4} mb={4} mr={4}>
              Agenda
            </Heading>

            <Link href={"/new"}>
              <Button
                bg={"gray.400"}
                color={"#FFF"}
                _hover={{ bg: "gray.700" }}
              >
                Registrar
              </Button>
            </Link>
          </Flex>

          {list.map((item) => (
            <ChakraLink
              onClick={() => handleOpenModal(item)}
              w={"100%"}
              m={0}
              p={0}
              mt={1}
              bg={"transparent"}
              style={{ textDecoration: "none" }}
              key={item?.id}
            >
              <Flex
                w={"100%"}
                direction={isMobile ? "column" : "row"}
                p={4}
                rounded={4}
                mb={2}
                bg={"barber.400"}
                justify={"space-between"}
                align={isMobile ? "flex-start" : "center"}
              >
                <Flex
                  direction={"row"}
                  mb={isMobile ? 2 : 0}
                  align={"center"}
                  justify={"center"}
                >
                  <IoMdPerson size={28} color="#FFF" />
                  <Text fontWeight={"bold"} ml={4} noOfLines={2}>
                    {item?.customer}
                  </Text>
                </Flex>

                <Text fontWeight={"bold"} mb={isMobile ? 2 : 0}>
                  {item?.haircut?.name}
                </Text>
                <Text fontWeight={"bold"} mb={isMobile ? 2 : 0}>
                  {item?.haircut?.price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </Text>
              </Flex>
            </ChakraLink>
          ))}
        </Flex>
      </Sidebar>

      <ModalInfo
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        data={service}
        finishService={() => handleFinish(service?.id)}
      />
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/schedule");

    return {
      props: {
        schedule: response.data,
      },
    };
  } catch (error) {
    console.log(error + " Erro");
    return {
      props: {
        schedule: [],
      },
    };
  }
});
