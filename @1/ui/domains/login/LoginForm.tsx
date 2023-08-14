//

import { Field, Form, Formik, type FormikConfig } from "formik";
import { Button } from "../../components/Button";

export function LoginForm({
  onLogin,
  onSignUp,
}: {
  onLogin: LoginProps["onSubmit"];
  onSignUp: SignUpProps["onSubmit"];
}) {
  return (
    <div
      className="
      grid
      grid-cols-1
      gap-5
      rounded-md
      border
      bg-white
      px-4
      py-5
      text-Dove_Gray
      shadow-[10px_10px_10px_#00000029]
    "
    >
      <SignUp onSubmit={onSignUp} />
      <hr />
      <Login onSubmit={onLogin} />
    </div>
  );
}

export function SignUp({ onSubmit }: SignUpProps) {
  return (
    <Formik initialValues={{ email: "", as: "" }} onSubmit={onSubmit}>
      {({ isSubmitting, setFieldValue }) => (
        <Form className="flex flex-col items-center space-y-5">
          <h1 className="text-center text-sm font-bold uppercase">
            Créer un compte
          </h1>

          <Field
            className="h-8 rounded-sm border border-solid border-[#dddddd] px-3 py-2 text-xs placeholder-[#AAAAAA]"
            name="email"
            placeholder="Adresse email"
            required
            type="email"
          />

          <Button
            variant="tertiary"
            type="submit"
            disabled={isSubmitting}
            onClick={() => setFieldValue("as", "student")}
          >
            Étudiant
          </Button>

          <Button
            variant="secondary"
            type="submit"
            disabled={true}
            className="opacity-10"
            onClick={() => setFieldValue("as", "partner")}
          >
            Partenaire
          </Button>
        </Form>
      )}
    </Formik>
  );
}

export function Login({ onSubmit }: LoginProps) {
  return (
    <Formik initialValues={{ email: "" }} onSubmit={onSubmit}>
      {({ isSubmitting }) => (
        <Form className="flex flex-col items-center space-y-5">
          <Field
            className="h-8 rounded-sm border border-solid border-[#dddddd] px-3 py-2 text-xs placeholder-[#AAAAAA]"
            name="email"
            placeholder="Adresse email"
            required
            type="email"
          />

          <Button variant="primary" type="submit" disabled={isSubmitting}>
            Étudiant
          </Button>
        </Form>
      )}
    </Formik>
  );
}

//

type LoginProps = { onSubmit: FormikConfig<{ email: string }>["onSubmit"] };
type SignUpProps = {
  onSubmit: FormikConfig<{ email: string; as: string }>["onSubmit"];
};
