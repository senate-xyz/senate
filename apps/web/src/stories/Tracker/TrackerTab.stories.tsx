// YourComponent.stories.js|jsx

import { TrackerTab } from "../../components/views/tracker/Tracker";
export default {
  title: "TrackerTab",
  component: TrackerTab,
};

const Template = (args) => <TrackerTab {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  daoName: "Dao Name",
  daoPicture:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ethereum_logo_2014.svg/1257px-Ethereum_logo_2014.svg.png",
};
