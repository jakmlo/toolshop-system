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

interface ActivationTemplateProps {
  name: string;
  url: string;
}

export default function ActivationTemplate({
  name,
  url,
}: ActivationTemplateProps) {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Cześć <strong>{name}</strong>
            </Heading>
            <Text key={2} className="text-[14px] leading-[24px] text-black">
              Witamy w Toolshop System!
            </Text>
            <Text key={3} className="text-[14px] leading-[24px] text-black">
              Aby zakończyć proces, kliknij poniższy link aktywacyjny.
            </Text>
            <Link key={4} href={url} className="text-blue-600 no-underline">
              Aktywuj konto
            </Link>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
