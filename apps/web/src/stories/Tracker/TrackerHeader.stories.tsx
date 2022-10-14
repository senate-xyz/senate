import "../../styles/globals.css";
import { TrackerHeader } from "../../components/views/tracker/Tracker";

export default {
  title: "Tracker/TrackerHeader",
  component: TrackerHeader,
};

const Template = (args) => <TrackerHeader {...args} />;

export const withShare = Template.bind({});
withShare.args = {
  shareButton: true,
};

export const withoutShare = Template.bind({});
withoutShare.args = {
  shareButton: false,
};
