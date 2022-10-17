import "../../styles/globals.css";
import { TrackerThead } from "../../components/views/tracker/table/TrackerTable";

export default {
  title: "Tracker/TrackerThead",
  component: TrackerThead,
};

const Template = (args) => <TrackerThead {...args} />;

export const Primary = Template.bind({});
