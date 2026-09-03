"use client";

import { FormEvent, useState } from "react";
import { Button } from "../../atoms";
import { Input } from "../../atoms/Input";
import classNames from "classnames";
import styles from "./Footer.module.scss";
import {
  submitContactFormClient,
  type ContactFormState,
} from "@/lib/contact/client";

const ContactForm: React.FC = () => {
  const [state, setState] = useState<ContactFormState>({});
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");

    setPending(true);
    try {
      const result = await submitContactFormClient(email);
      setState(result);
    } finally {
      setPending(false);
    }
  }

  return (
    <form className={classNames(styles.Form)} onSubmit={handleSubmit}>
      <div className={classNames(styles.FormContent)}>
        <h4>QUEREMOS TRABAJAR JUNTO A TI</h4>
        <p>
          Si deseas mas informacion envianos tu correo y pronto te estaremos
          contactando:
        </p>
        {state?.message && (
          <div
            className={classNames(styles.Message, {
              [styles.Success]: state.success,
              [styles.Error]: !state.success,
            })}
          >
            {state.message}
          </div>
        )}
      </div>
      <div className={classNames(styles.FormInput)}>
        <div className={classNames(styles.Field)}>
          <Input
            name="email"
            type="email"
            placeholder="Introduce tu correo electronico"
            className={classNames(styles.Input, {
              [styles.InputError]: state?.errors?.email,
            })}
            required
          />
          {state?.errors?.email && (
            <div className={classNames(styles.FieldError)}>
              {state.errors.email.map((error: string) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}
        </div>
        <Button
          type="submit"
          className={classNames(styles.Button)}
          disabled={pending}
        >
          {pending ? "Enviando..." : "Enviar"}
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;
