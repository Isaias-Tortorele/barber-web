import Head from "next/head";
import { Flex, Button, Heading, Text, useMediaQuery } from "@chakra-ui/react";

import { Sidebar } from "../../components/sidebar";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { setupAPIClient } from "../../services/api";
import { getSripeJs } from "../../services/stripe-js";

interface PlanosProps {
  premium: boolean;
}

export default function Planos({ premium }: PlanosProps) {
  const [isMobile] = useMediaQuery("(max-width: 500px)");

  const handleSubscribe = async () => {
    if (premium) {
      return;
    }

    try {
      const apiClient = setupAPIClient();
      const response = await apiClient.post("/subscribe");

      const { sessionId } = response.data;

      const stripe = await getSripeJs();
      await stripe.redirectToCheckout({ sessionId: sessionId });
    } catch (error) {
      console.error(error);
    }
  };

  async function handleCreatePortal() {
    try {
      if (!premium) {
        return;
      }

      const apiClient = setupAPIClient();
      const response = await apiClient.post("/create-portal");

      const { sessionId } = response.data;

      window.location.href = sessionId;
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <>
      <Head>
        <title>BarberPRO - Sua assinatura</title>
      </Head>

      <Sidebar>
        <Flex
          direction={"column"}
          align={"flex-start"}
          justify={"flex-start"}
          w={"100%"}
        >
          <Heading fontSize={"3xl"} mt={4} mb={4} mr={4} color={"#FFF"}>
            Planos
          </Heading>

          <Flex
            pb={8}
            maxW={"780px"}
            w={"100%"}
            direction={"column"}
            align={"flex-start"}
            justify={"flex-start"}
          >
            <Flex
              w={"100%"}
              gap={4}
              flexDirection={isMobile ? "column" : "row"}
            >
              <Flex
                rounded={4}
                p={2}
                flex={1}
                bg={"barber.400"}
                flexDirection={"column"}
              >
                <Heading
                  textAlign={"center"}
                  fontSize={"2xl"}
                  mt={2}
                  mb={4}
                  color={"gray.100"}
                >
                  Plano Grátis
                </Heading>
                <Text fontWeight={"medium"} ml={4} mb={2}>
                  • Registrar cortes
                </Text>
                <Text fontWeight={"medium"} ml={4} mb={2}>
                  • Criar apenas 3 modelos de corte
                </Text>
                <Text fontWeight={"medium"} ml={4} mb={2}>
                  • Editar dados do perfil
                </Text>
              </Flex>

              <Flex
                rounded={4}
                p={2}
                flex={1}
                bg={"barber.400"}
                flexDirection={"column"}
              >
                <Heading
                  textAlign={"center"}
                  fontSize={"2xl"}
                  mt={2}
                  mb={4}
                  color={"#31FB6A"}
                >
                  Premiun
                </Heading>
                <Text fontWeight={"medium"} ml={4} mb={2}>
                  • Registrar cortes ilimitados
                </Text>
                <Text fontWeight={"medium"} ml={4} mb={2}>
                  • Criar modelos ilimitados
                </Text>
                <Text fontWeight={"medium"} ml={4} mb={2}>
                  • Editar modelos de cortes
                </Text>
                <Text fontWeight={"medium"} ml={4} mb={2}>
                  • Editar dados do perfil
                </Text>
                <Text fontWeight={"medium"} ml={4} mb={2}>
                  • Receber todas atualizações do sistema
                </Text>
                <Text
                  fontWeight={"bold"}
                  fontSize={"2xl"}
                  ml={4}
                  mb={2}
                  color={"#31FB6A"}
                >
                  R$ 9.99
                </Text>

                <Button
                  bg={premium ? "transparet" : "button.cta"}
                  m={2}
                  color={"#FFF"}
                  onClick={handleSubscribe}
                  _hover={{ bg: "#D2d2d2", color: "barber.900" }}
                  isDisabled={premium}
                >
                  {premium ? "Você já é premium" : "Assinar Plano"}
                </Button>

                {premium && (
                  <Button
                    m={2}
                    bg={"#FFF"}
                    color={"barber.900"}
                    fontWeight={"bold"}
                    onClick={handleCreatePortal}
                    fontSize={12}
                  >
                    {" "}
                    ALTERAR ASSINATURA
                  </Button>
                )}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Sidebar>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("me", {});

    return {
      props: {
        premium:
          response.data?.subscriptions?.status === "active" ? true : false,
      },
    };
  } catch (error) {
    console.log(error);

    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
});
