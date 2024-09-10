import * as React from "react";
import {
  Container,
  Html,
  Tailwind,
  Text,
  Head,
  Body,
  Heading,
} from "@react-email/components";

interface TwoFactorTemplateProps {
  name: string;
  token: string;
}

export default function TwoFactorTemplate({
  name,
  token,
}: TwoFactorTemplateProps) {
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
              To twój kod uwierzytelniania dwuskładnikowego:
            </Text>
            <Text className="text-black">{token}</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
