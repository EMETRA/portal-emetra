"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "../../atoms";
import { Input } from "../../atoms/Input";
import classNames from "classnames";
import styles from "./Footer.module.scss";
import { submitContactForm, FormState } from "@/lib/actions/contact";

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button 
      type="submit" 
      className={classNames(styles.Button)}
      disabled={pending}
    >
      {pending ? "Enviando..." : "Enviar"}
    </Button>
  );
}

const ContactForm: React.FC = () => {
  const initialState: FormState = {};
  const [state, dispatch] = useFormState(submitContactForm, initialState);

  return (
    <form className={classNames(styles.Form)} action={dispatch}>
      <div className={classNames(styles.FormContent)}>
        <h4>QUEREMOS TRABAJAR JUNTO A TI</h4>
        <p>
          Si deseas más información envíanos tu correo y pronto te estaremos
          contactando:
        </p>
        {state?.message && (
          <div className={classNames(styles.Message, {
            [styles.Success]: state.success,
            [styles.Error]: !state.success
          })}>
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
                [styles.InputError]: state?.errors?.email
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
        <SubmitButton />
      </div>
    </form>
  );
};

export default ContactForm;
