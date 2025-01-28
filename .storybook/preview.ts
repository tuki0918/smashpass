import type { Preview } from "@storybook/react";
import "app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // https://storybook.js.org/docs/get-started/frameworks/nextjs
    nextjs: {
      appDirectory: true,
    },
  },
};

export default preview;
