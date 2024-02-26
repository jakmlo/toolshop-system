import * as React from "react";
import {
  Container,
  Link,
  Html,
  Tailwind,
  Text,
  Head,
  Body,
  Heading,
} from "@react-email/components";

interface ResetPasswordTemplateProps {
  name: string;
  url: string;
}

export default function ResetPasswordTemplate({
  name,
  url,
}: ResetPasswordTemplateProps) {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Heading className="text-3xl text-black">
              Cześć <strong>{name}</strong>
            </Heading>
            <Text className="text-lg text-black">
              Otrzymaliśmy prośbę o zmianę hasła.
            </Text>
            <Text className="text-black">
              Aby zresetować hasło kliknij w poniższy link.
            </Text>
            <Link
              className="w-full rounded-md bg-white py-2 text-center text-purple-500"
              href={url}
            >
              Zresetuj hasło
            </Link>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
