import CasilleroDriveLinkField from "@/components/client/molecules/CasilleroDriveLinkField/CasilleroDriveLinkField";
import AccessField from "./AccessField";

export default function LegalRegisterFields() {
  return (
    <>
      <AccessField id="dpi" label="DPI" type="text" placeholder="123456789123" required />
      <AccessField id="nit" label="NIT" type="text" placeholder="12345678" required />
      <CasilleroDriveLinkField
        id="rtu-link"
        label="RTU"
        placeholder="https://drive.google.com/..."
      />
      <CasilleroDriveLinkField
        id="legal-mandate-link"
        label="Mandato Representante Legal"
        placeholder="https://drive.google.com/..."
      />
      <AccessField
        id="email"
        label="Correo electrónico"
        type="email"
        placeholder="example@muniguate.com"
        autoComplete="email"
        required
      />
      <AccessField
        id="confirm-email"
        label="Confirmar correo electrónico"
        type="email"
        placeholder="example@muniguate.com"
        autoComplete="email"
        required
      />
      <AccessField
        id="phone"
        label="Teléfono"
        type="tel"
        placeholder="12345678"
        required
      />
      <AccessField
        id="password"
        label="Contraseña"
        type="password"
        placeholder="Ingresa tu contraseña"
        autoComplete="new-password"
        required
      />
      <AccessField
        id="confirm-password"
        label="Confirmar contraseña"
        type="password"
        placeholder="Confirma tu contraseña"
        autoComplete="new-password"
        required
      />
    </>
  );
}
