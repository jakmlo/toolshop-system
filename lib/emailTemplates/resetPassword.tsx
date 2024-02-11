import * as React from "react";
import {
  Container,
  Link,
  Html,
  Tailwind,
  Text,
  Head,
  Body,
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
        <Body>
          <Container className="mx-auto w-full max-w-lg rounded-lg border bg-card bg-gradient-to-br from-purple-500 to-pink-500 text-card-foreground shadow-lg">
            <Text className="text-3xl font-bold text-white">Cześć {name}</Text>
            <Text className="text-lg text-gray-300 dark:text-gray-400">
              Otrzymaliśmy prośbę o zmianę hasła.
            </Text>
            <Text className="text-white">
              Aby zresetować hasło kliknij w poniższy link.
            </Text>
            <Link
              className="w-full rounded-md bg-white py-2 text-center text-purple-500 hover:bg-purple-100 hover:text-purple-700"
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
