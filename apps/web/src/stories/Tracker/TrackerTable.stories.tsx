import "../../styles/globals.css";
import { TrackerTable } from "../../components/views/tracker/table/TrackerTable";

export default {
  title: "Tracker/TrackerTable",
  component: TrackerTable,
};

const Template = (args) => <TrackerTable {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  votes: {
    status: "success",
    isLoading: false,
    isSuccess: true,
    isError: false,
    isIdle: false,
    data: [
      {
        id: "cl95izuz6000maqdvpm4lj6ba",
        externalId: "1",
        name: "Aave proposal test snapshot",
        description: "Test description",
        daoId: "cl95izuyi0002aqdvdgb721xj",
        daoHandlerId: "cl95izuyi0003aqdv41llbvx9",
        proposalType: "SNAPSHOT",
        data: { timeEnd: 1665975385, timeStart: 1664975385 },
        dao: {
          id: "cl95izuyi0002aqdvdgb721xj",
          name: "Aave",
          picture:
            "https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png",
        },
        votes: [
          {
            id: "cl95izuza000paqdve5bzneil",
            userId: "cl95izuy90000aqdvhs3u5e69",
            proposalId: "cl95izuz6000maqdvpm4lj6ba",
            daoId: "cl95izuyi0002aqdvdgb721xj",
            daoHandlerId: "cl95izuyi0003aqdv41llbvx9",
          },
        ],
      },
      {
        id: "cl95izuz8000oaqdvvnlmic66",
        externalId: "2",
        name: "Aave proposal test bravo",
        description: "Test description 2",
        daoId: "cl95izuyi0002aqdvdgb721xj",
        daoHandlerId: "cl95izuyi0003aqdv41llbvx9",
        proposalType: "BRAVO1",
        data: { timeEnd: 1665975385, timeStart: 1664975385 },
        dao: {
          id: "cl95izuyi0002aqdvdgb721xj",
          name: "Aave",
          picture:
            "https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png",
        },
        votes: [
          {
            id: "cl95izuze000taqdvm13n5ihf",
            userId: "cl95izuy90000aqdvhs3u5e69",
            proposalId: "cl95izuz8000oaqdvvnlmic66",
            daoId: "cl95izuyi0002aqdvdgb721xj",
            daoHandlerId: "cl95izuyi0003aqdv41llbvx9",
          },
        ],
      },
      {
        id: "cl95izuz2000laqdvdl4afp7p",
        externalId: "3",
        name: "ENS proposal test snapshot",
        description: "Test description",
        daoId: "cl95izuys000caqdv0c4y2fht",
        daoHandlerId: "cl95izuys000daqdvrkx3m66l",
        proposalType: "SNAPSHOT",
        data: { timeEnd: 1665975385, timeStart: 1664975385 },
        dao: {
          id: "cl95izuys000caqdv0c4y2fht",
          name: "ENS",
          picture:
            "https://cdn.stamp.fyi/space/ens.eth?s=160&cb=bc8a2856691e05ab",
        },
        votes: [],
      },
    ],
    dataUpdatedAt: 1665763519633,
    error: null,
    errorUpdatedAt: 0,
    failureCount: 0,
    errorUpdateCount: 0,
    isFetched: true,
    isFetchedAfterMount: true,
    isFetching: false,
    isRefetching: false,
    isLoadingError: false,
    isPlaceholderData: false,
    isPreviousData: false,
    isRefetchError: false,
    isStale: true,
  },
  daosTabs: [
    {
      id: "cl95izuyi0002aqdvdgb721xj",
      name: "Aave",
      picture: "https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png",
    },
    {
      id: "cl95izuys000caqdv0c4y2fht",
      name: "ENS",
      picture: "https://cdn.stamp.fyi/space/ens.eth?s=160&cb=bc8a2856691e05ab",
    },
  ],
  selectedDao: "Aave",
};
