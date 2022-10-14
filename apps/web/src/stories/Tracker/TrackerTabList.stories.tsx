// YourComponent.stories.js|jsx

import { TrackerTabList } from "../../components/views/tracker/Tracker";
export default {
  title: "TrackerTabList",
  component: TrackerTabList,
};

const Template = (args) => <TrackerTabList {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  daosTabs: [
    {
      name: "test",
      picture:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ethereum_logo_2014.svg/1257px-Ethereum_logo_2014.svg.png",
    },
    {
      name: "another test",
      picture:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ethereum_logo_2014.svg/1257px-Ethereum_logo_2014.svg.png",
    },
  ],
};
