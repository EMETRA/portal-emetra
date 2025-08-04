import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LoadingSpinner } from "./index";

const meta: Meta<typeof LoadingSpinner> = {
  title: "Components/Server/LoadingSpinner",
  component: LoadingSpinner,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["page-wide", "inline"],
      description: "Variante del spinner de carga",
    },
    visible: {
      control: { type: "boolean" },
      description: "Controla la visibilidad del spinner",
    },
    className: {
      control: { type: "text" },
      description: "Clase CSS adicional",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const PageWide: Story = {
  args: {
    variant: "page-wide",
    visible: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Spinner que ocupa toda la pantalla con overlay de fondo.",
      },
    },
  },
};

export const Inline: Story = {
  args: {
    variant: "inline",
    visible: true,
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        story:
          "Spinner más pequeño para uso inline dentro de otros componentes.",
      },
    },
  },
};

export const Hidden: Story = {
  args: {
    variant: "page-wide",
    visible: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Spinner oculto (opacity: 0) para demostrar la transición.",
      },
    },
  },
};

export const InlineHidden: Story = {
  args: {
    variant: "inline",
    visible: false,
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        story: "Spinner inline oculto.",
      },
    },
  },
};

export const WithCustomClass: Story = {
  args: {
    variant: "inline",
    visible: true,
    className: "custom-spinner",
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        story: "Spinner con clase CSS personalizada.",
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ padding: "20px" }}>
      <h3>Page-wide (visible)</h3>
      <div
        style={{
          position: "relative",
          height: "200px",
          border: "1px solid #ccc",
          marginBottom: "20px",
        }}
      >
        <LoadingSpinner variant="page-wide" visible={true} />
      </div>

      <h3>Inline variants</h3>
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <div>
          <p>Visible:</p>
          <LoadingSpinner variant="inline" visible={true} />
        </div>
        <div>
          <p>Hidden:</p>
          <LoadingSpinner variant="inline" visible={false} />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story: "Muestra todas las variantes del LoadingSpinner.",
      },
    },
  },
};
