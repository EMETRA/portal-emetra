import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FileUploader } from "./index";

const meta: Meta<typeof FileUploader> = {
  title: "Molecules/FileUploader",
  component: FileUploader,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Acepta JPG, PNG y PDF de hasta 1 MB, con un máximo de 3 archivos. Otro tipo se rechaza por formato, un archivo de más de 1 MB por tamaño y el que exceda las 3 filas por límite.",
      },
    },
  },
  argTypes: {
    onChange: {
      action: "changed",
      description: "Archivos que ya terminaron de cargar",
    },
    maxSizeBytes: {
      control: { type: "number" },
      description: "Tamaño máximo por archivo, en bytes",
    },
    maxFiles: {
      control: { type: "number" },
      description: "Cantidad máxima de archivos",
    },
    dropLabel: {
      control: { type: "text" },
    },
    selectLabel: {
      control: { type: "text" },
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
};

export default meta;

export const Default: StoryObj<typeof FileUploader> = {
  args: {
    accept: ["image/jpeg", "image/png", "application/pdf"],
    maxSizeBytes: 1024 * 1024,
    maxFiles: 3,
    dropLabel: "Arrastra tus anexos aquí",
    selectLabel: "Seleccionar archivos",
  },
  render: (args) => (
    <div style={{ background: "#f6f6f6", minHeight: "100vh", padding: 24 }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <FileUploader {...args} />
      </div>
    </div>
  ),
};
