import { z } from "zod";

export const RegisterUserSchema = z
  .object({
    name: z
      .string({
        required_error: "Nazwa użytkownika jest wymagana",
      })
      .min(1, "Nazwa użytkownika jest wymagana"),
    email: z
      .string({
        required_error: "Adres e-mail jest wymagany",
      })
      .min(1, "Adres e-mail jest wymagany")
      .email("Adres e-mail jest niepoprawny"),
    photo: z.string().optional(),
    password: z
      .string({
        required_error: "Hasło jest wymagane",
      })
      .min(1, "Hasło jest wymagane")
      .min(8, "Hasło musi składać się z co najmniej 8 znaków")
      .max(32, "Hasło nie może mieć więcej niż 32 znaki"),
    passwordConfirm: z
      .string({
        required_error: "Potwierdź hasło",
      })
      .min(1, "Potwierdź hasło"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Hasła są różne",
  });

export const LoginUserSchema = z.object({
  email: z
    .string({
      required_error: "Adres e-mail jest wymagany",
    })
    .min(1, "Adres e-mail jest wymagany")
    .email("Adres e-mail jest niepoprawny"),
  password: z
    .string({
      required_error: "Hasło jest wymagane",
    })
    .min(1, "Hasło jest wymagane"),
});

export const EditUserSchema = z.object({
  name: z
    .string({
      required_error: "Nazwa użytkownika jest wymagana",
    })
    .min(2, "Nazwa użytkownika powinna składać się z minimum 2 znaków"),
  email: z
    .string({
      required_error: "Adres e-mail jest wymagany",
    })
    .min(1, "Adres e-mail jest wymagany")
    .email("Adres e-mail jest nieprawidłowy"),
  photo: z.string().nullable(),
});

export const ForgotPasswordSchema = z.object({
  email: z
    .string({ required_error: "Proszę wprowadzić adres e-mail" })
    .email("Niepoprawny adres email"),
});

export const ResetPasswordSchema = z
  .object({
    password: z
      .string({
        required_error: "Hasło jest wymagane",
      })
      .min(1, "Hasło jest wymagane")
      .min(8, "Hasło musi składać się z co najmniej 8 znaków")
      .max(32, "Hasło nie może mieć więcej niż 32 znaki"),
    passwordConfirm: z
      .string({
        required_error: "Potwierdź hasło",
      })
      .min(1, "Potwierdź hasło"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Hasła są różne",
  });

export type LoginUserInput = z.infer<typeof LoginUserSchema>;
export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;
export type EditUserInput = z.infer<typeof EditUserSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
