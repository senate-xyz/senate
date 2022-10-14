import "../../styles/globals.css";
import { TrackerTab } from "../../components/views/tracker/Tracker";

export default {
  title: "Tracker/TrackerTab",
  component: TrackerTab,
};

const Template = (args) => <TrackerTab {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  daoName: "Aave",
  daoPicture: "https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png",
};
