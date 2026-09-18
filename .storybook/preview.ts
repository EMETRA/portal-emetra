import type { Preview } from "@storybook/nextjs-vite";
import React from "react";
import localFont from "next/font/local";

const montserrat = localFont({
  src: [
    {
      path: "../src/theme/fonts/Montserrat-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../src/theme/fonts/Montserrat-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../src/theme/fonts/Montserrat-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../src/theme/fonts/Montserrat-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      test: "todo",
    },
  },
  decorators: [
    (Story) =>
      React.createElement(
        "div",
        { className: montserrat.className },
        React.createElement(Story)
      ),
  ],
};

export default preview;