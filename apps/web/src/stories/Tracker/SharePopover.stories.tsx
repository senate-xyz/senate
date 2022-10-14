// YourComponent.stories.js|jsx

import { SharePopover } from "../components/views/tracker/SharePopover";

//👇 This default export determines where your story goes in the story list
export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "SharePopover",
  component: SharePopover,
};

//👇 We create a “template” of how args map to rendering
const Template = (args) => <SharePopover {...args} />;

export const FirstStory = {
  args: {
    //👇 The args you need here will depend on your component
  },
};
