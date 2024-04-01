import { useState, ChangeEvent } from "react";

import Head from "next/head";
import { Sidebar } from "../../components/sidebar";

import { Flex, Heading, Text, Button, Input, Select } from "@chakra-ui/react";

import { canSSRAuth } from "../../utils/canSSRAuth";
import { setupAPIClient } from "../../services/api";
import { useRouter } from "next/router";
import { FiChevronLeft } from "react-icons/fi";
import Link from "next/link";

interface HaircutProps {
  id: string;
  name: string;
  price: string | number;
  status: boolean;
  user_id: string;
}
interface NewProps {
  haircuts: HaircutProps[];
}

export default function New({ haircuts }: NewProps) {
  const [customer, setCustomer] = useState("");
  const [haircutSelected, setHaircutSelected] = useState(haircuts[0]);
  const router = useRouter();

  function handleChangeSelect(id: string) {
    const haircutItem = haircuts.find((item) => item.id === id);

    setHaircutSelected(haircutItem);
  }

  async function handleRegister() {
    if (customer === "") {
      return;
    }

    try {
      const apiClient = setupAPIClient();
      await apiClient.post("/schedule", {
        customer: customer,
        haircut_id: haircutSelected?.id,
      });

      router.push("/dashboard");
    } catch (error) {
      console.log(error);
      alert("erro ao registrar");
    }
  }

  return (
    <>
      <Head>
        <title>BarberPRO - Novo agentamento</title>
      </Head>

      <Sidebar>
        <Flex direction={"column"} align={"flex-start"} justify={"flex-start"}>
          <Link href={"/dashboard"}>
            <Button
              p={4}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              mr={3}
              bg={"gray.400"}
              color={"#FFF"}
              _hover={{ bg: "gray.700" }}
            >
              <FiChevronLeft size={24} color="#FFF" />
              Voltar
            </Button>
          </Link>
          <Flex
            direction={"row"}
            w={"100%"}
            align={"center"}
            justify={"flex-start"}
          >
            <Heading fontSize={"3xl"} mt={4} mb={4} mr={4}>
              Novo corte
            </Heading>
          </Flex>

          <Flex
            maxW={"700px"}
            pt={8}
            pb={8}
            width={"100%"}
            direction={"column"}
            align={"center"}
            justify={"center"}
            bg={"barber.400"}
          >
            <Input
              placeholder="Nome do cliente"
              w={"85%"}
              mb={3}
              size={"lg"}
              type="text"
              bg={"barber.900"}
              value={customer}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setCustomer(e.target.value)
              }
            />
            <Select
              bg={"barber.900"}
              mb={3}
              size={"lg"}
              w={"85%"}
              onChange={(e) => handleChangeSelect(e.target.value)}
            >
              {haircuts?.map((item) => (
                <option
                  style={{ backgroundColor: "#D2d2d2", color: "#000" }}
                  key={item?.id}
                  value={item?.id}
                >
                  {item?.name}
                </option>
              ))}
            </Select>

            <Button
              w={"85%"}
              size={"lg"}
              color={"gray.900"}
              bg={"button.cta"}
              _hover={{ bg: "#FFB13E" }}
              onClick={handleRegister}
            >
              Cadastrar
            </Button>
          </Flex>
        </Flex>
      </Sidebar>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/haircuts", {
      params: {
        status: true,
      },
    });

    if (response.data === null) {
      return {
        redirect: {
          destination: "dashboard",
          permanent: false,
        },
      };
    }

    return {
      props: {
        haircuts: response.data,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "dashboard",
        permanent: false,
      },
    };
  }
});
